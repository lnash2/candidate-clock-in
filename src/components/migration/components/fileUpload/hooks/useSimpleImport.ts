import { useToast } from '@/hooks/use-toast';
import { UploadedFile, ImportStatus } from '../types';
import { readLargeFileForImport } from '../fileUtils';
import { importSqlToSchema } from '../simpleSchemaImport';

export const useSimpleImport = (
  uploadedFiles: UploadedFile[],
  updateStatus: (update: Partial<ImportStatus>) => void,
  updateProgress: (progress: number, message?: string) => void
) => {
  const { toast } = useToast();

  const testImport = async () => {
    const file = uploadedFiles.find(f => f.valid);
    if (!file) {
      toast({
        title: 'No Valid File',
        description: 'Please upload a valid SQL file first',
        variant: 'destructive',
      });
      return;
    }

    updateStatus({
      step: 'importing-schema',
      progress: 0,
      message: 'Testing schema import...'
    });

    try {
      const content = file.content || await readLargeFileForImport(file.file);
      
      // Just validate by counting statements
      const statements = content.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
      
      updateStatus({
        step: 'complete',
        progress: 100,
        message: `Schema ready! Found ${statements.length} SQL statements.`
      });

      toast({
        title: 'Schema Test Complete',
        description: `Found ${statements.length} statements ready for import.`,
      });

    } catch (error) {
      updateStatus({
        step: 'error',
        error: error instanceof Error ? error.message : 'Test failed',
        message: 'Schema test failed'
      });

      toast({
        title: 'Test Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const importToLegacySchema = async () => {
    const file = uploadedFiles.find(f => f.valid);
    if (!file) {
      toast({
        title: 'No Valid File',
        description: 'Please upload a valid SQL file first',
        variant: 'destructive',
      });
      return;
    }

    updateStatus({
      step: 'importing-schema',
      progress: 0,
      message: 'Starting import to legacy_pcrm schema...'
    });

    try {
      const content = file.content || await readLargeFileForImport(file.file);
      const result = await importSqlToSchema(content, 'legacy_pcrm', updateProgress);
      
      updateStatus({
        step: 'complete',
        progress: 100,
        message: `Import complete! Executed ${result.statementsExecuted}/${result.totalStatements} statements`
      });

      toast({
        title: 'Import Complete',
        description: `Successfully imported ${result.statementsExecuted} statements to "${result.schemaName}" schema`,
      });

    } catch (error) {
      updateStatus({
        step: 'error',
        error: error instanceof Error ? error.message : 'Import failed',
        message: 'Import failed'
      });

      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  return {
    testImport,
    importToLegacySchema
  };
};