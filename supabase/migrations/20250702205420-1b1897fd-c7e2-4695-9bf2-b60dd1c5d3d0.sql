-- Comprehensive Legacy Data Migration to Production Tables
-- This migration transforms legacy data into the new _prod table structure

-- Step 1: Migrate Candidates (42K records)
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
        WHEN c.expected_salary IS NOT NULL THEN c.expected_salary::numeric
        WHEN c.current_salary IS NOT NULL THEN c.current_salary::numeric
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

-- Step 2: Migrate Companies to Customers (27K records)
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
    cont.email as contact_email,
    cont.phone_number as contact_phone,
    CASE 
        WHEN a.address1 IS NOT NULL THEN 
            CONCAT_WS(', ', a.address1, a.address2, a.street)
        ELSE NULL 
    END as address,
    a.city,
    a.postal_code as postcode,
    a.country,
    CASE 
        WHEN comp.company_status_id IS NOT NULL THEN true
        ELSE true
    END as is_active,
    to_timestamp(comp.created_at) as created_at,
    CASE 
        WHEN comp.updated_at IS NOT NULL THEN to_timestamp(comp.updated_at)
        ELSE to_timestamp(comp.created_at)
    END as updated_at
FROM companies comp
LEFT JOIN contacts cont ON cont.company_id = comp.id
LEFT JOIN addresses a ON comp.address_id = a.id
WHERE comp.name IS NOT NULL;

-- Step 3: Create ID mapping table for reference
CREATE TABLE IF NOT EXISTS legacy_id_mappings (
    legacy_table TEXT NOT NULL,
    legacy_id INTEGER NOT NULL,
    new_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (legacy_table, legacy_id)
);

-- Step 4: Populate candidate ID mappings
INSERT INTO legacy_id_mappings (legacy_table, legacy_id, new_id)
SELECT 
    'candidates' as legacy_table,
    c.id as legacy_id,
    cp.id as new_id
FROM candidates c
JOIN candidates_prod cp ON cp.candidate_name = COALESCE(c.name, 'Unknown')
    AND cp.email = c.email
WHERE c.name IS NOT NULL;

-- Step 5: Populate customer ID mappings  
INSERT INTO legacy_id_mappings (legacy_table, legacy_id, new_id)
SELECT 
    'companies' as legacy_table,
    comp.id as legacy_id,
    cp.id as new_id
FROM companies comp
JOIN customers_prod cp ON cp.company = COALESCE(comp.name, 'Unknown Company')
WHERE comp.name IS NOT NULL;

-- Step 6: Migrate Company Rates (336 records)
INSERT INTO company_rates_prod (
    id,
    driver_class,
    rate_category,
    charge_rate,
    pay_rate,
    description,
    valid_from,
    valid_to,
    is_active,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid() as id,
    CASE 
        WHEN cr.driver_class IS NOT NULL THEN cr.driver_class
        ELSE 'Standard'
    END as driver_class,
    CASE 
        WHEN cr.rate_category IS NOT NULL THEN cr.rate_category
        ELSE 'Standard'
    END as rate_category,
    COALESCE(cr.charge_rate, 0)::numeric as charge_rate,
    COALESCE(cr.pay_rate, 0)::numeric as pay_rate,
    cr.description,
    CASE 
        WHEN cr.valid_from IS NOT NULL THEN to_timestamp(cr.valid_from)::date
        ELSE CURRENT_DATE
    END as valid_from,
    CASE 
        WHEN cr.valid_to IS NOT NULL THEN to_timestamp(cr.valid_to)::date
        ELSE NULL
    END as valid_to,
    COALESCE(cr.is_active, true) as is_active,
    to_timestamp(cr.created_at) as created_at,
    CASE 
        WHEN cr.updated_at IS NOT NULL THEN to_timestamp(cr.updated_at)
        ELSE to_timestamp(cr.created_at)
    END as updated_at
FROM company_rates cr;

-- Step 7: Migrate Bookings (3K records)
INSERT INTO bookings_prod (
    id,
    candidate_id,
    customer_id,
    start_date,
    end_date,
    driver_class,
    pickup_location,
    dropoff_location,
    booking_type,
    status,
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
        WHEN b.day_type IS NOT NULL THEN b.day_type
        ELSE 'Standard'
    END as driver_class,
    CASE 
        WHEN a.formatted_address IS NOT NULL THEN a.formatted_address
        ELSE CONCAT_WS(', ', a.address1, a.city)
    END as pickup_location,
    NULL as dropoff_location, -- Not available in legacy data
    COALESCE(b.booking_type, 'open') as booking_type,
    COALESCE(b.booking_status, 'open') as status,
    COALESCE(b.is_night, false) as is_night_shift,
    b.note as notes,
    to_timestamp(b.created_at) as created_at,
    CASE 
        WHEN b.updated_at IS NOT NULL THEN to_timestamp(b.updated_at)
        ELSE to_timestamp(b.created_at)
    END as updated_at
FROM bookings b
LEFT JOIN addresses a ON b.address_id = a.id
WHERE b.candidate_id IS NOT NULL AND b.company_id IS NOT NULL;

-- Step 8: Create migration status log
INSERT INTO legacy_import_log_prod (table_name, import_status, records_imported, error_message)
VALUES 
    ('candidates_migration', 'completed', (SELECT COUNT(*) FROM candidates_prod), 'Legacy candidates migrated successfully'),
    ('customers_migration', 'completed', (SELECT COUNT(*) FROM customers_prod), 'Legacy companies migrated to customers successfully'),
    ('rates_migration', 'completed', (SELECT COUNT(*) FROM company_rates_prod), 'Legacy company rates migrated successfully'),
    ('bookings_migration', 'completed', (SELECT COUNT(*) FROM bookings_prod), 'Legacy bookings migrated successfully');

-- Step 9: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_legacy_id_mappings_lookup ON legacy_id_mappings(legacy_table, legacy_id);
CREATE INDEX IF NOT EXISTS idx_candidates_prod_name ON candidates_prod(candidate_name);
CREATE INDEX IF NOT EXISTS idx_customers_prod_company ON customers_prod(company);
CREATE INDEX IF NOT EXISTS idx_bookings_prod_dates ON bookings_prod(start_date, end_date);

-- Step 10: Update statistics
ANALYZE candidates_prod;
ANALYZE customers_prod;
ANALYZE company_rates_prod;
ANALYZE bookings_prod;
ANALYZE legacy_id_mappings;