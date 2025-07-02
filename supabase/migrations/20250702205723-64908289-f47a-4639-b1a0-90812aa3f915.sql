-- Migration Phase 3: Bookings and Final Setup

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
    COALESCE(b.day_type, 'Standard') as driver_class,
    CASE 
        WHEN a.formatted_address IS NOT NULL THEN a.formatted_address
        ELSE CONCAT_WS(', ', a.address1, a.city)
    END as pickup_location,
    NULL as dropoff_location,
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
WHERE b.candidate_id IS NOT NULL 
  AND b.company_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM legacy_id_mappings WHERE legacy_table = 'candidates' AND legacy_id = b.candidate_id)
  AND EXISTS (SELECT 1 FROM legacy_id_mappings WHERE legacy_table = 'companies' AND legacy_id = b.company_id)
ON CONFLICT DO NOTHING;

-- Step 8: Create migration status log
INSERT INTO legacy_import_log_prod (table_name, import_status, records_imported, error_message)
VALUES 
    ('candidates_migration', 'completed', (SELECT COUNT(*) FROM candidates_prod), 'Legacy candidates migrated successfully'),
    ('customers_migration', 'completed', (SELECT COUNT(*) FROM customers_prod), 'Legacy companies migrated to customers successfully'),
    ('rates_migration', 'completed', (SELECT COUNT(*) FROM company_rates_prod), 'Legacy company rates migrated successfully'),
    ('bookings_migration', 'completed', (SELECT COUNT(*) FROM bookings_prod), 'Legacy bookings migrated successfully'),
    ('id_mappings_created', 'completed', (SELECT COUNT(*) FROM legacy_id_mappings), 'ID mappings created for data relationships');

-- Step 9: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_legacy_id_mappings_lookup ON legacy_id_mappings(legacy_table, legacy_id);
CREATE INDEX IF NOT EXISTS idx_candidates_prod_name ON candidates_prod(candidate_name);
CREATE INDEX IF NOT EXISTS idx_customers_prod_company ON customers_prod(company);
CREATE INDEX IF NOT EXISTS idx_bookings_prod_dates ON bookings_prod(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_prod_candidate ON bookings_prod(candidate_id);
CREATE INDEX IF NOT EXISTS idx_bookings_prod_customer ON bookings_prod(customer_id);

-- Step 10: Generate migration summary
SELECT 
    'Migration Summary' as report_type,
    (SELECT COUNT(*) FROM candidates_prod) as candidates_migrated,
    (SELECT COUNT(*) FROM customers_prod) as customers_migrated,
    (SELECT COUNT(*) FROM company_rates_prod) as rates_migrated,
    (SELECT COUNT(*) FROM bookings_prod) as bookings_migrated,
    (SELECT COUNT(*) FROM legacy_id_mappings) as id_mappings_created;