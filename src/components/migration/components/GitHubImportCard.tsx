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
import { Github, Download, Database, FileText, CheckCircle, AlertCircle, Loader2, GitBranch, RefreshCw, Folder, Key } from 'lucide-react';
import { GitHubLfsService } from '../services/GitHubLfsService';

interface ImportStatus {
  step: 'idle' | 'fetching-schema' | 'importing-schema' | 'fetching-data' | 'importing-data' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    type: string;
  };
  private: boolean;
}

export const GitHubImportCard = () => {
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    step: 'idle',
    progress: 0,
    message: 'Ready to import from GitHub repository'
  });
  const [selectedRepository, setSelectedRepository] = useState<GitHubRepository | null>(null);
  const [availableRepositories, setAvailableRepositories] = useState<GitHubRepository[]>([]);
  const [isLoadingRepositories, setIsLoadingRepositories] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [customBranch, setCustomBranch] = useState('');
  const [useCustomBranch, setUseCustomBranch] = useState(false);
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('leg-sql');
  const [customFolder, setCustomFolder] = useState('');
  const [useCustomFolder, setUseCustomFolder] = useState(false);
  const [availableFolders, setAvailableFolders] = useState<string[]>([]);
  const [folderFiles, setFolderFiles] = useState<string[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{ valid: boolean; message?: string } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isTokenValid && selectedRepository) {
      loadBranches();
    }
  }, [isTokenValid, selectedRepository]);

  useEffect(() => {
    if (selectedRepository && getCurrentBranch()) {
      loadFolders();
    }
  }, [selectedRepository, selectedBranch, customBranch, useCustomBranch]);

  useEffect(() => {
    if (selectedRepository && getCurrentBranch() && getCurrentFolder()) {
      loadFolderFiles();
    }
  }, [selectedRepository, selectedBranch, customBranch, useCustomBranch, selectedFolder, customFolder, useCustomFolder]);

  const loadRepositories = async () => {
    setIsLoadingRepositories(true);
    try {
      const { repositories, error } = await GitHubLfsService.getUserRepositories();
      if (error) {
        console.warn('Failed to load repositories:', error);
        toast({
          title: 'Failed to Load Repositories',
          description: error,
          variant: 'destructive',
        });
      } else {
        setAvailableRepositories(repositories);
      }
    } catch (error) {
      console.warn('Error loading repositories:', error);
    } finally {
      setIsLoadingRepositories(false);
    }
  };

  const loadBranches = async () => {
    if (!selectedRepository) return;
    
    const { branches } = await GitHubLfsService.getBranches(selectedRepository.owner.login, selectedRepository.name);
    if (branches.length > 0) {
      setAvailableBranches(branches);
      // Set default branch if current selection is not available
      if (!branches.includes(selectedBranch) && !useCustomBranch) {
        setSelectedBranch(branches.includes('main') ? 'main' : branches[0]);
      }
    }
  };

  const loadFolders = async () => {
    if (!selectedRepository) return;
    
    const branch = getCurrentBranch();
    if (!branch.trim()) return;

    setIsLoadingFolders(true);
    try {
      const { folders, error } = await GitHubLfsService.getFolders(selectedRepository.owner.login, selectedRepository.name, branch);
      if (error) {
        console.warn('Failed to load folders:', error);
        setAvailableFolders([]); // fallback
      } else {
        setAvailableFolders(folders);
        // Set default folder if current selection is not available
        if (!folders.includes(selectedFolder) && !useCustomFolder) {
          setSelectedFolder(folders.includes('leg-sql') ? 'leg-sql' : (folders[0] || ''));
        }
      }
    } catch (error) {
      console.warn('Error loading folders:', error);
      setAvailableFolders([]); // fallback
    } finally {
      setIsLoadingFolders(false);
    }
  };

  const loadFolderFiles = async () => {
    if (!selectedRepository) return;
    
    const branch = getCurrentBranch();
    const folder = getCurrentFolder();
    if (!branch.trim() || !folder.trim()) return;

    try {
      const { files } = await GitHubLfsService.getSqlFilesInFolder(selectedRepository.owner.login, selectedRepository.name, folder, branch);
      setFolderFiles(files);
    } catch (error) {
      console.warn('Error loading folder files:', error);
      setFolderFiles([]);
    }
  };

  const getCurrentFolder = () => useCustomFolder ? customFolder : selectedFolder;

  const validateGitHubToken = async (token: string) => {
    if (!token.trim()) {
      setIsTokenValid(false);
      return;
    }

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      });

      if (response.ok) {
        GitHubLfsService.setGitHubToken(token);
        setIsTokenValid(true);
        toast({
          title: 'GitHub Token Valid',
          description: 'Successfully authenticated with GitHub',
        });
        // Load repositories after successful authentication
        loadRepositories();
      } else {
        setIsTokenValid(false);
        toast({
          title: 'Invalid GitHub Token',
          description: 'Please check your token and try again',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setIsTokenValid(false);
      toast({
        title: 'Authentication Failed',
        description: 'Failed to validate GitHub token',
        variant: 'destructive',
      });
    }
  };

  const handleTokenSubmit = () => {
    validateGitHubToken(githubToken);
  };

  const getCurrentBranch = () => useCustomBranch ? customBranch : selectedBranch;

  const validateBranchAndFiles = async () => {
    if (!selectedRepository) {
      setValidationStatus({ valid: false, message: 'Please select a repository first' });
      return;
    }
    
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
      const branchValidation = await GitHubLfsService.validateBranch(selectedRepository.owner.login, selectedRepository.name, branch);
      if (!branchValidation.valid) {
        setValidationStatus({ valid: false, message: branchValidation.error });
        return;
      }

      // Check if files exist in the selected folder
      const schemaCheck = await GitHubLfsService.checkFileExists(selectedRepository.owner.login, selectedRepository.name, `${folder}/legacy_schema.sql`, branch);
      const dataCheck = await GitHubLfsService.checkFileExists(selectedRepository.owner.login, selectedRepository.name, `${folder}/legacy_data.sql`, branch);

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
    if (!selectedRepository) {
      toast({
        title: 'Repository Required',
        description: 'Please select a repository first.',
        variant: 'destructive',
      });
      return;
    }

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
      const schemaResult = await GitHubLfsService.fetchSchemaFile(
        selectedRepository.owner.login, 
        selectedRepository.name, 
        branch, 
        folder
      );
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
      const dataResult = await GitHubLfsService.fetchDataFile(
        selectedRepository.owner.login, 
        selectedRepository.name, 
        branch, 
        folder
      );
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

        {/* GitHub Authentication */}
        <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
          <h4 className="font-medium flex items-center gap-2">
            <Key className="h-4 w-4" />
            GitHub Authentication
          </h4>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>GitHub Personal Access Token</Label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={githubToken}
                  onChange={(e) => {
                    setGithubToken(e.target.value);
                    setIsTokenValid(null);
                  }}
                  placeholder="Enter your GitHub token"
                  className="flex-1"
                />
                <Button 
                  onClick={handleTokenSubmit} 
                  disabled={!githubToken.trim()}
                  variant="outline"
                  size="sm"
                >
                  Verify
                </Button>
              </div>
            </div>

            {isTokenValid === true && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  GitHub token verified successfully! You can now access the repository.
                </AlertDescription>
              </Alert>
            )}

            {isTokenValid === false && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Invalid or missing GitHub token. Please check your token and try again.
                </AlertDescription>
              </Alert>
            )}

            <div className="text-xs text-muted-foreground">
              <p>To create a GitHub token:</p>
              <ol className="ml-4 list-decimal space-y-1">
                <li>Go to GitHub Settings → Developer settings → Personal access tokens</li>
                <li>Generate a new token with 'repo' scope for private repositories</li>
                <li>Copy and paste the token above</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Repository Selection */}
        {isTokenValid && (
          <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
            <h4 className="font-medium flex items-center gap-2">
              <Github className="h-4 w-4" />
              Repository Selection
            </h4>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Select Repository</Label>
                <Select 
                  value={selectedRepository?.full_name || ""} 
                  onValueChange={(value) => {
                    const repo = availableRepositories.find(r => r.full_name === value);
                    setSelectedRepository(repo || null);
                    setValidationStatus(null);
                    // Reset branch and folder selections when repository changes
                    setAvailableBranches([]);
                    setAvailableFolders([]);
                    setSelectedBranch('main');
                    setSelectedFolder('leg-sql');
                  }}
                  disabled={isLoadingRepositories}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose repository" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRepositories.map((repo) => (
                      <SelectItem key={repo.id} value={repo.full_name}>
                        <div className="flex items-center gap-2">
                          <span>{repo.full_name}</span>
                          {repo.private && <Badge variant="secondary" className="text-xs">Private</Badge>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isLoadingRepositories && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading repositories...
                </div>
              )}

              {selectedRepository && (
                <div className="text-sm text-muted-foreground">
                  <p><strong>Selected:</strong> {selectedRepository.full_name}</p>
                  <p><strong>Owner:</strong> {selectedRepository.owner.login} ({selectedRepository.owner.type})</p>
                  <p><strong>Visibility:</strong> {selectedRepository.private ? 'Private' : 'Public'}</p>
                </div>
              )}
            </div>
          </div>
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
            <p><strong>Repository:</strong> {selectedRepository?.full_name || 'None selected'}</p>
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