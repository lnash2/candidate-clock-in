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
    /CREATE TABLE\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, tableName) => {
      if (tableName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return `CREATE TABLE ${schemaPrefix}${objQuote}${tableName}_PCRM${objQuote}`;
    }
  );

  // Transform CREATE TYPE statements (enums, custom types)
  transformedSql = transformedSql.replace(
    /CREATE TYPE\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, typeName) => {
      if (typeName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return `CREATE TYPE ${schemaPrefix}${objQuote}${typeName}_PCRM${objQuote}`;
    }
  );

  // Transform CREATE FUNCTION statements
  transformedSql = transformedSql.replace(
    /CREATE(?:\s+OR\s+REPLACE)?\s+FUNCTION\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, functionName) => {
      if (functionName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return match.replace(new RegExp(`${schemaPrefix}${objQuote}${functionName}${objQuote}`), `${schemaPrefix}${objQuote}${functionName}_PCRM${objQuote}`);
    }
  );

  // Transform CREATE INDEX statements
  transformedSql = transformedSql.replace(
    /CREATE(?:\s+UNIQUE)?\s+INDEX\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, indexName) => {
      if (indexName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return match.replace(new RegExp(`${schemaPrefix}${objQuote}${indexName}${objQuote}`), `${schemaPrefix}${objQuote}${indexName}_PCRM${objQuote}`);
    }
  );

  // Transform CREATE SEQUENCE statements
  transformedSql = transformedSql.replace(
    /CREATE SEQUENCE\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, sequenceName) => {
      if (sequenceName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return `CREATE SEQUENCE ${schemaPrefix}${objQuote}${sequenceName}_PCRM${objQuote}`;
    }
  );

  // Transform CREATE TRIGGER statements
  transformedSql = transformedSql.replace(
    /CREATE TRIGGER\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, triggerName) => {
      if (triggerName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return `CREATE TRIGGER ${schemaPrefix}${objQuote}${triggerName}_PCRM${objQuote}`;
    }
  );

  // Transform CREATE VIEW statements
  transformedSql = transformedSql.replace(
    /CREATE VIEW\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, viewName) => {
      if (viewName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return `CREATE VIEW ${schemaPrefix}${objQuote}${viewName}_PCRM${objQuote}`;
    }
  );

  // Transform INSERT INTO statements
  transformedSql = transformedSql.replace(
    /INSERT INTO\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, tableName) => {
      if (tableName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return `INSERT INTO ${schemaPrefix}${objQuote}${tableName}_PCRM${objQuote}`;
    }
  );

  // Transform REFERENCES in foreign keys
  transformedSql = transformedSql.replace(
    /REFERENCES\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, tableName) => {
      if (tableName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return `REFERENCES ${schemaPrefix}${objQuote}${tableName}_PCRM${objQuote}`;
    }
  );

  // Transform type references in function parameters and return types
  transformedSql = transformedSql.replace(
    /\b(\w+)(?=\s*(?:\[\])?(?:\s*,|\s*\)|\s+DEFAULT|\s*$))/gi,
    (match, typeName) => {
      // Only transform custom types, not built-in PostgreSQL types
      const builtinTypes = ['integer', 'text', 'varchar', 'char', 'boolean', 'date', 'timestamp', 'numeric', 'decimal', 'real', 'bigint', 'smallint', 'serial', 'bigserial', 'uuid', 'json', 'jsonb', 'bytea', 'inet', 'cidr', 'macaddr', 'xml', 'money', 'point', 'line', 'lseg', 'box', 'path', 'polygon', 'circle', 'interval', 'time', 'timetz', 'timestamptz'];
      
      if (builtinTypes.includes(typeName.toLowerCase()) || typeName.toLowerCase().endsWith('_pcrm')) {
        return match;
      }
      
      // Check if this looks like a custom type (not a column name or keyword)
      if (/^[a-z_][a-z0-9_]*$/i.test(typeName) && typeName.length > 2) {
        return `${typeName}_PCRM`;
      }
      
      return match;
    }
  );

  // Transform enum references in INSERT statements and other contexts
  transformedSql = transformedSql.replace(
    /::(\w+)/gi,
    (match, typeName) => {
      if (typeName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      
      // Only transform custom types, not built-in types
      const builtinTypes = ['integer', 'text', 'varchar', 'char', 'boolean', 'date', 'timestamp', 'numeric', 'decimal', 'real', 'bigint', 'smallint', 'uuid', 'json', 'jsonb'];
      
      if (builtinTypes.includes(typeName.toLowerCase())) {
        return match;
      }
      
      return `::${typeName}_PCRM`;
    }
  );

  return transformedSql;
};

export const splitSqlIntoStatements = (sql: string): string[] => {
  const statements: string[] = [];
  let currentStatement = '';
  let inQuotes = false;
  let quoteChar = '';
  let inDollarQuoted = false;
  let dollarTag = '';
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const prevChar = i > 0 ? sql[i - 1] : '';
    
    // Handle dollar-quoted strings (PostgreSQL function bodies)
    if (char === '$' && !inQuotes) {
      // Look for dollar tag start/end
      let tagEnd = i + 1;
      while (tagEnd < sql.length && sql[tagEnd] !== '$') {
        tagEnd++;
      }
      
      if (tagEnd < sql.length) {
        const potentialTag = sql.substring(i, tagEnd + 1);
        
        if (!inDollarQuoted) {
          // Starting a dollar-quoted section
          inDollarQuoted = true;
          dollarTag = potentialTag;
          currentStatement += sql.substring(i, tagEnd + 1);
          i = tagEnd;
          continue;
        } else if (potentialTag === dollarTag) {
          // Ending the dollar-quoted section
          inDollarQuoted = false;
          dollarTag = '';
          currentStatement += sql.substring(i, tagEnd + 1);
          i = tagEnd;
          continue;
        }
      }
    }
    
    // Handle regular quote detection (only when not in dollar-quoted)
    if (!inDollarQuoted && (char === '"' || char === "'") && prevChar !== '\\') {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
        quoteChar = '';
      }
    }
    
    // Handle statement termination
    if (char === ';' && !inQuotes && !inDollarQuoted) {
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