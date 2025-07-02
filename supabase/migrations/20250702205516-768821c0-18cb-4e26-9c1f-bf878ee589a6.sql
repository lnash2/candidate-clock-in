-- Fix numeric precision issues and check data ranges
-- Update candidates_prod table to handle larger hourly rates
ALTER TABLE candidates_prod ALTER COLUMN hourly_rate TYPE numeric(10,2);

-- Update company_rates_prod to handle larger rates  
ALTER TABLE company_rates_prod ALTER COLUMN charge_rate TYPE numeric(10,2);
ALTER TABLE company_rates_prod ALTER COLUMN pay_rate TYPE numeric(10,2);

-- Check maximum values in legacy data to ensure our precision is adequate
SELECT 
    'candidates expected_salary' as field,
    MAX(expected_salary) as max_value,
    MIN(expected_salary) as min_value,
    COUNT(*) as record_count
FROM candidates 
WHERE expected_salary IS NOT NULL
UNION ALL
SELECT 
    'candidates current_salary' as field,
    MAX(current_salary) as max_value,
    MIN(current_salary) as min_value,
    COUNT(*) as record_count
FROM candidates 
WHERE current_salary IS NOT NULL
UNION ALL
SELECT 
    'company_rates day_charge_rate' as field,
    MAX(day_charge_rate) as max_value,
    MIN(day_charge_rate) as min_value,
    COUNT(*) as record_count
FROM company_rates 
WHERE day_charge_rate IS NOT NULL
UNION ALL
SELECT 
    'company_rates day_pay_rate' as field,
    MAX(day_pay_rate) as max_value,
    MIN(day_pay_rate) as min_value,
    COUNT(*) as record_count
FROM company_rates 
WHERE day_pay_rate IS NOT NULL;