import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Github, Download, Database, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { GitHubLfsService } from '../services/GitHubLfsService';

interface ImportStatus {
  step: 'idle' | 'fetching-schema' | 'importing-schema' | 'fetching-data' | 'importing-data' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export const GitHubImportCard = () => {
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    step: 'idle',
    progress: 0,
    message: 'Ready to import from GitHub repository'
  });
  const { toast } = useToast();

  const updateStatus = (update: Partial<ImportStatus>) => {
    setImportStatus(prev => ({ ...prev, ...update }));
  };

  const executeSQL = async (sql: string, description: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('execute_sql', { 
        sql_statement: sql 
      });

      if (error) {
        console.error(`${description} error:`, error);
        updateStatus({ 
          step: 'error', 
          error: `${description} failed: ${error.message}` 
        });
        return false;
      }

      // Type assertion for the RPC response
      const result = data as { success: boolean; error?: string; message?: string } | null;
      
      if (result && !result.success) {
        console.error(`${description} execution error:`, result.error);
        updateStatus({ 
          step: 'error', 
          error: `${description} failed: ${result.error || 'Unknown database error'}` 
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error(`${description} exception:`, error);
      updateStatus({ 
        step: 'error', 
        error: `${description} failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
      return false;
    }
  };

  const processSqlInBatches = async (sql: string, description: string, batchSize: number = 50): Promise<boolean> => {
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.toLowerCase().startsWith('--'));

    const totalStatements = statements.length;
    let processedStatements = 0;

    for (let i = 0; i < statements.length; i += batchSize) {
      const batch = statements.slice(i, i + batchSize);
      const batchSql = batch.join(';\n') + ';';

      const success = await executeSQL(batchSql, `${description} (batch ${Math.floor(i / batchSize) + 1})`);
      if (!success) return false;

      processedStatements += batch.length;
      const progress = Math.min(90, (processedStatements / totalStatements) * 100);
      
      if (importStatus.step === 'importing-schema') {
        updateStatus({ progress: 20 + (progress * 0.3) });
      } else if (importStatus.step === 'importing-data') {
        updateStatus({ progress: 60 + (progress * 0.35) });
      }

      // Small delay to prevent overwhelming the database
      if (i + batchSize < statements.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return true;
  };

  const handleGitHubImport = async () => {
    try {
      updateStatus({
        step: 'fetching-schema',
        progress: 5,
        message: 'Fetching schema from GitHub repository...'
      });

      // Fetch schema file
      const schemaResult = await GitHubLfsService.fetchSchemaFile();
      if (!schemaResult.success || !schemaResult.content) {
        throw new Error(schemaResult.error || 'Failed to fetch schema file');
      }

      updateStatus({
        step: 'importing-schema',
        progress: 20,
        message: 'Transforming schema with _PCRM suffix and importing...'
      });

      // Transform and import schema
      const transformedSchema = GitHubLfsService.transformSqlWithPcrmSuffix(schemaResult.content);
      const schemaSuccess = await processSqlInBatches(transformedSchema, 'Schema import');
      
      if (!schemaSuccess) return;

      updateStatus({
        step: 'fetching-data',
        progress: 50,
        message: 'Fetching data from GitHub repository...'
      });

      // Fetch data file
      const dataResult = await GitHubLfsService.fetchDataFile();
      if (!dataResult.success || !dataResult.content) {
        throw new Error(dataResult.error || 'Failed to fetch data file');
      }

      updateStatus({
        step: 'importing-data',
        progress: 60,
        message: 'Transforming data with _PCRM suffix and importing...'
      });

      // Transform and import data
      const transformedData = GitHubLfsService.transformSqlWithPcrmSuffix(dataResult.content);
      const dataSuccess = await processSqlInBatches(transformedData, 'Data import', 25);
      
      if (!dataSuccess) return;

      updateStatus({
        step: 'complete',
        progress: 100,
        message: 'Legacy data successfully imported with _PCRM suffix!'
      });

      toast({
        title: 'Import Complete',
        description: 'Legacy data has been successfully imported from GitHub with _PCRM suffix applied to all tables.',
      });

    } catch (error) {
      console.error('GitHub import error:', error);
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

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'idle':
        return <Github className="h-5 w-5" />;
      case 'fetching-schema':
      case 'fetching-data':
        return <Download className="h-5 w-5" />;
      case 'importing-schema':
      case 'importing-data':
        return <Database className="h-5 w-5" />;
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin" />;
    }
  };

  const getStatusBadgeVariant = (step: string) => {
    switch (step) {
      case 'complete':
        return 'default' as const;
      case 'error':
        return 'destructive' as const;
      case 'idle':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  const isImporting = !['idle', 'complete', 'error'].includes(importStatus.step);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          Direct GitHub Import
        </CardTitle>
        <CardDescription>
          Import legacy data directly from the GitHub repository with automatic _PCRM suffix transformation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStepIcon(importStatus.step)}
            <span className="font-medium">Import Status</span>
          </div>
          <Badge variant={getStatusBadgeVariant(importStatus.step)}>
            {importStatus.step.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>

        {importStatus.progress > 0 && (
          <div className="space-y-2">
            <Progress value={importStatus.progress} className="w-full" />
            <p className="text-sm text-muted-foreground">{importStatus.message}</p>
          </div>
        )}

        {importStatus.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{importStatus.error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Repository Information
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Repository:</strong> lnash2/candidate-clock-in</p>
            <p><strong>Branch:</strong> 278b4e8e...</p>
            <p><strong>Files:</strong> leg-sql/legacy_schema.sql, leg-sql/legacy_data.sql</p>
            <p><strong>Transformation:</strong> All table names will get _PCRM suffix</p>
          </div>
        </div>

        <Button 
          onClick={handleGitHubImport}
          disabled={isImporting}
          className="w-full"
          size="lg"
        >
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Github className="mr-2 h-4 w-4" />
              Import from GitHub Repository
            </>
          )}
        </Button>

        {importStatus.step === 'complete' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully imported legacy data with _PCRM suffix. You can now view the migrated data in your database.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};