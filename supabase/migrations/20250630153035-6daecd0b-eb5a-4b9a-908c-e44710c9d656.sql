
-- Create work_locations table to store multiple locations per company
CREATE TABLE public.work_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  location_name TEXT NOT NULL,
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  county TEXT,
  post_code TEXT,
  country TEXT DEFAULT 'United Kingdom',
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_mobile TEXT,
  contact_email TEXT,
  contact_position TEXT,
  notes TEXT,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_work_locations_customer_id ON public.work_locations(customer_id);
CREATE INDEX idx_work_locations_active ON public.work_locations(is_active);

-- Enable RLS for work_locations
ALTER TABLE public.work_locations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your authentication requirements)
CREATE POLICY "Users can view work locations" 
  ON public.work_locations 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert work locations" 
  ON public.work_locations 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update work locations" 
  ON public.work_locations 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete work locations" 
  ON public.work_locations 
  FOR DELETE 
  USING (true);

-- Function to ensure only one primary location per customer
CREATE OR REPLACE FUNCTION public.ensure_single_primary_location()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting a location as primary, unset all other primary locations for this customer
  IF NEW.is_primary = true THEN
    UPDATE public.work_locations 
    SET is_primary = false 
    WHERE customer_id = NEW.customer_id 
      AND id != NEW.id 
      AND is_primary = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to maintain single primary location
CREATE TRIGGER trigger_ensure_single_primary_location
  BEFORE INSERT OR UPDATE ON public.work_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_primary_location();
