import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { ACCEPTED_FILE_TYPES } from '../constants';

interface FileUploadAreaProps {
  isDragOver: boolean;
  setIsDragOver: (isDragOver: boolean) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  isDragOver,
  setIsDragOver,
  onDrop,
  onFileInput
}) => {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragOver ? 'border-primary bg-muted/50' : 'border-muted-foreground/25'
      }`}
      onDrop={onDrop}
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
        accept={ACCEPTED_FILE_TYPES.join(',')}
        onChange={onFileInput}
        className="hidden"
        id="file-upload"
      />
      <Button asChild variant="outline">
        <label htmlFor="file-upload" className="cursor-pointer">
          Choose Files
        </label>
      </Button>
    </div>
  );
};