import { useState, useCallback } from 'react';
import { UploadedFile } from '../types';
import { processFiles } from '../fileUtils';
import { useToast } from '@/hooks/use-toast';

export const useFileUpload = (updateProgress: (progress: number, message?: string) => void) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

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
    
    handleFileProcessing(files);
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileProcessing(files);
    }
  };

  const handleFileProcessing = async (files: File[]) => {
    try {
      const processedFiles = await processFiles(files, updateProgress);
      setUploadedFiles(processedFiles);
    } catch (error) {
      throw error;
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return {
    uploadedFiles,
    isDragOver,
    setIsDragOver,
    handleDrop,
    handleFileInput,
    removeFile
  };
};