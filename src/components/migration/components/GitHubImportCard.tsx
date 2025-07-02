import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Github, Download, Database, FileText, CheckCircle, AlertCircle, Loader2, GitBranch, RefreshCw, Folder } from 'lucide-react';
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
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [customBranch, setCustomBranch] = useState('');
  const [useCustomBranch, setUseCustomBranch] = useState(false);
  const [availableBranches, setAvailableBranches] = useState<string[]>(['main', 'leg-sql']);
  const [selectedFolder, setSelectedFolder] = useState('leg-sql');
  const [customFolder, setCustomFolder] = useState('');
  const [useCustomFolder, setUseCustomFolder] = useState(false);
  const [availableFolders, setAvailableFolders] = useState<string[]>(['leg-sql']);
  const [folderFiles, setFolderFiles] = useState<string[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{ valid: boolean; message?: string } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    if (getCurrentBranch()) {
      loadFolders();
    }
  }, [selectedBranch, customBranch, useCustomBranch]);

  useEffect(() => {
    if (getCurrentBranch() && getCurrentFolder()) {
      loadFolderFiles();
    }
  }, [selectedBranch, customBranch, useCustomBranch, selectedFolder, customFolder, useCustomFolder]);

  const loadBranches = async () => {
    const { branches } = await GitHubLfsService.getBranches();
    if (branches.length > 0) {
      setAvailableBranches(['main', 'leg-sql', ...branches.filter(b => !['main', 'leg-sql'].includes(b))]);
    }
  };

  const loadFolders = async () => {
    const branch = getCurrentBranch();
    if (!branch.trim()) return;

    setIsLoadingFolders(true);
    try {
      const { folders, error } = await GitHubLfsService.getFolders(branch);
      if (error) {
        console.warn('Failed to load folders:', error);
        setAvailableFolders(['leg-sql']); // fallback
      } else {
        setAvailableFolders(['leg-sql', ...folders.filter(f => f !== 'leg-sql')]);
      }
    } catch (error) {
      console.warn('Error loading folders:', error);
      setAvailableFolders(['leg-sql']); // fallback
    } finally {
      setIsLoadingFolders(false);
    }
  };

  const loadFolderFiles = async () => {
    const branch = getCurrentBranch();
    const folder = getCurrentFolder();
    if (!branch.trim() || !folder.trim()) return;

    try {
      const { files } = await GitHubLfsService.getSqlFilesInFolder(folder, branch);
      setFolderFiles(files);
    } catch (error) {
      console.warn('Error loading folder files:', error);
      setFolderFiles([]);
    }
  };

  const getCurrentFolder = () => useCustomFolder ? customFolder : selectedFolder;

  const getCurrentBranch = () => useCustomBranch ? customBranch : selectedBranch;

  const validateBranchAndFiles = async () => {
    const branch = getCurrentBranch();
    const folder = getCurrentFolder();
    if (!branch.trim()) {
      setValidationStatus({ valid: false, message: 'Please enter a branch name' });
      return;
    }
    if (!folder.trim()) {
      setValidationStatus({ valid: false, message: 'Please enter a folder name' });
      return;
    }

    setIsValidating(true);
    setValidationStatus(null);

    try {
      // Validate branch exists
      const branchValidation = await GitHubLfsService.validateBranch(branch);
      if (!branchValidation.valid) {
        setValidationStatus({ valid: false, message: branchValidation.error });
        return;
      }

      // Check if files exist in the selected folder
      const schemaCheck = await GitHubLfsService.checkFileExists(`${folder}/legacy_schema.sql`, branch);
      const dataCheck = await GitHubLfsService.checkFileExists(`${folder}/legacy_data.sql`, branch);

      if (!schemaCheck.exists || !dataCheck.exists) {
        const missingFiles = [];
        if (!schemaCheck.exists) missingFiles.push('legacy_schema.sql');
        if (!dataCheck.exists) missingFiles.push('legacy_data.sql');
        
        setValidationStatus({ 
          valid: false, 
          message: `Missing files in folder '${folder}' on branch '${branch}': ${missingFiles.join(', ')}` 
        });
        return;
      }

      setValidationStatus({ valid: true, message: `Branch '${branch}' and folder '${folder}' validated successfully` });
    } catch (error) {
      setValidationStatus({ 
        valid: false, 
        message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsValidating(false);
    }
  };

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
    const branch = getCurrentBranch();
    
    // Validate branch and files before starting import
    if (!validationStatus?.valid) {
      toast({
        title: 'Validation Required',
        description: 'Please validate the branch and files before importing.',
        variant: 'destructive',
      });
      return;
    }

    try {
      updateStatus({
        step: 'fetching-schema',
        progress: 5,
        message: `Fetching schema from branch '${branch}'...`
      });

      // Fetch schema file
      const folder = getCurrentFolder();
      const schemaResult = await GitHubLfsService.fetchSchemaFile(branch, folder);
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
      const dataResult = await GitHubLfsService.fetchDataFile(branch, folder);
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

        {/* Branch Selection */}
        <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
          <h4 className="font-medium flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Branch Selection
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Branch</Label>
              <Select 
                value={useCustomBranch ? 'custom' : selectedBranch} 
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setUseCustomBranch(true);
                  } else {
                    setUseCustomBranch(false);
                    setSelectedBranch(value);
                    setValidationStatus(null);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose branch" />
                </SelectTrigger>
                <SelectContent>
                  {availableBranches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom branch...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {useCustomBranch && (
              <div className="space-y-2">
                <Label>Custom Branch Name</Label>
                <Input
                  value={customBranch}
                  onChange={(e) => {
                    setCustomBranch(e.target.value);
                    setValidationStatus(null);
                  }}
                  placeholder="Enter branch name"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={validateBranchAndFiles} 
              disabled={isValidating || !getCurrentBranch().trim()}
              variant="outline"
              size="sm"
            >
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-3 w-3" />
                  Validate Branch & Files
                </>
              )}
            </Button>
            
            <Button onClick={loadBranches} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-3 w-3" />
              Refresh Branches
            </Button>
          </div>

          {validationStatus && (
            <Alert variant={validationStatus.valid ? "default" : "destructive"}>
              {validationStatus.valid ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{validationStatus.message}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Folder Selection */}
        <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
          <h4 className="font-medium flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Folder Selection
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Folder</Label>
              <Select 
                value={useCustomFolder ? 'custom' : selectedFolder} 
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setUseCustomFolder(true);
                  } else {
                    setUseCustomFolder(false);
                    setSelectedFolder(value);
                    setValidationStatus(null);
                  }
                }}
                disabled={isLoadingFolders}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose folder" />
                </SelectTrigger>
                <SelectContent>
                  {availableFolders.map((folder) => (
                    <SelectItem key={folder} value={folder}>
                      {folder}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom folder...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {useCustomFolder && (
              <div className="space-y-2">
                <Label>Custom Folder Path</Label>
                <Input
                  value={customFolder}
                  onChange={(e) => {
                    setCustomFolder(e.target.value);
                    setValidationStatus(null);
                  }}
                  placeholder="Enter folder path"
                />
              </div>
            )}
          </div>

          {folderFiles.length > 0 && (
            <div className="mt-3">
              <Label className="text-sm font-medium">SQL Files Found:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {folderFiles.map((file) => (
                  <Badge key={file} variant="outline" className="text-xs">
                    {file}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {isLoadingFolders && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading folders...
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Repository Information
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Repository:</strong> lnash2/candidate-clock-in</p>
            <p><strong>Selected Branch:</strong> {getCurrentBranch() || 'None selected'}</p>
            <p><strong>Selected Folder:</strong> {getCurrentFolder() || 'None selected'}</p>
            <p><strong>Files:</strong> {getCurrentFolder()}/legacy_schema.sql, {getCurrentFolder()}/legacy_data.sql</p>
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