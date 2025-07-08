-- Clean up data integrity issues before adding foreign key constraints

-- Step 1: Fix invalid candidate references in bookings
-- Set candidate_id to NULL where candidate doesn't exist
UPDATE public.bookings 
SET candidate_id = NULL 
WHERE candidate_id IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM public.candidates WHERE id = bookings.candidate_id);

-- Step 2: Fix invalid company references in bookings  
-- This should be rare, but let's check and clean up
-- First, let's see if there are any invalid company references
-- We'll set a default company_id of 1 if it exists, or the lowest valid company_id
UPDATE public.bookings 
SET company_id = (SELECT MIN(id) FROM public.companies LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.companies WHERE id = bookings.company_id);

-- Step 3: Fix invalid contact references in bookings
UPDATE public.bookings 
SET contact_id = NULL 
WHERE contact_id IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM public.contacts WHERE id = bookings.contact_id);

-- Step 4: Fix invalid address references in bookings
UPDATE public.bookings 
SET address_id = NULL 
WHERE address_id IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM public.addresses WHERE id = bookings.address_id);

-- Step 5: Fix invalid company references in contacts
UPDATE public.contacts 
SET company_id = NULL 
WHERE company_id IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM public.companies WHERE id = contacts.company_id);

-- Step 6: Fix invalid address references in contacts
UPDATE public.contacts 
SET address_id = NULL 
WHERE address_id IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM public.addresses WHERE id = contacts.address_id);

-- Step 7: Fix invalid address references in candidates
UPDATE public.candidates 
SET address_id = NULL 
WHERE address_id IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM public.addresses WHERE id = candidates.address_id);

-- Step 8: Fix invalid address references in companies
UPDATE public.companies 
SET address_id = NULL 
WHERE address_id IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM public.addresses WHERE id = companies.address_id);