-- Update the execute_sql function to use the renamed table legacy_import_log_prod
CREATE OR REPLACE FUNCTION public.execute_sql(sql_statement text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    result JSON;
    record_count INTEGER := 0;
BEGIN
    -- Log the SQL execution attempt
    INSERT INTO legacy_import_log_prod (table_name, import_status, error_message)
    VALUES ('SQL_EXECUTION', 'started', 'Executing: ' || LEFT(sql_statement, 100) || '...');
    
    -- Basic validation to prevent dangerous operations
    IF sql_statement ILIKE '%DROP DATABASE%' OR 
       sql_statement ILIKE '%DROP SCHEMA%' OR
       sql_statement ILIKE '%ALTER DATABASE%' THEN
        RAISE EXCEPTION 'Dangerous SQL operation not allowed';
    END IF;
    
    -- Execute the SQL statement
    BEGIN
        EXECUTE sql_statement;
        GET DIAGNOSTICS record_count = ROW_COUNT;
        
        -- Log successful execution
        INSERT INTO legacy_import_log_prod (table_name, import_status, records_imported)
        VALUES ('SQL_EXECUTION', 'completed', record_count);
        
        -- Return success result
        result := json_build_object(
            'success', true,
            'message', 'SQL executed successfully',
            'rows_affected', record_count
        );
        
    EXCEPTION WHEN OTHERS THEN
        -- Log the error
        INSERT INTO legacy_import_log_prod (table_name, import_status, error_message)
        VALUES ('SQL_EXECUTION', 'failed', SQLERRM);
        
        -- Return error result
        result := json_build_object(
            'success', false,
            'error', SQLERRM,
            'sqlstate', SQLSTATE
        );
    END;
    
    RETURN result;
END;
$function$