import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { UploadedFile } from '../types';

interface UploadedFilesListProps {
  uploadedFiles: UploadedFile[];
  onRemoveFile: (index: number) => void;
}

export const UploadedFilesList: React.FC<UploadedFilesListProps> = ({
  uploadedFiles,
  onRemoveFile
}) => {
  if (uploadedFiles.length === 0) {
    return null;
  }

  return (
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
            onClick={() => onRemoveFile(index)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};