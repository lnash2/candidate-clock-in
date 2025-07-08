-- Now add the foreign key constraints after data cleanup

-- Add indexes for better performance on foreign key columns
CREATE INDEX IF NOT EXISTS idx_bookings_candidate_id ON public.bookings(candidate_id);
CREATE INDEX IF NOT EXISTS idx_bookings_company_id ON public.bookings(company_id);
CREATE INDEX IF NOT EXISTS idx_bookings_contact_id ON public.bookings(contact_id);
CREATE INDEX IF NOT EXISTS idx_bookings_address_id ON public.bookings(address_id);
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON public.contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_address_id ON public.contacts(address_id);
CREATE INDEX IF NOT EXISTS idx_candidates_address_id ON public.candidates(address_id);
CREATE INDEX IF NOT EXISTS idx_companies_address_id ON public.companies(address_id);

-- Add foreign key constraints to bookings table
-- Bookings -> Candidates (nullable, as some bookings might be open/unassigned)
ALTER TABLE public.bookings 
ADD CONSTRAINT fk_bookings_candidate 
FOREIGN KEY (candidate_id) 
REFERENCES public.candidates(id) 
ON DELETE SET NULL;

-- Bookings -> Companies (required relationship)
ALTER TABLE public.bookings 
ADD CONSTRAINT fk_bookings_company 
FOREIGN KEY (company_id) 
REFERENCES public.companies(id) 
ON DELETE RESTRICT;

-- Bookings -> Contacts (nullable)
ALTER TABLE public.bookings 
ADD CONSTRAINT fk_bookings_contact 
FOREIGN KEY (contact_id) 
REFERENCES public.contacts(id) 
ON DELETE SET NULL;

-- Bookings -> Addresses (nullable)
ALTER TABLE public.bookings 
ADD CONSTRAINT fk_bookings_address 
FOREIGN KEY (address_id) 
REFERENCES public.addresses(id) 
ON DELETE SET NULL;

-- Add foreign key constraints to contacts table
-- Contacts -> Companies (nullable, but usually set)
ALTER TABLE public.contacts 
ADD CONSTRAINT fk_contacts_company 
FOREIGN KEY (company_id) 
REFERENCES public.companies(id) 
ON DELETE SET NULL;

-- Contacts -> Addresses (nullable)
ALTER TABLE public.contacts 
ADD CONSTRAINT fk_contacts_address 
FOREIGN KEY (address_id) 
REFERENCES public.addresses(id) 
ON DELETE SET NULL;

-- Add foreign key constraints to candidates table
-- Candidates -> Addresses (nullable)
ALTER TABLE public.candidates 
ADD CONSTRAINT fk_candidates_address 
FOREIGN KEY (address_id) 
REFERENCES public.addresses(id) 
ON DELETE SET NULL;

-- Add foreign key constraints to companies table
-- Companies -> Addresses (nullable)
ALTER TABLE public.companies 
ADD CONSTRAINT fk_companies_address 
FOREIGN KEY (address_id) 
REFERENCES public.addresses(id) 
ON DELETE SET NULL;