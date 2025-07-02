// Basic SQL validation for legacy imports
export const validateSqlStatement = (statement: string): { valid: boolean; error?: string } => {
  const trimmed = statement.trim();
  
  // Must not be empty
  if (!trimmed) {
    return { valid: false, error: 'Empty statement' };
  }
  
  // Check for extremely dangerous operations only
  const upperStatement = trimmed.toUpperCase();
  if (upperStatement.includes('DROP DATABASE') || upperStatement.includes('DROP SCHEMA')) {
    return { valid: false, error: 'Dangerous operation not allowed' };
  }
  
  return { valid: true };
};