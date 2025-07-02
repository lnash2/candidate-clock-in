export interface ImportStatus {
  step: 'idle' | 'reading-files' | 'validating' | 'importing-schema' | 'importing-data' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export interface UploadedFile {
  file: File;
  type: 'schema' | 'data' | 'unknown';
  content?: string;
  valid: boolean;
  error?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}