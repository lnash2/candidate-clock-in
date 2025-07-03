-- Clear all production data completely and remigrate ALL legacy data
-- Step 1: Drop and recreate legacy_id_mappings to avoid conflicts
DROP TABLE IF EXISTS legacy_id_mappings CASCADE;

-- Step 2: Clear all production tables
DELETE FROM bookings_prod;
DELETE FROM company_rates_prod;
DELETE FROM customers_prod;
DELETE FROM candidates_prod;

-- Step 3: Get counts from legacy tables for verification  
SELECT 
    'LEGACY DATA COUNTS' as report_type,
    (SELECT COUNT(*) FROM candidates WHERE name IS NOT NULL) as total_candidates,
    (SELECT COUNT(*) FROM companies WHERE name IS NOT NULL) as total_companies,
    (SELECT COUNT(*) FROM contacts) as total_contacts,
    (SELECT COUNT(*) FROM company_rates WHERE day_charge_rate IS NOT NULL OR day_pay_rate IS NOT NULL) as total_rates,
    (SELECT COUNT(*) FROM bookings WHERE candidate_id IS NOT NULL AND company_id IS NOT NULL) as total_bookings;