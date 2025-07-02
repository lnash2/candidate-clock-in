import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useImportStatus } from './hooks/useImportStatus';
import { useFileUpload } from './hooks/useFileUpload';
import { useSimpleImport } from './hooks/useSimpleImport';
import { ImportStatusDisplay } from './components/ImportStatusDisplay';
import { FileUploadArea } from './components/FileUploadArea';
import { UploadedFilesList } from './components/UploadedFilesList';

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
    testImport,
    importToLegacySchema
  } = useSimpleImport(uploadedFiles, updateStatus, updateProgress);

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

        {/* Simple Import Actions */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                onClick={testImport}
                disabled={isImporting}
                className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md disabled:opacity-50"
              >
                Test Schema
              </button>
              <button
                onClick={importToLegacySchema}
                disabled={isImporting}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md disabled:opacity-50"
              >
                Import to Legacy Schema
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};