import { cleanPostgreSQLDump } from './sqlCleaning';

export const transformSqlWithPcrmSuffix = (sqlContent: string): string => {
  // First clean the PostgreSQL dump content
  let cleanedSql = cleanPostgreSQLDump(sqlContent);
  
  // Transform CREATE TABLE statements
  let transformedSql = cleanedSql.replace(
    /CREATE TABLE\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, tableName) => {
      if (tableName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return `CREATE TABLE ${schemaPrefix}${objQuote}${tableName}_PCRM${objQuote}`;
    }
  );

  // Transform CREATE TYPE statements (enums, custom types)
  transformedSql = transformedSql.replace(
    /CREATE TYPE\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, typeName) => {
      if (typeName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return `CREATE TYPE ${schemaPrefix}${objQuote}${typeName}_PCRM${objQuote}`;
    }
  );

  // Transform CREATE FUNCTION statements
  transformedSql = transformedSql.replace(
    /CREATE(?:\s+OR\s+REPLACE)?\s+FUNCTION\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, functionName) => {
      if (functionName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      const originalName = `${schemaPrefix}${objQuote}${functionName}${objQuote}`;
      const newName = `${schemaPrefix}${objQuote}${functionName}_PCRM${objQuote}`;
      return match.replace(originalName, newName);
    }
  );

  // Transform CREATE INDEX statements
  transformedSql = transformedSql.replace(
    /CREATE(?:\s+UNIQUE)?\s+INDEX\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, indexName) => {
      if (indexName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      const originalName = `${schemaPrefix}${objQuote}${indexName}${objQuote}`;
      const newName = `${schemaPrefix}${objQuote}${indexName}_PCRM${objQuote}`;
      return match.replace(originalName, newName);
    }
  );

  // Transform CREATE SEQUENCE statements
  transformedSql = transformedSql.replace(
    /CREATE SEQUENCE\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, sequenceName) => {
      if (sequenceName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return `CREATE SEQUENCE ${schemaPrefix}${objQuote}${sequenceName}_PCRM${objQuote}`;
    }
  );

  // Transform CREATE TRIGGER statements
  transformedSql = transformedSql.replace(
    /CREATE TRIGGER\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, triggerName) => {
      if (triggerName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return `CREATE TRIGGER ${schemaPrefix}${objQuote}${triggerName}_PCRM${objQuote}`;
    }
  );

  // Transform CREATE VIEW statements
  transformedSql = transformedSql.replace(
    /CREATE VIEW\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, viewName) => {
      if (viewName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return `CREATE VIEW ${schemaPrefix}${objQuote}${viewName}_PCRM${objQuote}`;
    }
  );

  // Transform INSERT INTO statements
  transformedSql = transformedSql.replace(
    /INSERT INTO\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, tableName) => {
      if (tableName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return `INSERT INTO ${schemaPrefix}${objQuote}${tableName}_PCRM${objQuote}`;
    }
  );

  // Transform REFERENCES in foreign keys
  transformedSql = transformedSql.replace(
    /REFERENCES\s+(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, tableName) => {
      if (tableName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return `REFERENCES ${schemaPrefix}${objQuote}${tableName}_PCRM${objQuote}`;
    }
  );

  // Only transform explicit type casts (::type_name) to avoid breaking column names
  transformedSql = transformedSql.replace(
    /::(?:([`"]?)(\w+)\1\.)?([`"]?)(\w+)\3/gi,
    (match, schemaQuote, schema, objQuote, typeName) => {
      if (typeName.toLowerCase().endsWith('_pcrm')) {
        return match; // Already has suffix
      }
      
      // Only transform custom types, not built-in types
      const builtinTypes = ['integer', 'text', 'varchar', 'char', 'boolean', 'date', 'timestamp', 'numeric', 'decimal', 'real', 'bigint', 'smallint', 'uuid', 'json', 'jsonb', 'bytea', 'inet', 'cidr', 'macaddr', 'xml', 'money', 'point', 'line', 'lseg', 'box', 'path', 'polygon', 'circle', 'interval', 'time', 'timetz', 'timestamptz'];
      
      if (builtinTypes.includes(typeName.toLowerCase())) {
        return match;
      }
      
      const schemaPrefix = schema ? `${schemaQuote}${schema}${schemaQuote}.` : '';
      return `::${schemaPrefix}${objQuote}${typeName}_PCRM${objQuote}`;
    }
  );

  return transformedSql;
};