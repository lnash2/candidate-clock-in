// Clean PostgreSQL dump file content to remove metadata and non-SQL content
export const cleanPostgreSQLDump = (sqlContent: string): string => {
  const lines = sqlContent.split('\n');
  const cleanedLines: string[] = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Skip comment lines
    if (trimmedLine.startsWith('--')) continue;
    
    // Skip PostgreSQL dump metadata
    if (trimmedLine.match(/^(SET|SELECT|COPY|\\|Type|Schema|Owner|Name|Table|Source|Target)/i)) continue;
    
    // Skip lines that are just dashes or equals
    if (trimmedLine.match(/^[-=]+$/)) continue;
    
    // Skip lines with just numbers (table counts, etc.)
    if (trimmedLine.match(/^\d+$/)) continue;
    
    // Skip lines that look like table headers
    if (trimmedLine.match(/^\([0-9]+ rows?\)$/i)) continue;
    
    cleanedLines.push(line);
  }
  
  return cleanedLines.join('\n');
};

// Validate that a SQL statement is safe and executable
export const validateSqlStatement = (statement: string): { valid: boolean; error?: string } => {
  const trimmed = statement.trim().toUpperCase();
  
  // Must not be empty
  if (!trimmed) {
    return { valid: false, error: 'Empty statement' };
  }
  
  // Must be a valid SQL statement type
  const validStatements = ['CREATE', 'INSERT', 'UPDATE', 'DELETE', 'SELECT', 'ALTER', 'DROP'];
  const startsWithValidKeyword = validStatements.some(keyword => trimmed.startsWith(keyword));
  
  if (!startsWithValidKeyword) {
    return { valid: false, error: `Invalid SQL statement: ${statement.substring(0, 50)}...` };
  }
  
  // Check for dangerous operations
  if (trimmed.includes('DROP DATABASE') || trimmed.includes('DROP SCHEMA')) {
    return { valid: false, error: 'Dangerous operation not allowed' };
  }
  
  return { valid: true };
};

export const transformSqlWithPcrmSuffix = (sqlContent: string): string => {
  // First clean the PostgreSQL dump content
  let cleanedSql = cleanPostgreSQLDump(sqlContent);
  
  // Transform CREATE TABLE statements
  let transformedSql = cleanedSql.replace(
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

  return transformedSql;
};

export const splitSqlIntoStatements = (sql: string): string[] => {
  // Split by semicolon but handle multi-line statements properly
  const statements: string[] = [];
  let currentStatement = '';
  let inQuotes = false;
  let quoteChar = '';
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const prevChar = i > 0 ? sql[i - 1] : '';
    
    // Handle quote detection
    if ((char === '"' || char === "'") && prevChar !== '\\') {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
        quoteChar = '';
      }
    }
    
    // Handle statement termination
    if (char === ';' && !inQuotes) {
      const statement = currentStatement.trim();
      if (statement) {
        const validation = validateSqlStatement(statement);
        if (validation.valid) {
          statements.push(statement);
        } else {
          console.warn(`Skipping invalid statement: ${validation.error}`);
        }
      }
      currentStatement = '';
    } else {
      currentStatement += char;
    }
  }
  
  // Handle final statement if no trailing semicolon
  const finalStatement = currentStatement.trim();
  if (finalStatement) {
    const validation = validateSqlStatement(finalStatement);
    if (validation.valid) {
      statements.push(finalStatement);
    }
  }
  
  return statements;
};