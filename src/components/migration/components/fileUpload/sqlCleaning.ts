// Clean PostgreSQL dump file content to remove metadata and non-SQL content
export const cleanPostgreSQLDump = (sqlContent: string): string => {
  const lines = sqlContent.split('\n');
  const cleanedLines: string[] = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Skip comment lines
    if (trimmedLine.startsWith('--')) continue;
    
    // Skip PostgreSQL dump metadata
    if (trimmedLine.match(/^(SET|SELECT|COPY|\\|Type|Schema|Owner|Name|Table|Source|Target)/i)) continue;
    
    // Skip lines that are just dashes or equals
    if (trimmedLine.match(/^[-=]+$/)) continue;
    
    // Skip lines with just numbers (table counts, etc.)
    if (trimmedLine.match(/^\d+$/)) continue;
    
    // Skip lines that look like table headers
    if (trimmedLine.match(/^\([0-9]+ rows?\)$/i)) continue;
    
    cleanedLines.push(line);
  }
  
  return cleanedLines.join('\n');
};