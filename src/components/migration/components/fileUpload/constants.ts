export const FILE_SIZE_LIMITS = {
  LARGE_FILE_THRESHOLD: 100 * 1024 * 1024, // 100MB
  VALIDATION_CHUNK_SIZE: 10 * 1024, // 10KB for validation sample
} as const;

export const BATCH_SIZES = {
  SCHEMA_IMPORT: 50,
  DATA_IMPORT: 10,
} as const;

export const SQL_KEYWORDS = ['CREATE', 'INSERT', 'UPDATE', 'DELETE', 'SELECT', 'ALTER', 'DROP'] as const;

export const ACCEPTED_FILE_TYPES = ['.sql'] as const;