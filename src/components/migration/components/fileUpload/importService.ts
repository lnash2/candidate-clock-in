import { supabase } from '@/integrations/supabase/client';
import { ImportStatus } from './types';
import { splitSqlIntoStatements } from './sqlUtils';

export const executeSQL = async (sql: string, description: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('execute_sql', { 
      sql_statement: sql 
    });

    if (error) {
      console.error(`${description} error:`, error);
      return false;
    }

    const result = data as { success: boolean; error?: string } | null;
    
    if (result && !result.success) {
      console.error(`${description} execution error:`, result.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`${description} exception:`, error);
    return false;
  }
};

export const processSqlInBatches = async (
  sql: string, 
  description: string, 
  batchSize: number,
  updateProgress: (progress: number) => void,
  currentStep: 'importing-schema' | 'importing-data'
): Promise<boolean> => {
  const statements = splitSqlIntoStatements(sql);
  const totalStatements = statements.length;
  let processedStatements = 0;

  for (let i = 0; i < statements.length; i += batchSize) {
    const batch = statements.slice(i, i + batchSize);
    const batchSql = batch.join(';\n') + ';';

    const success = await executeSQL(batchSql, `${description} (batch ${Math.floor(i / batchSize) + 1})`);
    if (!success) return false;

    processedStatements += batch.length;
    const progress = Math.min(90, (processedStatements / totalStatements) * 100);
    
    if (currentStep === 'importing-schema') {
      updateProgress(40 + (progress * 0.25));
    } else if (currentStep === 'importing-data') {
      updateProgress(70 + (progress * 0.25));
    }

    // Small delay to prevent overwhelming the database
    if (i + batchSize < statements.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return true;
};