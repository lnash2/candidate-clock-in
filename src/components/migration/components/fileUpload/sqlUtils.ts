export const transformSqlWithPcrmSuffix = (sqlContent: string): string => {
  // Transform CREATE TABLE statements
  let transformedSql = sqlContent.replace(
    /CREATE TABLE\s+([`"]?)(\w+)\1/gi,
    (match, quote, tableName) => {
      if (tableName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      return `CREATE TABLE ${quote}${tableName}_PCRM${quote}`;
    }
  );

  // Transform INSERT INTO statements
  transformedSql = transformedSql.replace(
    /INSERT INTO\s+([`"]?)(\w+)\1/gi,
    (match, quote, tableName) => {
      if (tableName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      return `INSERT INTO ${quote}${tableName}_PCRM${quote}`;
    }
  );

  // Transform REFERENCES in foreign keys
  transformedSql = transformedSql.replace(
    /REFERENCES\s+([`"]?)(\w+)\1/gi,
    (match, quote, tableName) => {
      if (tableName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      return `REFERENCES ${quote}${tableName}_PCRM${quote}`;
    }
  );

  return transformedSql;
};

export const splitSqlIntoStatements = (sql: string): string[] => {
  return sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.toLowerCase().startsWith('--'));
};