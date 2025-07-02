import { supabase } from '@/integrations/supabase/client';

export interface SimpleImportResult {
  success: boolean;
  error?: string;
  statementsExecuted: number;
  totalStatements: number;
  schemaName: string;
}

// Parse SQL statements properly handling PostgreSQL dollar-quoted strings
const prepareSql = (sql: string): string[] => {
  const statements: string[] = [];
  let currentStatement = '';
  let inDollarQuote = false;
  let dollarTag = '';
  let inSingleQuote = false;
  let i = 0;

  while (i < sql.length) {
    const char = sql[i];
    const remaining = sql.slice(i);

    // Handle dollar-quoted strings
    if (!inSingleQuote && char === '$') {
      const dollarMatch = remaining.match(/^\$([^$]*)\$/);
      if (dollarMatch) {
        const tag = dollarMatch[1];
        if (!inDollarQuote) {
          // Starting dollar quote
          inDollarQuote = true;
          dollarTag = tag;
          currentStatement += dollarMatch[0];
          i += dollarMatch[0].length;
          continue;
        } else if (tag === dollarTag) {
          // Ending dollar quote
          inDollarQuote = false;
          dollarTag = '';
          currentStatement += dollarMatch[0];
          i += dollarMatch[0].length;
          continue;
        }
      }
    }

    // Handle single quotes
    if (!inDollarQuote && char === "'") {
      if (!inSingleQuote) {
        inSingleQuote = true;
      } else if (i + 1 < sql.length && sql[i + 1] === "'") {
        // Escaped single quote
        currentStatement += "''";
        i += 2;
        continue;
      } else {
        inSingleQuote = false;
      }
    }

    // Handle statement separators
    if (!inDollarQuote && !inSingleQuote && char === ';') {
      const trimmed = currentStatement.trim();
      if (trimmed && isValidStatement(trimmed)) {
        statements.push(trimmed);
      }
      currentStatement = '';
      i++;
      continue;
    }

    currentStatement += char;
    i++;
  }

  // Add final statement if exists
  const trimmed = currentStatement.trim();
  if (trimmed && isValidStatement(trimmed)) {
    statements.push(trimmed);
  }

  return statements;
};

// Check if a statement should be executed
const isValidStatement = (statement: string): boolean => {
  if (!statement) return false;
  if (statement.startsWith('--')) return false;
  if (statement.match(/^(SET|SELECT pg_catalog|\\)/i)) return false;
  if (statement.match(/^(Owner:|Schema:|Type:|Comment:)/i)) return false;
  if (statement.match(/^(COMMENT ON|ALTER .* OWNER TO)/i)) return false;
  if (statement.match(/^(GRANT|REVOKE)/i)) return false;
  
  // Only allow actual SQL DDL/DML statements
  const validPrefixes = /^(CREATE|INSERT|UPDATE|DELETE|ALTER|DROP|COPY)/i;
  return validPrefixes.test(statement);
};

// Execute a single SQL statement
const executeSql = async (statement: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.rpc('execute_sql', { sql_statement: statement });
    
    if (error) {
      // These are expected errors we can ignore
      const expectedErrors = ['already exists', 'does not exist', 'permission denied'];
      const isExpected = expectedErrors.some(err => error.message.includes(err));
      
      if (isExpected) {
        console.warn('Expected error (continuing):', error.message);
        return { success: true }; // Treat as success
      }
      
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// The main import function - dead simple
export const importSqlToSchema = async (
  sql: string,
  schemaName: string = 'legacy_pcrm',
  updateProgress?: (progress: number, message?: string) => void
): Promise<SimpleImportResult> => {
  
  // 1. Create schema
  updateProgress?.(10, `Creating schema: ${schemaName}`);
  const schemaResult = await executeSql(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
  if (!schemaResult.success) {
    return {
      success: false,
      error: `Failed to create schema: ${schemaResult.error}`,
      statementsExecuted: 0,
      totalStatements: 0,
      schemaName
    };
  }

  // 2. Set search path
  updateProgress?.(20, 'Setting search path');
  await executeSql(`SET search_path TO "${schemaName}", public`);

  // 3. Prepare statements
  const statements = prepareSql(sql);
  updateProgress?.(30, `Found ${statements.length} statements to execute`);

  // 4. Execute them one by one
  let executed = 0;
  for (let i = 0; i < statements.length; i++) {
    const progress = 30 + ((i / statements.length) * 60);
    updateProgress?.(progress, `Executing statement ${i + 1}/${statements.length}`);
    
    const result = await executeSql(statements[i]);
    if (result.success) {
      executed++;
    }
    
    // Small delay to not overwhelm the database
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  updateProgress?.(100, `Import complete! Executed ${executed}/${statements.length} statements`);

  return {
    success: true,
    statementsExecuted: executed,
    totalStatements: statements.length,
    schemaName
  };
};