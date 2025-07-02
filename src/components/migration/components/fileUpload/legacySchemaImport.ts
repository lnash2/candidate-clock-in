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

// Minimal SQL cleaning - only remove obvious PostgreSQL dump metadata
const cleanSqlForImport = (sql: string): string => {
  const lines = sql.split('\n');
  const cleanedLines: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('--')) continue;
    
    // Only skip the most obvious PostgreSQL dump metadata
    if (trimmed.match(/^(SET\s+(client_encoding|standard_conforming_strings|check_function_bodies|xmloption|client_min_messages|row_security)|SELECT pg_catalog\.set_config|\\\\)/i)) continue;
    
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

  // Process each statement with minimal intervention
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
      // Execute statement as-is without complex transformations
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_statement: statement
      });

      if (error) {
        const errorMsg = `Statement ${i + 1}: ${error.message}`;
        
        // Check if this is an expected "already exists" type error
        const isExpectedError = error.message.includes('already exists') || 
                               error.message.includes('does not exist') ||
                               error.message.includes('permission denied');
        
        if (isExpectedError || continueOnError) {
          console.warn(`Continuing after expected error in statement ${i + 1}:`, error.message);
          errors.push(errorMsg);
        } else {
          return {
            success: false,
            error: errorMsg,
            statementsExecuted,
            totalStatements,
            failedStatement: statement,
            schemaName
          };
        }
      } else {
        const result = data as { success: boolean; error?: string } | null;
        if (result && !result.success) {
          const errorMsg = `Statement ${i + 1}: ${result.error}`;
          
          // Same logic for expected errors from the function result
          const isExpectedError = (result.error || '').includes('already exists') || 
                                 (result.error || '').includes('does not exist') ||
                                 (result.error || '').includes('permission denied');
          
          if (isExpectedError || continueOnError) {
            console.warn(`Continuing after expected error in statement ${i + 1}:`, result.error);
            errors.push(errorMsg);
          } else {
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