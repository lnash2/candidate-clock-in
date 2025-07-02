// Validate that a SQL statement is safe and executable
export const validateSqlStatement = (statement: string): { valid: boolean; error?: string } => {
  const trimmed = statement.trim().toUpperCase();
  
  // Must not be empty
  if (!trimmed) {
    return { valid: false, error: 'Empty statement' };
  }
  
  // Must be a valid SQL statement type
  const validStatements = ['CREATE', 'INSERT', 'UPDATE', 'DELETE', 'SELECT', 'ALTER', 'DROP'];
  const startsWithValidKeyword = validStatements.some(keyword => trimmed.startsWith(keyword));
  
  if (!startsWithValidKeyword) {
    return { valid: false, error: `Invalid SQL statement: ${statement.substring(0, 50)}...` };
  }
  
  // Check for dangerous operations
  if (trimmed.includes('DROP DATABASE') || trimmed.includes('DROP SCHEMA')) {
    return { valid: false, error: 'Dangerous operation not allowed' };
  }
  
  return { valid: true };
};