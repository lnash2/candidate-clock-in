-- Add proper foreign key constraints to improve data integrity
-- and establish clear relationships between tables

-- First, let's add indexes for better performance on foreign key columns
CREATE INDEX IF NOT EXISTS idx_bookings_candidate_id ON public.bookings(candidate_id);
CREATE INDEX IF NOT EXISTS idx_bookings_company_id ON public.bookings(company_id);
CREATE INDEX IF NOT EXISTS idx_bookings_contact_id ON public.bookings(contact_id);
CREATE INDEX IF NOT EXISTS idx_bookings_address_id ON public.bookings(address_id);
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON public.contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_address_id ON public.contacts(address_id);
CREATE INDEX IF NOT EXISTS idx_candidates_address_id ON public.candidates(address_id);
CREATE INDEX IF NOT EXISTS idx_companies_address_id ON public.companies(address_id);

-- Add foreign key constraints to bookings table
-- Note: We'll make these constraints with CASCADE DELETE where appropriate

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

-- Create a view for complete booking information with all related data
CREATE OR REPLACE VIEW public.bookings_with_details AS
SELECT 
    b.*,
    c.name as candidate_name,
    c.email as candidate_email,
    c.phone_number as candidate_phone,
    co.name as company_name,
    co.phone_number as company_phone,
    co.website as company_website,
    cont.name as contact_name,
    cont.work_email as contact_email,
    cont.work_phone as contact_phone,
    addr.formatted_address as booking_address,
    addr.city as booking_city,
    addr.postal_code as booking_postcode
FROM public.bookings b
LEFT JOIN public.candidates c ON b.candidate_id = c.id
LEFT JOIN public.companies co ON b.company_id = co.id
LEFT JOIN public.contacts cont ON b.contact_id = cont.id
LEFT JOIN public.addresses addr ON b.address_id = addr.id;

-- Create a function to validate booking data integrity
CREATE OR REPLACE FUNCTION public.validate_booking_data()
RETURNS TABLE (
    booking_id integer,
    issue_type text,
    issue_description text
) AS $$
BEGIN
    -- Check for bookings with invalid candidate references
    RETURN QUERY
    SELECT b.id, 'invalid_candidate'::text, 'Candidate ID does not exist'::text
    FROM public.bookings b
    WHERE b.candidate_id IS NOT NULL 
    AND NOT EXISTS (SELECT 1 FROM public.candidates WHERE id = b.candidate_id);
    
    -- Check for bookings with invalid company references
    RETURN QUERY
    SELECT b.id, 'invalid_company'::text, 'Company ID does not exist'::text
    FROM public.bookings b
    WHERE NOT EXISTS (SELECT 1 FROM public.companies WHERE id = b.company_id);
    
    -- Check for bookings with invalid contact references
    RETURN QUERY
    SELECT b.id, 'invalid_contact'::text, 'Contact ID does not exist'::text
    FROM public.bookings b
    WHERE b.contact_id IS NOT NULL 
    AND NOT EXISTS (SELECT 1 FROM public.contacts WHERE id = b.contact_id);
    
    -- Check for bookings with invalid address references
    RETURN QUERY
    SELECT b.id, 'invalid_address'::text, 'Address ID does not exist'::text
    FROM public.bookings b
    WHERE b.address_id IS NOT NULL 
    AND NOT EXISTS (SELECT 1 FROM public.addresses WHERE id = b.address_id);
END;
$$ LANGUAGE plpgsql;