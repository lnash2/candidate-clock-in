-- Final complete migration of ALL legacy data with fresh approach
-- Step 1: Create ID mapping table with fresh name to avoid conflicts
CREATE TABLE IF NOT EXISTS legacy_mappings_final (
    legacy_table TEXT NOT NULL,
    legacy_id INTEGER NOT NULL,
    new_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (legacy_table, legacy_id)
);

-- Step 2: Populate ALL candidate ID mappings with ON CONFLICT handling
INSERT INTO legacy_mappings_final (legacy_table, legacy_id, new_id)
SELECT DISTINCT 
    'candidates' as legacy_table,
    c.id as legacy_id,
    cp.id as new_id
FROM candidates c
JOIN candidates_prod cp ON cp.candidate_name = COALESCE(c.name, 'Unknown')
    AND (cp.email = c.email OR (cp.email IS NULL AND c.email IS NULL))
WHERE c.name IS NOT NULL
ON CONFLICT DO NOTHING;

-- Step 3: Populate ALL customer ID mappings with ON CONFLICT handling
INSERT INTO legacy_mappings_final (legacy_table, legacy_id, new_id)
SELECT DISTINCT
    'companies' as legacy_table,
    comp.id as legacy_id,
    cp.id as new_id
FROM companies comp
JOIN customers_prod cp ON cp.company = COALESCE(comp.name, 'Unknown Company')
WHERE comp.name IS NOT NULL
ON CONFLICT DO NOTHING;

-- Step 4: Migrate ALL Company Rates using new mapping table
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
    (SELECT new_id FROM legacy_mappings_final 
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
WHERE cr.day_charge_rate IS NOT NULL OR cr.day_pay_rate IS NOT NULL
ON CONFLICT DO NOTHING;

-- Step 5: Migrate ALL Bookings using new mapping table
INSERT INTO bookings_prod (
    id,
    candidate_id,
    customer_id,
    start_date,
    end_date,
    pickup_location,
    is_night_shift,
    notes,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid() as id,
    (SELECT new_id FROM legacy_mappings_final 
     WHERE legacy_table = 'candidates' AND legacy_id = b.candidate_id) as candidate_id,
    (SELECT new_id FROM legacy_mappings_final 
     WHERE legacy_table = 'companies' AND legacy_id = b.company_id) as customer_id,
    to_timestamp(b.from_date)::date as start_date,
    to_timestamp(b.to_date)::date as end_date,
    CASE 
        WHEN a.formatted_address IS NOT NULL THEN a.formatted_address
        ELSE CONCAT_WS(', ', a.address1, a.city)
    END as pickup_location,
    COALESCE(b.is_night, false) as is_night_shift,
    SUBSTRING(COALESCE(b.note, ''), 1, 500) as notes,
    to_timestamp(b.created_at) as created_at,
    CASE 
        WHEN b.updated_at IS NOT NULL THEN to_timestamp(b.updated_at)
        ELSE to_timestamp(b.created_at)
    END as updated_at
FROM bookings b
LEFT JOIN addresses a ON b.address_id = a.id
WHERE b.candidate_id IS NOT NULL 
  AND b.company_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM legacy_mappings_final WHERE legacy_table = 'candidates' AND legacy_id = b.candidate_id)
  AND EXISTS (SELECT 1 FROM legacy_mappings_final WHERE legacy_table = 'companies' AND legacy_id = b.company_id)
  AND b.from_date IS NOT NULL
  AND b.to_date IS NOT NULL
ON CONFLICT DO NOTHING;

-- Step 6: Final comprehensive report showing ALL migrated data
SELECT 
    '🎉 COMPLETE MIGRATION REPORT - ALL DATA MIGRATED' as status,
    (SELECT COUNT(*) FROM candidates_prod) as candidates_migrated,
    (SELECT COUNT(*) FROM customers_prod) as customers_migrated,
    (SELECT COUNT(*) FROM company_rates_prod) as rates_migrated,
    (SELECT COUNT(*) FROM bookings_prod) as bookings_migrated,
    (SELECT COUNT(*) FROM legacy_mappings_final WHERE legacy_table = 'candidates') as candidate_mappings,
    (SELECT COUNT(*) FROM legacy_mappings_final WHERE legacy_table = 'companies') as company_mappings,
    now() as completed_at;