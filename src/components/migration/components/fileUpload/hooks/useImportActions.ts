import { useToast } from '@/hooks/use-toast';
import { UploadedFile, ImportStatus } from '../types';
import { readLargeFileForImport } from '../fileUtils';
import { transformSqlWithPcrmSuffix, splitSqlIntoStatements } from '../sqlUtils';
import { processSqlInBatches } from '../importService';
import { BATCH_SIZES } from '../constants';

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
        message: 'Testing schema parsing and transformation...'
      });

      const schemaContent = schemaFile.content || await readLargeFileForImport(schemaFile.file);
      const transformedSchema = transformSqlWithPcrmSuffix(schemaContent);
      const statements = splitSqlIntoStatements(transformedSchema);

      updateStatus({
        step: 'complete',
        progress: 100,
        message: `Schema parsed successfully! Found ${statements.length} SQL statements ready for import.`
      });

      toast({
        title: 'Schema Test Complete',
        description: `Schema cleaned and parsed successfully! Found ${statements.length} valid SQL statements after removing PostgreSQL dump metadata.`,
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
        progress: 40,
        message: 'Importing schema with _PCRM suffix...'
      });

      const schemaContent = schemaFile.content || await readLargeFileForImport(schemaFile.file);
      const transformedSchema = transformSqlWithPcrmSuffix(schemaContent);
      const schemaResult = await processSqlInBatches(
        transformedSchema, 
        'Schema import', 
        BATCH_SIZES.SCHEMA_IMPORT,
        updateProgress,
        'importing-schema'
      );
      
      if (!schemaResult.success) {
        const errorMsg = schemaResult.failedStatement 
          ? `Schema import failed at statement ${schemaResult.statementsExecuted + 1}: ${schemaResult.error}\n\nFailed SQL: ${schemaResult.failedStatement.substring(0, 200)}...`
          : `Schema import failed: ${schemaResult.error}`;
        
        updateStatus({
          step: 'error',
          error: errorMsg,
          message: 'Schema import failed'
        });
        
        toast({
          title: 'Schema Import Failed',
          description: `Failed after ${schemaResult.statementsExecuted} of ${schemaResult.totalStatements} statements`,
          variant: 'destructive',
        });
        return;
      }

      updateStatus({
        step: 'complete',
        progress: 100,
        message: 'Schema import completed successfully!'
      });

      toast({
        title: 'Schema Import Complete',
        description: `Successfully imported ${schemaResult.statementsExecuted} schema statements with _PCRM suffix`,
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
        progress: 50,
        message: 'Importing data with _PCRM suffix...'
      });

      const dataContent = dataFile.content || await readLargeFileForImport(dataFile.file);
      const transformedData = transformSqlWithPcrmSuffix(dataContent);
      const dataResult = await processSqlInBatches(
        transformedData, 
        'Data import', 
        BATCH_SIZES.DATA_IMPORT,
        updateProgress,
        'importing-data'
      );
      
      if (!dataResult.success) {
        const errorMsg = dataResult.failedStatement 
          ? `Data import failed at statement ${dataResult.statementsExecuted + 1}: ${dataResult.error}\n\nFailed SQL: ${dataResult.failedStatement.substring(0, 200)}...`
          : `Data import failed: ${dataResult.error}`;
        
        updateStatus({
          step: 'error',
          error: errorMsg,
          message: 'Data import failed'
        });
        
        toast({
          title: 'Data Import Failed',
          description: `Failed after ${dataResult.statementsExecuted} of ${dataResult.totalStatements} statements`,
          variant: 'destructive',
        });
        return;
      }

      updateStatus({
        step: 'complete',
        progress: 100,
        message: 'Data import completed successfully!'
      });

      toast({
        title: 'Data Import Complete',
        description: `Successfully imported ${dataResult.statementsExecuted} data statements with _PCRM suffix`,
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
        description: 'SQL files imported successfully with _PCRM suffix applied to all tables.',
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