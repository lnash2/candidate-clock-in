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
  private static readonly BRANCH = '278b4e8ebf7cabc75525844cfba8e1deaa2178b2';

  static async fetchLfsFile(filePath: string): Promise<GitHubLfsResponse> {
    try {
      // First, get the LFS pointer from the regular file
      const pointerResponse = await fetch(
        `https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${filePath}?ref=${this.BRANCH}`
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
        `https://github.com/${this.REPO_OWNER}/${this.REPO_NAME}/raw/${this.BRANCH}/${filePath}`
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

  static async fetchSchemaFile(): Promise<GitHubLfsResponse> {
    return this.fetchLfsFile('leg-sql/legacy_schema.sql');
  }

  static async fetchDataFile(): Promise<GitHubLfsResponse> {
    return this.fetchLfsFile('leg-sql/legacy_data.sql');
  }
}