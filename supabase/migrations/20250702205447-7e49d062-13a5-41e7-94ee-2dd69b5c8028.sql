-- Fix numeric precision issues before migration
-- Update candidates_prod table to handle larger hourly rates
ALTER TABLE candidates_prod ALTER COLUMN hourly_rate TYPE numeric(10,2);

-- Update company_rates_prod to handle larger rates
ALTER TABLE company_rates_prod ALTER COLUMN charge_rate TYPE numeric(10,2);
ALTER TABLE company_rates_prod ALTER COLUMN pay_rate TYPE numeric(10,2);

-- Check maximum values in legacy data to ensure our precision is adequate
SELECT 
    'candidates expected_salary' as field,
    MAX(expected_salary) as max_value,
    MIN(expected_salary) as min_value
FROM candidates 
WHERE expected_salary IS NOT NULL
UNION ALL
SELECT 
    'candidates current_salary' as field,
    MAX(current_salary) as max_value,
    MIN(current_salary) as min_value
FROM candidates 
WHERE current_salary IS NOT NULL
UNION ALL
SELECT 
    'company_rates charge_rate' as field,
    MAX(charge_rate) as max_value,
    MIN(charge_rate) as min_value
FROM company_rates 
WHERE charge_rate IS NOT NULL
UNION ALL
SELECT 
    'company_rates pay_rate' as field,
    MAX(pay_rate) as max_value,
    MIN(pay_rate) as min_value
FROM company_rates 
WHERE pay_rate IS NOT NULL;