
-- First, let's add the rate_category column to the existing company_rates table
ALTER TABLE public.company_rates 
ADD COLUMN rate_category TEXT NOT NULL DEFAULT 'days';

-- Update the unique constraint to include rate_category
ALTER TABLE public.company_rates 
DROP CONSTRAINT unique_company_driver_class_active;

ALTER TABLE public.company_rates 
ADD CONSTRAINT unique_company_driver_class_category_active 
UNIQUE (customer_id, driver_class, rate_category, is_active);

-- Insert additional rate categories for existing records
INSERT INTO public.company_rates (customer_id, driver_class, rate_category, charge_rate, pay_rate, description, is_active)
SELECT 
  customer_id,
  driver_class,
  'nights' as rate_category,
  charge_rate * 1.15, -- 15% premium for night rates
  pay_rate * 1.15,
  CONCAT(description, ' - Night rate'),
  is_active
FROM public.company_rates 
WHERE rate_category = 'days';

INSERT INTO public.company_rates (customer_id, driver_class, rate_category, charge_rate, pay_rate, description, is_active)
SELECT 
  customer_id,
  driver_class,
  'saturday' as rate_category,
  charge_rate * 1.10, -- 10% premium for Saturday
  pay_rate * 1.10,
  CONCAT(description, ' - Saturday rate'),
  is_active
FROM public.company_rates 
WHERE rate_category = 'days';

INSERT INTO public.company_rates (customer_id, driver_class, rate_category, charge_rate, pay_rate, description, is_active)
SELECT 
  customer_id,
  driver_class,
  'sunday' as rate_category,
  charge_rate * 1.20, -- 20% premium for Sunday
  pay_rate * 1.20,
  CONCAT(description, ' - Sunday rate'),
  is_active
FROM public.company_rates 
WHERE rate_category = 'days';

-- Add index for rate_category
CREATE INDEX idx_company_rates_category ON public.company_rates(rate_category);

-- Add is_night_shift column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN is_night_shift BOOLEAN DEFAULT false;
