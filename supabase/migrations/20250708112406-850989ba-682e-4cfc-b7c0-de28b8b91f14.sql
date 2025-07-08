-- Create helpful views and validation functions

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

-- Create a view for candidates with their related data
CREATE OR REPLACE VIEW public.candidates_with_details AS
SELECT 
    c.*,
    addr.formatted_address as candidate_address,
    addr.city as candidate_city,
    addr.postal_code as candidate_postcode
FROM public.candidates c
LEFT JOIN public.addresses addr ON c.address_id = addr.id;

-- Create a view for companies with their related data
CREATE OR REPLACE VIEW public.companies_with_details AS
SELECT 
    co.*,
    addr.formatted_address as company_address,
    addr.city as company_city,
    addr.postal_code as company_postcode,
    COUNT(cont.id) as contact_count,
    COUNT(b.id) as booking_count
FROM public.companies co
LEFT JOIN public.addresses addr ON co.address_id = addr.id
LEFT JOIN public.contacts cont ON cont.company_id = co.id
LEFT JOIN public.bookings b ON b.company_id = co.id
GROUP BY co.id, addr.formatted_address, addr.city, addr.postal_code;