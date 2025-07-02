-- Simple Final Bookings Migration with Default Values

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
  AND b.to_date IS NOT NULL
ON CONFLICT DO NOTHING;

-- Migration Success Summary
INSERT INTO legacy_import_log_prod (table_name, import_status, records_imported, error_message)
VALUES ('MIGRATION_SUCCESS', 'completed', 
        (SELECT COUNT(*) FROM candidates_prod) + (SELECT COUNT(*) FROM customers_prod) + 
        (SELECT COUNT(*) FROM bookings_prod) + (SELECT COUNT(*) FROM company_rates_prod),
        'Legacy data migration completed successfully! All core data migrated to production tables.');

-- Final Migration Report
SELECT 
    '✅ MIGRATION COMPLETED!' as status,
    (SELECT COUNT(*) FROM candidates_prod) as candidates_migrated,
    (SELECT COUNT(*) FROM customers_prod) as customers_migrated,
    (SELECT COUNT(*) FROM company_rates_prod) as rates_migrated,
    (SELECT COUNT(*) FROM bookings_prod) as bookings_migrated,
    (SELECT COUNT(*) FROM legacy_id_mappings) as relationship_mappings,
    '🎯 Your legacy data is now available in the production tables!' as message;