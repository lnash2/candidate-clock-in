import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, Database, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ImportStatus } from '../types';

interface ImportStatusDisplayProps {
  importStatus: ImportStatus;
}

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

export const ImportStatusDisplay: React.FC<ImportStatusDisplayProps> = ({ importStatus }) => {
  return (
    <>
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

      {importStatus.step === 'complete' && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Successfully imported SQL files with _PCRM suffix. You can now view the migrated data in your database.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};