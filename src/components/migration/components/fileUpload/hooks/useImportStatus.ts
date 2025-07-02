import { useState } from 'react';
import { ImportStatus } from '../types';

export const useImportStatus = () => {
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    step: 'idle',
    progress: 0,
    message: 'Ready to import SQL files directly'
  });

  const updateStatus = (update: Partial<ImportStatus>) => {
    setImportStatus(prev => ({ ...prev, ...update }));
  };

  const updateProgress = (progress: number, message?: string) => {
    setImportStatus(prev => ({ 
      ...prev, 
      progress, 
      ...(message && { message }) 
    }));
  };

  return {
    importStatus,
    updateStatus,
    updateProgress
  };
};