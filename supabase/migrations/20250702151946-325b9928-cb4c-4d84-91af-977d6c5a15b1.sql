-- Rename all tables to include _prod prefix to avoid schema conflicts

-- Rename tables (order matters due to foreign key constraints)
ALTER TABLE IF EXISTS public.bookings RENAME TO bookings_prod;
ALTER TABLE IF EXISTS public.candidates RENAME TO candidates_prod;
ALTER TABLE IF EXISTS public.company_rates RENAME TO company_rates_prod;
ALTER TABLE IF EXISTS public.customers RENAME TO customers_prod;
ALTER TABLE IF EXISTS public.id_mappings RENAME TO id_mappings_prod;
ALTER TABLE IF EXISTS public.legacy_import_log RENAME TO legacy_import_log_prod;
ALTER TABLE IF EXISTS public.migration_status RENAME TO migration_status_prod;
ALTER TABLE IF EXISTS public.note_types RENAME TO note_types_prod;
ALTER TABLE IF EXISTS public.vehicles RENAME TO vehicles_prod;
ALTER TABLE IF EXISTS public.work_locations RENAME TO work_locations_prod;

-- Update foreign key constraints to reference the new table names
-- Note: PostgreSQL automatically updates constraint names, but we need to ensure relationships are maintained

-- Update any existing RLS policies to reference new table names
-- (RLS policies are automatically updated with table renames)

-- Update any existing indexes 
-- (Indexes are automatically renamed with table renames)

-- Update any existing triggers
-- (Triggers are automatically updated with table renames)