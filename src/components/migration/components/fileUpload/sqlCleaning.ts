// Basic PostgreSQL dump cleaning - only remove obvious metadata
export const cleanPostgreSQLDump = (sqlContent: string): string => {
  const lines = sqlContent.split('\n');
  const cleanedLines: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('--')) continue;
    
    // Skip common PostgreSQL dump metadata lines
    if (trimmed.match(/^(SET|SELECT pg_catalog|\\|COPY.*FROM stdin)/i)) continue;
    
    cleanedLines.push(line);
  }
  
  return cleanedLines.join('\n');
};