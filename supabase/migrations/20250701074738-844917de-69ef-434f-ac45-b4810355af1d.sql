
-- Create a migration tracking table to monitor the migration process
CREATE TABLE public.migration_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  total_records INTEGER DEFAULT 0,
  migrated_records INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table to store ID mappings between old and new systems
CREATE TABLE public.id_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  old_id TEXT NOT NULL,
  new_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(table_name, old_id)
);

-- Create indexes for better performance
CREATE INDEX idx_migration_status_table_name ON public.migration_status(table_name);
CREATE INDEX idx_migration_status_status ON public.migration_status(status);
CREATE INDEX idx_id_mappings_table_old_id ON public.id_mappings(table_name, old_id);

-- Enable RLS for migration tables
ALTER TABLE public.migration_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_mappings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for migration tables (allow all operations for now)
CREATE POLICY "Allow all operations on migration_status" 
  ON public.migration_status 
  FOR ALL 
  USING (true);

CREATE POLICY "Allow all operations on id_mappings" 
  ON public.id_mappings 
  FOR ALL 
  USING (true);

-- Create example PCRM tables based on your existing structure
-- These will be created dynamically by the Lambda function, but here are some examples:

-- Example: users_PCRM table
CREATE TABLE public.users_PCRM (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id TEXT NOT NULL,
  username TEXT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at_legacy TIMESTAMP WITH TIME ZONE,
  updated_at_legacy TIMESTAMP WITH TIME ZONE,
  migrated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  migration_source TEXT DEFAULT 'legacy_admin',
  UNIQUE(legacy_id)
);

-- Example: notes_PCRM table  
CREATE TABLE public.notes_PCRM (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id TEXT NOT NULL,
  legacy_user_id TEXT,
  title TEXT,
  content TEXT,
  category TEXT,
  priority TEXT,
  status TEXT,
  created_at_legacy TIMESTAMP WITH TIME ZONE,
  updated_at_legacy TIMESTAMP WITH TIME ZONE,
  migrated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  migration_source TEXT DEFAULT 'legacy_admin',
  UNIQUE(legacy_id)
);

-- Enable RLS for PCRM tables
ALTER TABLE public.users_PCRM ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes_PCRM ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for PCRM tables
CREATE POLICY "Allow all operations on users_PCRM" 
  ON public.users_PCRM 
  FOR ALL 
  USING (true);

CREATE POLICY "Allow all operations on notes_PCRM" 
  ON public.notes_PCRM 
  FOR ALL 
  USING (true);
