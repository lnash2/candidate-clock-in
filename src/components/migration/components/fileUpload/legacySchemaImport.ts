import { supabase } from '@/integrations/supabase/client';

export interface LegacyImportResult {
  success: boolean;
  error?: string;
  statementsExecuted: number;
  totalStatements: number;
  failedStatement?: string;
  schemaName: string;
}

export interface LegacyImportOptions {
  schemaName?: string;
  dropIfExists?: boolean;
  continueOnError?: boolean;
  dryRun?: boolean;
}

// Simple SQL statement splitting - just by semicolons, no complex parsing
const splitSqlStatements = (sql: string): string[] => {
  return sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.match(/^--/)); // Remove empty and comment lines
};

// Basic SQL cleaning - only remove obvious PostgreSQL dump metadata
const cleanSqlForImport = (sql: string): string => {
  const lines = sql.split('\n');
  const cleanedLines: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('--')) continue;
    
    // Skip common PostgreSQL dump metadata lines
    if (trimmed.match(/^(SET|SELECT pg_catalog|\\|COPY.*FROM stdin)/i)) continue;
    
    cleanedLines.push(line);
  }
  
  return cleanedLines.join('\n');
};

export const createLegacySchema = async (schemaName: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.rpc('execute_sql', {
      sql_statement: `CREATE SCHEMA IF NOT EXISTS "${schemaName}"`
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const result = data as { success: boolean; error?: string } | null;
    return result ? result : { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create schema' 
    };
  }
};

export const importSqlToLegacySchema = async (
  sql: string,
  options: LegacyImportOptions = {},
  updateProgress?: (progress: number, message?: string) => void
): Promise<LegacyImportResult> => {
  const {
    schemaName = 'legacy_pcrm',
    dropIfExists = true,
    continueOnError = false,
    dryRun = false
  } = options;

  console.log(`Starting legacy import to schema: ${schemaName}`);
  
  // Clean and prepare SQL
  const cleanedSql = cleanSqlForImport(sql);
  const statements = splitSqlStatements(cleanedSql);
  const totalStatements = statements.length;
  
  if (totalStatements === 0) {
    return {
      success: false,
      error: 'No valid SQL statements found',
      statementsExecuted: 0,
      totalStatements: 0,
      schemaName
    };
  }

  updateProgress?.(10, `Found ${totalStatements} SQL statements to import`);

  // Create schema if it doesn't exist
  if (!dryRun) {
    const schemaResult = await createLegacySchema(schemaName);
    if (!schemaResult.success) {
      return {
        success: false,
        error: `Failed to create schema: ${schemaResult.error}`,
        statementsExecuted: 0,
        totalStatements,
        schemaName
      };
    }
  }

  updateProgress?.(20, `Schema "${schemaName}" ready, importing SQL statements...`);

  let statementsExecuted = 0;
  const errors: string[] = [];

  // Set search path to the legacy schema for all subsequent operations
  if (!dryRun) {
    const setPathResult = await supabase.rpc('execute_sql', {
      sql_statement: `SET search_path TO "${schemaName}", public`
    });
    
    if (setPathResult.error) {
      return {
        success: false,
        error: `Failed to set search path: ${setPathResult.error.message}`,
        statementsExecuted: 0,
        totalStatements,
        schemaName
      };
    }
  }

  // Process each statement
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const progress = 20 + ((i / totalStatements) * 70);
    
    updateProgress?.(progress, `Processing statement ${i + 1}/${totalStatements}`);

    if (dryRun) {
      console.log(`[DRY RUN] Would execute: ${statement.substring(0, 100)}...`);
      statementsExecuted++;
      continue;
    }

    try {
      // Add conflict handling for common cases
      let processedStatement = statement;
      
      if (dropIfExists) {
        // Add DROP IF EXISTS for CREATE statements
        if (statement.match(/CREATE TABLE\s+(\w+)/i)) {
          const match = statement.match(/CREATE TABLE\s+(\w+)/i);
          if (match) {
            const tableName = match[1];
            processedStatement = `DROP TABLE IF EXISTS "${tableName}" CASCADE;\n${statement}`;
          }
        }
        
        if (statement.match(/CREATE TYPE\s+(\w+)/i)) {
          const match = statement.match(/CREATE TYPE\s+(\w+)/i);
          if (match) {
            const typeName = match[1];
            processedStatement = `DROP TYPE IF EXISTS "${typeName}" CASCADE;\n${statement}`;
          }
        }
        
        if (statement.match(/CREATE FUNCTION\s+(\w+)/i)) {
          const match = statement.match(/CREATE FUNCTION\s+(\w+)/i);
          if (match) {
            const functionName = match[1];
            processedStatement = `DROP FUNCTION IF EXISTS "${functionName}" CASCADE;\n${statement}`;
          }
        }
      }

      const { data, error } = await supabase.rpc('execute_sql', {
        sql_statement: processedStatement
      });

      if (error) {
        const errorMsg = `Statement ${i + 1}: ${error.message}`;
        errors.push(errorMsg);
        
        if (!continueOnError) {
          return {
            success: false,
            error: errorMsg,
            statementsExecuted,
            totalStatements,
            failedStatement: statement,
            schemaName
          };
        }
        
        console.warn(`Continuing after error in statement ${i + 1}:`, error.message);
      } else {
        const result = data as { success: boolean; error?: string } | null;
        if (result && !result.success) {
          const errorMsg = `Statement ${i + 1}: ${result.error}`;
          errors.push(errorMsg);
          
          if (!continueOnError) {
            return {
              success: false,
              error: errorMsg,
              statementsExecuted,
              totalStatements,
              failedStatement: statement,
              schemaName
            };
          }
        }
      }

      statementsExecuted++;
      
      // Small delay to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 10));
      
    } catch (error) {
      const errorMsg = `Statement ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMsg);
      
      if (!continueOnError) {
        return {
          success: false,
          error: errorMsg,
          statementsExecuted,
          totalStatements,
          failedStatement: statement,
          schemaName
        };
      }
    }
  }

  updateProgress?.(100, `Import complete! Executed ${statementsExecuted}/${totalStatements} statements`);

  return {
    success: errors.length === 0 || continueOnError,
    error: errors.length > 0 ? `${errors.length} errors occurred: ${errors[0]}` : undefined,
    statementsExecuted,
    totalStatements,
    schemaName
  };
};