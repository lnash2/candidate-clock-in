import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Database, FileText, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';

interface ImportStatus {
  step: 'idle' | 'reading-files' | 'validating' | 'importing-schema' | 'importing-data' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}

interface UploadedFile {
  file: File;
  type: 'schema' | 'data' | 'unknown';
  content?: string;
  valid: boolean;
  error?: string;
}

export const FileUploadImportCard = () => {
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    step: 'idle',
    progress: 0,
    message: 'Ready to import SQL files directly'
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const updateStatus = (update: Partial<ImportStatus>) => {
    setImportStatus(prev => ({ ...prev, ...update }));
  };

  const detectFileType = (fileName: string, content: string): 'schema' | 'data' | 'unknown' => {
    const lowerName = fileName.toLowerCase();
    const upperContent = content.toUpperCase();
    
    if (lowerName.includes('schema') || upperContent.includes('CREATE TABLE')) {
      return 'schema';
    }
    if (lowerName.includes('data') || upperContent.includes('INSERT INTO')) {
      return 'data';
    }
    return 'unknown';
  };

  const validateSqlContent = (content: string): { valid: boolean; error?: string } => {
    if (!content || content.trim().length === 0) {
      return { valid: false, error: 'File is empty' };
    }
    
    // Basic SQL validation
    const sqlKeywords = ['CREATE', 'INSERT', 'UPDATE', 'DELETE', 'SELECT', 'ALTER', 'DROP'];
    const upperContent = content.toUpperCase();
    const hasSqlKeywords = sqlKeywords.some(keyword => upperContent.includes(keyword));
    
    if (!hasSqlKeywords) {
      return { valid: false, error: 'File does not contain valid SQL statements' };
    }
    
    return { valid: true };
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const processFiles = async (files: File[]) => {
    updateStatus({
      step: 'reading-files',
      progress: 10,
      message: 'Reading and validating files...'
    });

    const processedFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const content = await readFileContent(file);
        const validation = validateSqlContent(content);
        const type = detectFileType(file.name, content);
        
        processedFiles.push({
          file,
          type,
          content,
          valid: validation.valid,
          error: validation.error
        });
        
        updateStatus({
          progress: 10 + ((i + 1) / files.length) * 20,
          message: `Processed ${i + 1} of ${files.length} files...`
        });
      } catch (error) {
        processedFiles.push({
          file,
          type: 'unknown',
          valid: false,
          error: error instanceof Error ? error.message : 'Failed to read file'
        });
      }
    }

    setUploadedFiles(processedFiles);
    updateStatus({
      step: 'validating',
      progress: 30,
      message: 'Files processed. Review and start import.'
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.name.toLowerCase().endsWith('.sql')
    );
    
    if (files.length === 0) {
      toast({
        title: 'No SQL Files',
        description: 'Please drop .sql files only',
        variant: 'destructive',
      });
      return;
    }
    
    processFiles(files);
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
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

      const result = data as { success: boolean; error?: string } | null;
      
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
        updateStatus({ progress: 40 + (progress * 0.25) });
      } else if (importStatus.step === 'importing-data') {
        updateStatus({ progress: 70 + (progress * 0.25) });
      }

      // Small delay to prevent overwhelming the database
      if (i + batchSize < statements.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return true;
  };

  const transformSqlWithPcrmSuffix = (sqlContent: string): string => {
    // Transform CREATE TABLE statements
    let transformedSql = sqlContent.replace(
      /CREATE TABLE\s+([`"]?)(\w+)\1/gi,
      (match, quote, tableName) => {
        if (tableName.toLowerCase().endsWith('_pcrm')) {
          return match; // Already has suffix
        }
        return `CREATE TABLE ${quote}${tableName}_PCRM${quote}`;
      }
    );

    // Transform INSERT INTO statements
    transformedSql = transformedSql.replace(
      /INSERT INTO\s+([`"]?)(\w+)\1/gi,
      (match, quote, tableName) => {
        if (tableName.toLowerCase().endsWith('_pcrm')) {
          return match; // Already has suffix
        }
        return `INSERT INTO ${quote}${tableName}_PCRM${quote}`;
      }
    );

    // Transform REFERENCES in foreign keys
    transformedSql = transformedSql.replace(
      /REFERENCES\s+([`"]?)(\w+)\1/gi,
      (match, quote, tableName) => {
        if (tableName.toLowerCase().endsWith('_pcrm')) {
          return match; // Already has suffix
        }
        return `REFERENCES ${quote}${tableName}_PCRM${quote}`;
      }
    );

    return transformedSql;
  };

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

      const transformedSchema = transformSqlWithPcrmSuffix(schemaFile.content!);
      
      // Count statements for feedback
      const statements = transformedSchema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.toLowerCase().startsWith('--'));

      updateStatus({
        step: 'complete',
        progress: 100,
        message: `Schema parsed successfully! Found ${statements.length} SQL statements ready for import.`
      });

      toast({
        title: 'Schema Test Complete',
        description: `Schema parsed successfully with _PCRM suffix transformation. Found ${statements.length} statements.`,
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

  const handleImport = async () => {
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
      // Import schema
      updateStatus({
        step: 'importing-schema',
        progress: 40,
        message: 'Importing schema with _PCRM suffix...'
      });

      const transformedSchema = transformSqlWithPcrmSuffix(schemaFile.content!);
      const schemaSuccess = await processSqlInBatches(transformedSchema, 'Schema import');
      
      if (!schemaSuccess) return;

      // Import data
      updateStatus({
        step: 'importing-data',
        progress: 70,
        message: 'Importing data with _PCRM suffix...'
      });

      const transformedData = transformSqlWithPcrmSuffix(dataFile.content!);
      const dataSuccess = await processSqlInBatches(transformedData, 'Data import', 25);
      
      if (!dataSuccess) return;

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

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'idle':
        return <Upload className="h-5 w-5" />;
      case 'reading-files':
      case 'validating':
        return <FileText className="h-5 w-5" />;
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

  const isImporting = !['idle', 'validating', 'complete', 'error'].includes(importStatus.step);
  const canImport = uploadedFiles.some(f => f.type === 'schema' && f.valid) && 
                   uploadedFiles.some(f => f.type === 'data' && f.valid);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Direct File Import
        </CardTitle>
        <CardDescription>
          Upload your SQL files directly - no GitHub limitations, handles any file size
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

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver ? 'border-primary bg-muted/50' : 'border-muted-foreground/25'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-medium mb-2">Drop SQL files here</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Support for legacy_schema.sql and legacy_data.sql files
          </p>
          <input
            type="file"
            multiple
            accept=".sql"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <Button asChild variant="outline">
            <label htmlFor="file-upload" className="cursor-pointer">
              Choose Files
            </label>
          </Button>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Uploaded Files</h4>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4" />
                  <div>
                    <p className="font-medium">{file.file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                    </p>
                  </div>
                  {file.valid ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Import Information */}
        <div className="space-y-2">
          <h4 className="font-medium">Import Details</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Files Required:</strong> legacy_schema.sql and legacy_data.sql</p>
            <p><strong>Transformation:</strong> All table names will get _PCRM suffix</p>
            <p><strong>Processing:</strong> Large files are processed in chunks for reliability</p>
            <p><strong>File Size:</strong> No limitations - handles any size including 100MB+ files</p>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleTestSchema}
            disabled={isImporting || !uploadedFiles.some(f => f.type === 'schema' && f.valid)}
            className="w-full"
            variant="outline"
            size="lg"
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Schema...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Test Schema Parsing
              </>
            )}
          </Button>

          <Button 
            onClick={handleImport}
            disabled={isImporting || !canImport}
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
                <Database className="mr-2 h-4 w-4" />
                Import SQL Files
              </>
            )}
          </Button>
        </div>

        {importStatus.step === 'complete' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully imported SQL files with _PCRM suffix. You can now view the migrated data in your database.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};