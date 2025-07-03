-- Step 4: Create ID mapping table and populate mappings
CREATE TABLE legacy_id_mappings (
    legacy_table TEXT NOT NULL,
    legacy_id INTEGER NOT NULL,
    new_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (legacy_table, legacy_id)
);

-- Step 5: Populate ALL candidate ID mappings
INSERT INTO legacy_id_mappings (legacy_table, legacy_id, new_id)
SELECT DISTINCT 
    'candidates' as legacy_table,
    c.id as legacy_id,
    cp.id as new_id
FROM candidates c
JOIN candidates_prod cp ON cp.candidate_name = COALESCE(c.name, 'Unknown')
    AND (cp.email = c.email OR (cp.email IS NULL AND c.email IS NULL))
WHERE c.name IS NOT NULL;

-- Step 6: Populate ALL customer ID mappings  
INSERT INTO legacy_id_mappings (legacy_table, legacy_id, new_id)
SELECT DISTINCT
    'companies' as legacy_table,
    comp.id as legacy_id,
    cp.id as new_id
FROM companies comp
JOIN customers_prod cp ON cp.company = COALESCE(comp.name, 'Unknown Company')
WHERE comp.name IS NOT NULL;

-- Step 7: Migrate ALL Company Rates
INSERT INTO company_rates_prod (
    id,
    customer_id,
    driver_class,
    rate_category,
    charge_rate,
    pay_rate,
    description,
    effective_from,
    effective_to,
    is_active,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid() as id,
    (SELECT new_id FROM legacy_id_mappings 
     WHERE legacy_table = 'companies' AND legacy_id = cr.company_id) as customer_id,
    COALESCE(cr.role, 'Standard') as driver_class,
    'Standard' as rate_category,
    CASE 
        WHEN cr.day_charge_rate IS NOT NULL AND cr.day_charge_rate < 99999999 THEN cr.day_charge_rate::numeric(10,2)
        ELSE 0
    END as charge_rate,
    CASE 
        WHEN cr.day_pay_rate IS NOT NULL AND cr.day_pay_rate < 99999999 THEN cr.day_pay_rate::numeric(10,2)
        ELSE 0
    END as pay_rate,
    CONCAT('Legacy rate for company ID: ', cr.company_id) as description,
    CURRENT_DATE as effective_from,
    NULL as effective_to,
    true as is_active,
    to_timestamp(cr.created_at) as created_at,
    CASE 
        WHEN cr.updated_at IS NOT NULL THEN to_timestamp(cr.updated_at)
        ELSE to_timestamp(cr.created_at)
    END as updated_at
FROM company_rates cr
WHERE cr.day_charge_rate IS NOT NULL OR cr.day_pay_rate IS NOT NULL;

-- Step 8: Check mapping progress
SELECT 
    'MAPPING PROGRESS' as status,
    (SELECT COUNT(*) FROM legacy_id_mappings WHERE legacy_table = 'candidates') as candidate_mappings,
    (SELECT COUNT(*) FROM legacy_id_mappings WHERE legacy_table = 'companies') as company_mappings,
    (SELECT COUNT(*) FROM company_rates_prod) as rates_migrated;