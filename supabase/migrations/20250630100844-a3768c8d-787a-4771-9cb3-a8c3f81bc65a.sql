
-- Create table for company-specific rates
CREATE TABLE public.company_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  driver_class TEXT NOT NULL,
  charge_rate NUMERIC(10,2) NOT NULL,
  pay_rate NUMERIC(10,2) NOT NULL,
  description TEXT,
  valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_to DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_company_driver_class_active UNIQUE (customer_id, driver_class, is_active)
);

-- Add foreign key constraint to customers table
ALTER TABLE public.company_rates 
ADD CONSTRAINT fk_company_rates_customer 
FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.company_rates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for company_rates
CREATE POLICY "Users can view company rates" 
  ON public.company_rates 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create company rates" 
  ON public.company_rates 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update company rates" 
  ON public.company_rates 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete company rates" 
  ON public.company_rates 
  FOR DELETE 
  USING (true);

-- Create index for better performance
CREATE INDEX idx_company_rates_customer_id ON public.company_rates(customer_id);
CREATE INDEX idx_company_rates_active ON public.company_rates(is_active);

-- Insert some sample data
INSERT INTO public.company_rates (customer_id, driver_class, charge_rate, pay_rate, description) 
SELECT 
  c.id,
  'Class 1',
  24.00,
  20.00,
  'Standard Class 1 driver rate'
FROM public.customers c 
WHERE c.company = 'Cheltenham Racecourse'
LIMIT 1;
