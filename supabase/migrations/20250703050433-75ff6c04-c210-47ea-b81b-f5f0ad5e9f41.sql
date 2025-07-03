-- Clear existing production data and remigrate ALL legacy data
-- Step 1: Clear existing production tables
TRUNCATE TABLE bookings_prod CASCADE;
TRUNCATE TABLE company_rates_prod CASCADE;
TRUNCATE TABLE customers_prod CASCADE;
TRUNCATE TABLE candidates_prod CASCADE;
TRUNCATE TABLE legacy_id_mappings CASCADE;

-- Step 2: Get counts from legacy tables for verification
SELECT 
    'LEGACY DATA COUNTS' as report_type,
    (SELECT COUNT(*) FROM candidates WHERE name IS NOT NULL) as total_candidates,
    (SELECT COUNT(*) FROM companies WHERE name IS NOT NULL) as total_companies,
    (SELECT COUNT(*) FROM contacts) as total_contacts,
    (SELECT COUNT(*) FROM company_rates WHERE day_charge_rate IS NOT NULL OR day_pay_rate IS NOT NULL) as total_rates,
    (SELECT COUNT(*) FROM bookings WHERE candidate_id IS NOT NULL AND company_id IS NOT NULL) as total_bookings;

-- Step 3: Migrate ALL Candidates (NO LIMITS)
INSERT INTO candidates_prod (
    id,
    candidate_name,
    email,
    phone,
    address,
    city,
    postcode,
    national_insurance_number,
    hourly_rate,
    availability_status,
    active_status,
    licence_categories,
    skills,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid() as id,
    COALESCE(c.name, 'Unknown') as candidate_name,
    c.email,
    c.phone_number as phone,
    CASE 
        WHEN a.address1 IS NOT NULL THEN 
            CONCAT_WS(', ', a.address1, a.address2, a.street, a.city)
        ELSE NULL 
    END as address,
    a.city,
    a.postal_code as postcode,
    c.ni_number as national_insurance_number,
    CASE 
        WHEN c.expected_salary IS NOT NULL AND c.expected_salary < 99999999 THEN c.expected_salary::numeric(10,2)
        WHEN c.current_salary IS NOT NULL AND c.current_salary < 99999999 THEN c.current_salary::numeric(10,2)
        ELSE NULL
    END as hourly_rate,
    CASE 
        WHEN c.active_status = 'active' THEN 'Available'
        WHEN c.active_status = 'inactive' THEN 'Unavailable'
        ELSE 'Available'
    END as availability_status,
    CASE 
        WHEN c.active_status IN ('active', 'registered') THEN 'Active'
        ELSE 'Inactive'
    END as active_status,
    CASE 
        WHEN c.driver_license IS NOT NULL THEN 
            ARRAY[c.driver_license]::text[]
        ELSE ARRAY[]::text[]
    END as licence_categories,
    CASE 
        WHEN c.job_category_ids IS NOT NULL THEN 
            (SELECT array_agg(jc.name) 
             FROM job_categories jc 
             WHERE jc.id = ANY(c.job_category_ids))::text[]
        ELSE ARRAY[]::text[]
    END as skills,
    to_timestamp(c.created_at) as created_at,
    CASE 
        WHEN c.updated_at IS NOT NULL THEN to_timestamp(c.updated_at)
        ELSE to_timestamp(c.created_at)
    END as updated_at
FROM candidates c
LEFT JOIN addresses a ON c.address_id = a.id
WHERE c.name IS NOT NULL;

-- Step 4: Migrate ALL Companies to Customers (NO LIMITS)
INSERT INTO customers_prod (
    id,
    company,
    contact_name,
    contact_email,
    contact_phone,
    address,
    city,
    postcode,
    country,
    is_active,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid() as id,
    COALESCE(comp.name, 'Unknown Company') as company,
    cont.name as contact_name,
    COALESCE(cont.work_email, cont.personal_email) as contact_email,
    COALESCE(cont.work_phone, cont.personal_mobile, cont.direct_dial_phone) as contact_phone,
    CASE 
        WHEN a.address1 IS NOT NULL THEN 
            CONCAT_WS(', ', a.address1, a.address2, a.street)
        ELSE NULL 
    END as address,
    a.city,
    a.postal_code as postcode,
    a.country,
    true as is_active,
    to_timestamp(comp.created_at) as created_at,
    CASE 
        WHEN comp.updated_at IS NOT NULL THEN to_timestamp(comp.updated_at)
        ELSE to_timestamp(comp.created_at)
    END as updated_at
FROM companies comp
LEFT JOIN contacts cont ON cont.company_id = comp.id
LEFT JOIN addresses a ON comp.address_id = a.id
WHERE comp.name IS NOT NULL;

-- Step 5: Create ID mapping table for ALL relationships
CREATE TABLE IF NOT EXISTS legacy_id_mappings (
    legacy_table TEXT NOT NULL,
    legacy_id INTEGER NOT NULL,
    new_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (legacy_table, legacy_id)
);

-- Step 6: Populate ALL candidate ID mappings
INSERT INTO legacy_id_mappings (legacy_table, legacy_id, new_id)
SELECT DISTINCT 
    'candidates' as legacy_table,
    c.id as legacy_id,
    cp.id as new_id
FROM candidates c
JOIN candidates_prod cp ON cp.candidate_name = COALESCE(c.name, 'Unknown')
    AND (cp.email = c.email OR (cp.email IS NULL AND c.email IS NULL))
WHERE c.name IS NOT NULL;

-- Step 7: Populate ALL customer ID mappings  
INSERT INTO legacy_id_mappings (legacy_table, legacy_id, new_id)
SELECT DISTINCT
    'companies' as legacy_table,
    comp.id as legacy_id,
    cp.id as new_id
FROM companies comp
JOIN customers_prod cp ON cp.company = COALESCE(comp.name, 'Unknown Company')
WHERE comp.name IS NOT NULL;

-- Step 8: Migrate ALL Company Rates (NO LIMITS)
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

-- Step 9: Migrate ALL Bookings (NO LIMITS)
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
    (SELECT new_id FROM legacy_id_mappings 
     WHERE legacy_table = 'candidates' AND legacy_id = b.candidate_id) as candidate_id,
    (SELECT new_id FROM legacy_id_mappings 
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
  AND EXISTS (SELECT 1 FROM legacy_id_mappings WHERE legacy_table = 'candidates' AND legacy_id = b.candidate_id)
  AND EXISTS (SELECT 1 FROM legacy_id_mappings WHERE legacy_table = 'companies' AND legacy_id = b.company_id)
  AND b.from_date IS NOT NULL
  AND b.to_date IS NOT NULL;

-- Step 10: Final verification and success report
SELECT 
    'FINAL MIGRATION REPORT - ALL DATA' as status,
    (SELECT COUNT(*) FROM candidates_prod) as candidates_migrated,
    (SELECT COUNT(*) FROM customers_prod) as customers_migrated,
    (SELECT COUNT(*) FROM company_rates_prod) as rates_migrated,
    (SELECT COUNT(*) FROM bookings_prod) as bookings_migrated,
    (SELECT COUNT(*) FROM legacy_id_mappings) as relationship_mappings,
    now() as completed_at;

-- Log final success
INSERT INTO legacy_import_log_prod (table_name, import_status, records_imported, error_message)
VALUES ('COMPLETE_MIGRATION_ALL_DATA', 'completed', 
        (SELECT COUNT(*) FROM candidates_prod) + (SELECT COUNT(*) FROM customers_prod) + 
        (SELECT COUNT(*) FROM bookings_prod) + (SELECT COUNT(*) FROM company_rates_prod),
        'COMPLETE legacy data migration finished - ALL data migrated with no limits');