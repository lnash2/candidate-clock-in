import React from 'react';
import { Button } from '@/components/ui/button';
import { Database, FileText, Loader2 } from 'lucide-react';
import { UploadedFile } from '../types';

interface ImportButtonsProps {
  uploadedFiles: UploadedFile[];
  isImporting: boolean;
  onTestSchema: () => void;
  onImportSchemaOnly: () => void;
  onImportDataOnly: () => void;
  onImportBoth: () => void;
}

export const ImportButtons: React.FC<ImportButtonsProps> = ({
  uploadedFiles,
  isImporting,
  onTestSchema,
  onImportSchemaOnly,
  onImportDataOnly,
  onImportBoth
}) => {
  const hasValidSchema = uploadedFiles.some(f => f.type === 'schema' && f.valid);
  const hasValidData = uploadedFiles.some(f => f.type === 'data' && f.valid);
  const canImportBoth = hasValidSchema && hasValidData;

  return (
    <div className="space-y-2">
      <Button 
        onClick={onTestSchema}
        disabled={isImporting || !hasValidSchema}
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
        onClick={onImportSchemaOnly}
        disabled={isImporting || !hasValidSchema}
        className="w-full"
        variant="secondary"
        size="lg"
      >
        {isImporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Importing Schema...
          </>
        ) : (
          <>
            <Database className="mr-2 h-4 w-4" />
            Import Schema Only
          </>
        )}
      </Button>

      <Button 
        onClick={onImportDataOnly}
        disabled={isImporting || !hasValidData}
        className="w-full"
        variant="secondary"
        size="lg"
      >
        {isImporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Importing Data...
          </>
        ) : (
          <>
            <Database className="mr-2 h-4 w-4" />
            Import Data Only
          </>
        )}
      </Button>

      <Button 
        onClick={onImportBoth}
        disabled={isImporting || !canImportBoth}
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
            Import Both (Schema + Data)
          </>
        )}
      </Button>
    </div>
  );
};