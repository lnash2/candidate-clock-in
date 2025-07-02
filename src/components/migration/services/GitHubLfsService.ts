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

export class GitHubLfsService {
  private static readonly REPO_OWNER = 'lnash2';
  private static readonly REPO_NAME = 'candidate-clock-in';
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

  static async validateBranch(branch: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}/branches/${branch}`,
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

  static async checkFileExists(filePath: string, branch: string): Promise<{ exists: boolean; error?: string }> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${filePath}?ref=${branch}`,
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

  static async fetchLfsFile(filePath: string, branch: string = 'main'): Promise<GitHubLfsResponse> {
    try {
      // First, get the LFS pointer from the regular file
      const pointerResponse = await fetch(
        `https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${filePath}?ref=${branch}`,
        { headers: this.getHeaders() }
      );

      if (!pointerResponse.ok) {
        throw new Error(`Failed to fetch LFS pointer: ${pointerResponse.statusText}`);
      }

      const pointerData = await pointerResponse.json();
      const pointerContent = atob(pointerData.content.replace(/\s/g, ''));
      
      // Parse the LFS pointer to get the OID
      const lfsPointer = this.parseLfsPointer(pointerContent);
      if (!lfsPointer) {
        throw new Error('Invalid LFS pointer format');
      }

      // Fetch the actual file content from GitHub LFS
      const lfsResponse = await fetch(
        `https://github.com/${this.REPO_OWNER}/${this.REPO_NAME}/raw/${branch}/${filePath}`
      );

      if (!lfsResponse.ok) {
        throw new Error(`Failed to fetch LFS content: ${lfsResponse.statusText}`);
      }

      const content = await lfsResponse.text();

      return {
        success: true,
        content,
        size: content.length
      };
    } catch (error) {
      console.error('GitHub LFS fetch error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
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

  static async fetchSchemaFile(branch: string = 'main', folder: string = 'leg-sql'): Promise<GitHubLfsResponse> {
    return this.fetchLfsFile(`${folder}/legacy_schema.sql`, branch);
  }

  static async fetchDataFile(branch: string = 'main', folder: string = 'leg-sql'): Promise<GitHubLfsResponse> {
    return this.fetchLfsFile(`${folder}/legacy_data.sql`, branch);
  }

  static async getBranches(): Promise<{ branches: string[]; error?: string }> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}/branches`,
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

  static async getFolders(branch: string): Promise<{ folders: string[]; error?: string }> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents?ref=${branch}`,
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

  static async getSqlFilesInFolder(folderPath: string, branch: string): Promise<{ files: string[]; error?: string }> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${folderPath}?ref=${branch}`,
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