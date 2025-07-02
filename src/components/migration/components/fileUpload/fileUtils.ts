import { FILE_SIZE_LIMITS, SQL_KEYWORDS } from './constants';
import { ValidationResult, UploadedFile } from './types';
import { cleanPostgreSQLDump } from './sqlCleaning';

export const detectFileType = (fileName: string, content: string): 'schema' | 'data' | 'unknown' => {
  const lowerName = fileName.toLowerCase();
  const upperContent = content.toUpperCase();
  
  if (lowerName.includes('schema') || upperContent.includes('CREATE TABLE')) {
    return 'schema';
  }
  if (lowerName.includes('data') || upperContent.includes('INSERT INTO')) {
    return 'data';
  }
  return 'unknown';
};

export const validateSqlContent = (content: string, isPartialContent: boolean = false): ValidationResult => {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'File is empty' };
  }
  
  // Clean PostgreSQL dump content first
  const cleanedContent = cleanPostgreSQLDump(content);
  
  if (!cleanedContent || cleanedContent.trim().length === 0) {
    return { valid: false, error: 'File contains no valid SQL statements after cleaning PostgreSQL dump metadata' };
  }
  
  // Basic SQL validation on cleaned content
  const upperContent = cleanedContent.toUpperCase();
  const hasSqlKeywords = SQL_KEYWORDS.some(keyword => upperContent.includes(keyword));
  
  if (!hasSqlKeywords) {
    const errorMsg = isPartialContent 
      ? 'File sample does not contain SQL statements (first 10KB checked, after PostgreSQL dump cleaning)'
      : 'File does not contain valid SQL statements after PostgreSQL dump cleaning';
    return { valid: false, error: errorMsg };
  }
  
  return { valid: true };
};

export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    // For large files (>100MB), only read first 10KB for validation
    const isLargeFile = file.size > FILE_SIZE_LIMITS.LARGE_FILE_THRESHOLD;
    const chunk = isLargeFile ? file.slice(0, FILE_SIZE_LIMITS.VALIDATION_CHUNK_SIZE) : file;
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(chunk);
  });
};

export const readLargeFileForImport = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    reader.onerror = () => reject(new Error('Failed to read large file'));
    reader.readAsText(file);
  });
};

export const processFiles = async (
  files: File[],
  updateProgress: (progress: number, message: string) => void
): Promise<UploadedFile[]> => {
  const processedFiles: UploadedFile[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      const content = await readFileContent(file);
      const isLargeFile = file.size > FILE_SIZE_LIMITS.LARGE_FILE_THRESHOLD;
      const validation = validateSqlContent(content, isLargeFile);
      const type = detectFileType(file.name, content);
      
      processedFiles.push({
        file,
        type,
        content: isLargeFile ? undefined : content, // Don't store full content for large files
        valid: validation.valid,
        error: validation.error
      });
      
      updateProgress(
        10 + ((i + 1) / files.length) * 20,
        `Processed ${i + 1} of ${files.length} files...`
      );
    } catch (error) {
      processedFiles.push({
        file,
        type: 'unknown',
        valid: false,
        error: error instanceof Error ? error.message : 'Failed to read file'
      });
    }
  }

  return processedFiles;
};