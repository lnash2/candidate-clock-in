interface GitHubLfsResponse {
  success: boolean;
  content?: string;
  error?: string;
  size?: number;
}

interface LfsPointer {
  oid: string;
  size: number;
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    type: string;
  };
  private: boolean;
  permissions?: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
}

export class GitHubLfsService {
  private static githubToken: string | null = null;

  static setGitHubToken(token: string) {
    this.githubToken = token;
  }

  private static getHeaders() {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (this.githubToken) {
      headers['Authorization'] = `token ${this.githubToken}`;
    }
    
    return headers;
  }

  static async getUserRepositories(): Promise<{ repositories: GitHubRepository[]; error?: string }> {
    try {
      const response = await fetch(
        'https://api.github.com/user/repos?per_page=100&sort=updated',
        { headers: this.getHeaders() }
      );
      
      if (!response.ok) {
        return { repositories: [], error: `Failed to fetch repositories: ${response.statusText}` };
      }
      
      const data = await response.json();
      return { repositories: data };
    } catch (error) {
      return { repositories: [], error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  static async validateBranch(repoOwner: string, repoName: string, branch: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/branches/${branch}`,
        { headers: this.getHeaders() }
      );
      
      if (response.ok) {
        return { valid: true };
      } else if (response.status === 404) {
        return { valid: false, error: `Branch '${branch}' not found` };
      } else {
        return { valid: false, error: `Failed to validate branch: ${response.statusText}` };
      }
    } catch (error) {
      return { valid: false, error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  static async checkFileExists(repoOwner: string, repoName: string, filePath: string, branch: string): Promise<{ exists: boolean; error?: string }> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`,
        { headers: this.getHeaders() }
      );
      
      if (response.ok) {
        return { exists: true };
      } else if (response.status === 404) {
        return { exists: false, error: `File '${filePath}' not found in branch '${branch}'` };
      } else {
        return { exists: false, error: `Failed to check file: ${response.statusText}` };
      }
    } catch (error) {
      return { exists: false, error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  static async fetchLfsFile(repoOwner: string, repoName: string, filePath: string, branch: string = 'main'): Promise<GitHubLfsResponse> {
    const requestUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`;
    console.log(`🔍 Fetching file: ${filePath} from ${repoOwner}/${repoName}@${branch}`);
    console.log(`📡 Request URL: ${requestUrl}`);

    try {
      // First attempt: GitHub Contents API
      const response = await this.fetchWithRetry(requestUrl, { headers: this.getHeaders() });
      
      if (!response.ok) {
        const errorDetails = await this.getDetailedError(response);
        console.error(`❌ Contents API failed (${response.status}):`, errorDetails);
        
        // If it's a rate limit, throw immediately
        if (response.status === 403) {
          throw new Error(`GitHub API rate limit exceeded. Status: ${response.status}. ${errorDetails}`);
        }
        
        // For other errors, try raw endpoint as fallback
        console.log(`🔄 Trying raw endpoint fallback...`);
        return await this.fetchFromRawEndpoint(repoOwner, repoName, filePath, branch);
      }

      const data = await response.json();
      console.log(`📊 File metadata:`, {
        name: data.name,
        size: data.size,
        encoding: data.encoding,
        hasContent: !!data.content
      });
      
      // Check if this is a regular file (not LFS)
      if (data.content && data.encoding === 'base64') {
        console.log(`✅ Regular file detected, decoding base64 content`);
        const content = atob(data.content.replace(/\s/g, ''));
        
        // Validate it's SQL content - if it's an LFS pointer, try raw endpoint
        if (!this.isValidSqlContent(content, filePath)) {
          console.warn(`⚠️ Contents API returned LFS pointer or invalid SQL, trying raw endpoint...`);
          return await this.fetchFromRawEndpoint(repoOwner, repoName, filePath, branch);
        }
        
        console.log(`✅ Successfully fetched ${content.length} characters from Contents API`);
        return {
          success: true,
          content,
          size: content.length
        };
      }
      
      // If no content in response, it might be LFS - try raw endpoint
      console.log(`🔄 No content in Contents API response, trying raw endpoint...`);
      return await this.fetchFromRawEndpoint(repoOwner, repoName, filePath, branch);
      
    } catch (error) {
      console.error('💥 GitHub file fetch error:', error);
      
      // Provide detailed error message
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      return {
        success: false,
        error: `Failed to fetch ${filePath}: ${errorMessage}`
      };
    }
  }

  private static async fetchFromRawEndpoint(repoOwner: string, repoName: string, filePath: string, branch: string): Promise<GitHubLfsResponse> {
    const rawUrl = `https://github.com/${repoOwner}/${repoName}/raw/${branch}/${filePath}`;
    console.log(`📡 Raw endpoint URL: ${rawUrl}`);
    
    try {
      const rawResponse = await this.fetchWithRetry(rawUrl);
      
      if (!rawResponse.ok) {
        const errorDetails = await this.getDetailedError(rawResponse);
        console.error(`❌ Raw endpoint failed (${rawResponse.status}):`, errorDetails);
        throw new Error(`Raw endpoint failed: ${rawResponse.status} - ${errorDetails}`);
      }

      const content = await rawResponse.text();
      
      // Validate it's SQL content - if it's still an LFS pointer, return error
      if (!this.isValidSqlContent(content, filePath)) {
        if (content.includes('version https://git-lfs.github.com/spec/v1')) {
          throw new Error(`File ${filePath} is stored in Git LFS and cannot be accessed directly. Please download the actual SQL file or use a repository without LFS.`);
        } else {
          throw new Error(`File ${filePath} does not contain valid SQL content.`);
        }
      }
      
      console.log(`✅ Successfully fetched ${content.length} characters from raw endpoint`);
      return {
        success: true,
        content,
        size: content.length
      };
    } catch (error) {
      console.error('💥 Raw endpoint fetch error:', error);
      throw error;
    }
  }

  private static async fetchWithRetry(url: string, options?: RequestInit, maxRetries: number = 3): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries} for: ${url}`);
        
        const response = await fetch(url, {
          ...options,
          signal: AbortSignal.timeout(30000) // 30 second timeout
        });
        
        // If rate limited, wait and retry
        if (response.status === 403 && attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`⏳ Rate limited, waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`❌ Attempt ${attempt} failed:`, lastError.message);
        
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`⏳ Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    throw lastError || new Error('All retry attempts failed');
  }

  private static async getDetailedError(response: Response): Promise<string> {
    try {
      const text = await response.text();
      if (text) {
        // Try to parse as JSON for GitHub API errors
        try {
          const json = JSON.parse(text);
          return json.message || json.error || text;
        } catch {
          return text;
        }
      }
      return response.statusText || `HTTP ${response.status}`;
    } catch {
      return response.statusText || `HTTP ${response.status}`;
    }
  }

  private static isValidSqlContent(content: string, filePath: string): boolean {
    if (!content || content.trim().length === 0) {
      return false;
    }
    
    // Check if it's a Git LFS pointer
    if (content.includes('version https://git-lfs.github.com/spec/v1')) {
      console.log(`📋 Detected Git LFS pointer in ${filePath}`);
      return false;
    }
    
    // Basic SQL validation
    const sqlKeywords = ['CREATE', 'INSERT', 'UPDATE', 'DELETE', 'SELECT', 'ALTER', 'DROP'];
    const upperContent = content.toUpperCase();
    const hasSqlKeywords = sqlKeywords.some(keyword => upperContent.includes(keyword));
    
    if (!hasSqlKeywords) {
      console.log(`⚠️ No SQL keywords found in ${filePath}`);
    }
    
    return hasSqlKeywords;
  }

  private static parseLfsPointer(content: string): LfsPointer | null {
    const lines = content.split('\n');
    let oid = '';
    let size = 0;

    for (const line of lines) {
      if (line.startsWith('oid sha256:')) {
        oid = line.replace('oid sha256:', '').trim();
      } else if (line.startsWith('size ')) {
        size = parseInt(line.replace('size ', '').trim());
      }
    }

    return oid && size ? { oid, size } : null;
  }

  static transformSqlWithPcrmSuffix(sqlContent: string): string {
    // Transform CREATE TABLE statements
    let transformedSql = sqlContent.replace(
      /CREATE TABLE\s+([`"]?)(\w+)\1/gi,
      (match, quote, tableName) => {
        if (tableName.toLowerCase().endsWith('_pcrm')) {
          return match; // Already has suffix
        }
        return `CREATE TABLE ${quote}${tableName}_PCRM${quote}`;
      }
    );

    // Transform INSERT INTO statements
    transformedSql = transformedSql.replace(
      /INSERT INTO\s+([`"]?)(\w+)\1/gi,
      (match, quote, tableName) => {
        if (tableName.toLowerCase().endsWith('_pcrm')) {
          return match; // Already has suffix
        }
        return `INSERT INTO ${quote}${tableName}_PCRM${quote}`;
      }
    );

    // Transform REFERENCES in foreign keys
    transformedSql = transformedSql.replace(
      /REFERENCES\s+([`"]?)(\w+)\1/gi,
      (match, quote, tableName) => {
        if (tableName.toLowerCase().endsWith('_pcrm')) {
          return match; // Already has suffix
        }
        return `REFERENCES ${quote}${tableName}_PCRM${quote}`;
      }
    );

    // Transform ALTER TABLE statements
    transformedSql = transformedSql.replace(
      /ALTER TABLE\s+([`"]?)(\w+)\1/gi,
      (match, quote, tableName) => {
        if (tableName.toLowerCase().endsWith('_pcrm')) {
          return match; // Already has suffix
        }
        return `ALTER TABLE ${quote}${tableName}_PCRM${quote}`;
      }
    );

    return transformedSql;
  }

  static async fetchSchemaFile(repoOwner: string, repoName: string, branch: string = 'main', folder: string = 'leg-sql'): Promise<GitHubLfsResponse> {
    return this.fetchLfsFile(repoOwner, repoName, `${folder}/legacy_schema.sql`, branch);
  }

  static async fetchDataFile(repoOwner: string, repoName: string, branch: string = 'main', folder: string = 'leg-sql'): Promise<GitHubLfsResponse> {
    return this.fetchLfsFile(repoOwner, repoName, `${folder}/legacy_data.sql`, branch);
  }

  static async getBranches(repoOwner: string, repoName: string): Promise<{ branches: string[]; error?: string }> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/branches`,
        { headers: this.getHeaders() }
      );
      
      if (!response.ok) {
        return { branches: [], error: `Failed to fetch branches: ${response.statusText}` };
      }
      
      const data = await response.json();
      const branches = data.map((branch: any) => branch.name);
      return { branches };
    } catch (error) {
      return { branches: [], error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  static async getFolders(repoOwner: string, repoName: string, branch: string): Promise<{ folders: string[]; error?: string }> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents?ref=${branch}`,
        { headers: this.getHeaders() }
      );
      
      if (!response.ok) {
        return { folders: [], error: `Failed to fetch folders: ${response.statusText}` };
      }
      
      const data = await response.json();
      // Filter for directories only and extract their names
      const folders = data
        .filter((item: any) => item.type === 'dir')
        .map((item: any) => item.name);
      
      return { folders };
    } catch (error) {
      return { folders: [], error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  static async getSqlFilesInFolder(repoOwner: string, repoName: string, folderPath: string, branch: string): Promise<{ files: string[]; error?: string }> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}?ref=${branch}`,
        { headers: this.getHeaders() }
      );
      
      if (!response.ok) {
        return { files: [], error: `Failed to fetch files in folder: ${response.statusText}` };
      }
      
      const data = await response.json();
      // Filter for SQL files only
      const sqlFiles = data
        .filter((item: any) => item.type === 'file' && item.name.toLowerCase().endsWith('.sql'))
        .map((item: any) => item.name);
      
      return { files: sqlFiles };
    } catch (error) {
      return { files: [], error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }
}