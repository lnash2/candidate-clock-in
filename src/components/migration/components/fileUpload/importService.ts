import { supabase } from '@/integrations/supabase/client';
import { ImportStatus } from './types';
import { splitSqlIntoStatements } from './sqlUtils';

export interface ImportResult {
  success: boolean;
  error?: string;
  statementsExecuted: number;
  totalStatements: number;
  failedStatement?: string;
}

export const executeSQL = async (sql: string, description: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.rpc('execute_sql', { 
      sql_statement: sql 
    });

    if (error) {
      console.error(`${description} error:`, error);
      return { success: false, error: error.message };
    }

    const result = data as { success: boolean; error?: string } | null;
    
    if (result && !result.success) {
      console.error(`${description} execution error:`, result.error);
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`${description} exception:`, error);
    return { success: false, error: errorMessage };
  }
};

export const executeSingleStatement = async (
  statement: string, 
  statementIndex: number,
  description: string
): Promise<{ success: boolean; error?: string }> => {
  console.log(`Executing statement ${statementIndex + 1}: ${statement.substring(0, 100)}...`);
  
  const result = await executeSQL(statement, `${description} - Statement ${statementIndex + 1}`);
  
  if (!result.success) {
    console.error(`Failed statement ${statementIndex + 1}:`, statement);
    console.error('Error:', result.error);
  }
  
  return result;
};

export const processSqlInBatches = async (
  sql: string, 
  description: string, 
  batchSize: number,
  updateProgress: (progress: number, message?: string) => void,
  currentStep: 'importing-schema' | 'importing-data'
): Promise<ImportResult> => {
  const statements = splitSqlIntoStatements(sql);
  const totalStatements = statements.length;
  let processedStatements = 0;
  
  console.log(`Starting ${description}: ${totalStatements} statements to process`);

  // Process statements one by one for better error reporting
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    
    // Update progress with current statement info
    const progressMessage = `Processing statement ${i + 1} of ${totalStatements}: ${statement.substring(0, 50)}...`;
    updateProgress(
      currentStep === 'importing-schema' 
        ? 40 + ((i / totalStatements) * 25)
        : 70 + ((i / totalStatements) * 25),
      progressMessage
    );
    
    const result = await executeSingleStatement(statement, i, description);
    
    if (!result.success) {
      return {
        success: false,
        error: result.error,
        statementsExecuted: i,
        totalStatements,
        failedStatement: statement
      };
    }
    
    processedStatements++;
    
    // Small delay to prevent overwhelming the database
    if (i < statements.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  console.log(`Completed ${description}: ${processedStatements} statements executed successfully`);
  
  return {
    success: true,
    statementsExecuted: processedStatements,
    totalStatements
  };
};