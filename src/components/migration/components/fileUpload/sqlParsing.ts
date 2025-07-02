import { validateSqlStatement } from './sqlValidation';

export const splitSqlIntoStatements = (sql: string): string[] => {
  const statements: string[] = [];
  let currentStatement = '';
  let inQuotes = false;
  let quoteChar = '';
  let inDollarQuoted = false;
  let dollarTag = '';
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const prevChar = i > 0 ? sql[i - 1] : '';
    
    // Handle dollar-quoted strings (PostgreSQL function bodies)
    if (char === '$' && !inQuotes) {
      // Look for dollar tag start/end
      let tagEnd = i + 1;
      while (tagEnd < sql.length && sql[tagEnd] !== '$') {
        tagEnd++;
      }
      
      if (tagEnd < sql.length) {
        const potentialTag = sql.substring(i, tagEnd + 1);
        
        if (!inDollarQuoted) {
          // Starting a dollar-quoted section
          inDollarQuoted = true;
          dollarTag = potentialTag;
          currentStatement += sql.substring(i, tagEnd + 1);
          i = tagEnd;
          continue;
        } else if (potentialTag === dollarTag) {
          // Ending the dollar-quoted section
          inDollarQuoted = false;
          dollarTag = '';
          currentStatement += sql.substring(i, tagEnd + 1);
          i = tagEnd;
          continue;
        }
      }
    }
    
    // Handle regular quote detection (only when not in dollar-quoted)
    if (!inDollarQuoted && (char === '"' || char === "'") && prevChar !== '\\') {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
        quoteChar = '';
      }
    }
    
    // Handle statement termination
    if (char === ';' && !inQuotes && !inDollarQuoted) {
      const statement = currentStatement.trim();
      if (statement) {
        const validation = validateSqlStatement(statement);
        if (validation.valid) {
          statements.push(statement);
        } else {
          console.warn(`Skipping invalid statement: ${validation.error}`);
        }
      }
      currentStatement = '';
    } else {
      currentStatement += char;
    }
  }
  
  // Handle final statement if no trailing semicolon
  const finalStatement = currentStatement.trim();
  if (finalStatement) {
    const validation = validateSqlStatement(finalStatement);
    if (validation.valid) {
      statements.push(finalStatement);
    }
  }
  
  return statements;
};