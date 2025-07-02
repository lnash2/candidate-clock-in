import { useToast } from '@/hooks/use-toast';
import { UploadedFile, ImportStatus } from '../types';
import { readLargeFileForImport } from '../fileUtils';
import { importSqlToLegacySchema } from '../legacySchemaImport';

export const useImportActions = (
  uploadedFiles: UploadedFile[],
  updateStatus: (update: Partial<ImportStatus>) => void,
  updateProgress: (progress: number, message?: string) => void
) => {
  const { toast } = useToast();

  const handleTestSchema = async () => {
    const schemaFile = uploadedFiles.find(f => f.type === 'schema' && f.valid);

    if (!schemaFile) {
      toast({
        title: 'No Schema File',
        description: 'Please upload a valid schema SQL file first',
        variant: 'destructive',
      });
      return;
    }

    try {
      updateStatus({
        step: 'importing-schema',
        progress: 40,
        message: 'Testing schema import (dry run)...'
      });

      const schemaContent = schemaFile.content || await readLargeFileForImport(schemaFile.file);
      const result = await importSqlToLegacySchema(schemaContent, {
        dryRun: true,
        schemaName: 'legacy_test'
      }, updateProgress);

      updateStatus({
        step: 'complete',
        progress: 100,
        message: `Schema validated! Found ${result.totalStatements} SQL statements ready for import.`
      });

      toast({
        title: 'Schema Test Complete',
        description: `Schema validated successfully! Found ${result.totalStatements} statements ready for import to legacy schema.`,
      });

    } catch (error) {
      console.error('Schema test error:', error);
      updateStatus({
        step: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Schema test failed'
      });

      toast({
        title: 'Schema Test Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleImportSchemaOnly = async () => {
    const schemaFile = uploadedFiles.find(f => f.type === 'schema' && f.valid);

    if (!schemaFile) {
      toast({
        title: 'No Schema File',
        description: 'Please upload a valid schema SQL file first',
        variant: 'destructive',
      });
      return;
    }

    try {
      updateStatus({
        step: 'importing-schema',
        progress: 20,
        message: 'Importing schema to legacy_pcrm schema...'
      });

      const schemaContent = schemaFile.content || await readLargeFileForImport(schemaFile.file);
      const result = await importSqlToLegacySchema(schemaContent, {
        schemaName: 'legacy_pcrm',
        dropIfExists: false, // Let PostgreSQL handle conflicts naturally
        continueOnError: true // Continue on expected errors like "already exists"
      }, updateProgress);
      
      if (!result.success) {
        const errorMsg = result.failedStatement 
          ? `Schema import failed at statement ${result.statementsExecuted + 1}: ${result.error}\n\nFailed SQL: ${result.failedStatement.substring(0, 200)}...`
          : `Schema import failed: ${result.error}`;
        
        updateStatus({
          step: 'error',
          error: errorMsg,
          message: 'Schema import failed'
        });
        
        toast({
          title: 'Schema Import Failed',
          description: `Failed after ${result.statementsExecuted} of ${result.totalStatements} statements`,
          variant: 'destructive',
        });
        return;
      }

      updateStatus({
        step: 'complete',
        progress: 100,
        message: `Schema imported to ${result.schemaName} successfully!`
      });

      toast({
        title: 'Schema Import Complete',
        description: `Successfully imported ${result.statementsExecuted} statements to "${result.schemaName}" schema`,
      });

    } catch (error) {
      console.error('Schema import error:', error);
      updateStatus({
        step: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Schema import failed'
      });

      toast({
        title: 'Schema Import Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleImportDataOnly = async () => {
    const dataFile = uploadedFiles.find(f => f.type === 'data' && f.valid);

    if (!dataFile) {
      toast({
        title: 'No Data File',
        description: 'Please upload a valid data SQL file first',
        variant: 'destructive',
      });
      return;
    }

    try {
      updateStatus({
        step: 'importing-data',
        progress: 20,
        message: 'Importing data to legacy_pcrm schema...'
      });

      const dataContent = dataFile.content || await readLargeFileForImport(dataFile.file);
      const result = await importSqlToLegacySchema(dataContent, {
        schemaName: 'legacy_pcrm',
        dropIfExists: false, // Don't drop tables when importing data
        continueOnError: true // Continue on insert errors (duplicates, etc.)
      }, updateProgress);
      
      if (!result.success) {
        const errorMsg = result.failedStatement 
          ? `Data import failed at statement ${result.statementsExecuted + 1}: ${result.error}\n\nFailed SQL: ${result.failedStatement.substring(0, 200)}...`
          : `Data import failed: ${result.error}`;
        
        updateStatus({
          step: 'error',
          error: errorMsg,
          message: 'Data import failed'
        });
        
        toast({
          title: 'Data Import Failed',
          description: `Failed after ${result.statementsExecuted} of ${result.totalStatements} statements`,
          variant: 'destructive',
        });
        return;
      }

      updateStatus({
        step: 'complete',
        progress: 100,
        message: `Data imported to ${result.schemaName} successfully!`
      });

      toast({
        title: 'Data Import Complete',
        description: `Successfully imported ${result.statementsExecuted} statements to "${result.schemaName}" schema`,
      });

    } catch (error) {
      console.error('Data import error:', error);
      updateStatus({
        step: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Data import failed'
      });

      toast({
        title: 'Data Import Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleImportBoth = async () => {
    const schemaFile = uploadedFiles.find(f => f.type === 'schema' && f.valid);
    const dataFile = uploadedFiles.find(f => f.type === 'data' && f.valid);

    if (!schemaFile || !dataFile) {
      toast({
        title: 'Missing Files',
        description: 'Please upload both schema and data SQL files',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Import schema first
      await handleImportSchemaOnly();
      
      // Then import data
      await handleImportDataOnly();

      updateStatus({
        step: 'complete',
        progress: 100,
        message: 'Import completed successfully!'
      });

      toast({
        title: 'Import Complete',
        description: 'SQL files imported successfully to legacy_pcrm schema.',
      });

    } catch (error) {
      console.error('Import error:', error);
      updateStatus({
        step: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Import failed'
      });

      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  return {
    handleTestSchema,
    handleImportSchemaOnly,
    handleImportDataOnly,
    handleImportBoth
  };
};