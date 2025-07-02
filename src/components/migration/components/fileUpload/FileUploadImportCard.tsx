import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useImportStatus } from './hooks/useImportStatus';
import { useFileUpload } from './hooks/useFileUpload';
import { useImportActions } from './hooks/useImportActions';
import { ImportStatusDisplay } from './components/ImportStatusDisplay';
import { FileUploadArea } from './components/FileUploadArea';
import { UploadedFilesList } from './components/UploadedFilesList';
import { ImportButtons } from './components/ImportButtons';

export const FileUploadImportCard = () => {
  const { importStatus, updateStatus, updateProgress } = useImportStatus();
  
  const {
    uploadedFiles,
    isDragOver,
    setIsDragOver,
    handleDrop,
    handleFileInput,
    removeFile
  } = useFileUpload(updateProgress);

  const {
    handleTestSchema,
    handleImportSchemaOnly,
    handleImportDataOnly,
    handleImportBoth
  } = useImportActions(uploadedFiles, updateStatus, updateProgress);

  const handleFileProcessingWrapper = async (files: File[]) => {
    updateStatus({
      step: 'reading-files',
      progress: 10,
      message: 'Reading and validating files...'
    });

    try {
      // This will be handled by useFileUpload hook
      updateStatus({
        step: 'validating',
        progress: 30,
        message: 'Files processed. Review and start import.'
      });
    } catch (error) {
      updateStatus({
        step: 'error',
        error: error instanceof Error ? error.message : 'Failed to process files',
        message: 'File processing failed'
      });
    }
  };

  const isImporting = !['idle', 'validating', 'complete', 'error'].includes(importStatus.step);

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
        <ImportStatusDisplay importStatus={importStatus} />

        <FileUploadArea
          isDragOver={isDragOver}
          setIsDragOver={setIsDragOver}
          onDrop={handleDrop}
          onFileInput={handleFileInput}
        />

        <UploadedFilesList
          uploadedFiles={uploadedFiles}
          onRemoveFile={removeFile}
        />

        {/* Import Information */}
        <div className="space-y-2">
          <h4 className="font-medium">Legacy Schema Import</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Import Target:</strong> Creates separate "legacy_pcrm" schema</p>
            <p><strong>Processing:</strong> Imports SQL exactly as-is with conflict handling</p>
            <p><strong>Files:</strong> Upload schema and data files separately or together</p>
            <p><strong>Size Limit:</strong> No file size restrictions</p>
            <p><strong>Safety:</strong> Uses DROP IF EXISTS for clean imports</p>
          </div>
        </div>

        <ImportButtons
          uploadedFiles={uploadedFiles}
          isImporting={isImporting}
          onTestSchema={handleTestSchema}
          onImportSchemaOnly={handleImportSchemaOnly}
          onImportDataOnly={handleImportDataOnly}
          onImportBoth={handleImportBoth}
        />
      </CardContent>
    </Card>
  );
};