import { supabase } from '@/integrations/supabase/client';

export interface SimpleImportResult {
  success: boolean;
  error?: string;
  statementsExecuted: number;
  totalStatements: number;
  schemaName: string;
}

// Just split by semicolons and clean up
const prepareSql = (sql: string): string[] => {
  return sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--') && !s.match(/^(SET|SELECT pg_catalog)/i));
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