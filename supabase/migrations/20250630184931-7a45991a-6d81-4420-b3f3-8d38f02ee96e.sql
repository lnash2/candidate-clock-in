
-- Create tables only if they don't exist

-- Create organizations table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'organizations') THEN
        CREATE TABLE public.organizations (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Create user role enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('root_admin', 'admin', 'user');
    END IF;
END $$;

-- Create profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        CREATE TABLE public.profiles (
            id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
            organization_id UUID REFERENCES public.organizations(id),
            email TEXT NOT NULL,
            full_name TEXT,
            role public.user_role NOT NULL DEFAULT 'user',
            has_completed_onboarding BOOLEAN DEFAULT false,
            last_active_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Create customers table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'customers') THEN
        CREATE TABLE public.customers (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            organization_id UUID REFERENCES public.organizations(id),
            company TEXT,
            contact_name TEXT,
            first_name TEXT,
            last_name TEXT,
            email TEXT,
            phone TEXT,
            contact_phone TEXT,
            contact_mobile TEXT,
            contact_email TEXT,
            contact_fax TEXT,
            address_line_1 TEXT,
            address_line_2 TEXT,
            address_type TEXT,
            county TEXT,
            post_code TEXT,
            country TEXT,
            reference TEXT,
            vat_number TEXT,
            credit_limit NUMERIC,
            payment_terms TEXT,
            ledger_account TEXT,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Create work locations table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'work_locations') THEN
        CREATE TABLE public.work_locations (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            customer_id UUID NOT NULL REFERENCES public.customers(id),
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
    END IF;
END $$;

-- Create candidates table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'candidates') THEN
        CREATE TABLE public.candidates (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            organization_id UUID REFERENCES public.organizations(id),
            candidate_name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            address TEXT,
            postcode TEXT,
            job_title TEXT,
            job_categories TEXT[],
            industries TEXT[],
            department_tags TEXT[],
            preferred_shift TEXT,
            national_insurance_no TEXT,
            recruiter TEXT,
            resourcer TEXT,
            created_by TEXT,
            payroll_type TEXT DEFAULT 'PAYE',
            active_status TEXT DEFAULT 'Active',
            onboarding_status TEXT DEFAULT 'Pending',
            registration_status TEXT DEFAULT 'Pre-Registered',
            registration_type TEXT,
            portal_access_enabled BOOLEAN DEFAULT false,
            portal_access_token TEXT,
            last_portal_login TIMESTAMP WITH TIME ZONE,
            date_added TIMESTAMP WITH TIME ZONE DEFAULT now(),
            registered_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Create vehicles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vehicles') THEN
        CREATE TABLE public.vehicles (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            truck_registration TEXT NOT NULL,
            model TEXT,
            year INTEGER,
            weight TEXT,
            truck_length_m TEXT,
            horse_capacity INTEGER,
            can_go_overseas BOOLEAN DEFAULT false,
            status TEXT DEFAULT 'active',
            notes TEXT
        );
    END IF;
END $$;

-- Create bookings table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bookings') THEN
        CREATE TABLE public.bookings (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            organization_id UUID REFERENCES public.organizations(id),
            customer_id UUID NOT NULL REFERENCES public.customers(id),
            candidate_id UUID REFERENCES public.candidates(id),
            vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            pickup_location TEXT,
            dropoff_location TEXT,
            pickup_coordinates JSONB,
            dropoff_coordinates JSONB,
            route_distance NUMERIC,
            estimated_duration INTEGER,
            driver_class TEXT,
            booking_type TEXT DEFAULT 'open',
            status TEXT DEFAULT 'pending',
            is_night_shift BOOLEAN DEFAULT false,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Create company rates table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'company_rates') THEN
        CREATE TABLE public.company_rates (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            customer_id UUID NOT NULL REFERENCES public.customers(id),
            driver_class TEXT NOT NULL,
            rate_category TEXT NOT NULL DEFAULT 'days',
            pay_rate NUMERIC NOT NULL,
            charge_rate NUMERIC NOT NULL,
            valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
            valid_to DATE,
            is_active BOOLEAN NOT NULL DEFAULT true,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Create day type rates table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'day_type_rates') THEN
        CREATE TABLE public.day_type_rates (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            day_type TEXT NOT NULL,
            pay_rate NUMERIC NOT NULL,
            charge_rate NUMERIC NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Create note types table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'note_types') THEN
        CREATE TABLE public.note_types (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            organization_id UUID REFERENCES public.organizations(id),
            name TEXT NOT NULL,
            color TEXT DEFAULT '#3B82F6',
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Create notes table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notes') THEN
        CREATE TABLE public.notes (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            organization_id UUID REFERENCES public.organizations(id),
            entity_id UUID NOT NULL,
            entity_type TEXT NOT NULL,
            content TEXT NOT NULL,
            note_type_id UUID REFERENCES public.note_types(id),
            created_by UUID,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Create candidate notes table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'candidate_notes') THEN
        CREATE TABLE public.candidate_notes (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            organization_id UUID REFERENCES public.organizations(id),
            candidate_id UUID REFERENCES public.candidates(id),
            content TEXT NOT NULL,
            note_type_id UUID REFERENCES public.note_types(id),
            created_by UUID,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Create candidate communications table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'candidate_communications') THEN
        CREATE TABLE public.candidate_communications (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            organization_id UUID REFERENCES public.organizations(id),
            candidate_id UUID REFERENCES public.candidates(id),
            communication_type TEXT NOT NULL,
            subject TEXT,
            content TEXT NOT NULL,
            sent_by UUID,
            sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Create candidate documents table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'candidate_documents') THEN
        CREATE TABLE public.candidate_documents (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            organization_id UUID REFERENCES public.organizations(id),
            candidate_id UUID REFERENCES public.candidates(id),
            document_name TEXT NOT NULL,
            document_type TEXT NOT NULL,
            file_path TEXT,
            file_size INTEGER,
            mime_type TEXT,
            upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
            expiry_date DATE,
            status TEXT DEFAULT 'pending',
            uploaded_by UUID,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Create email templates table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'email_templates') THEN
        CREATE TABLE public.email_templates (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            organization_id UUID REFERENCES public.organizations(id),
            name TEXT NOT NULL,
            subject TEXT NOT NULL,
            body_html TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Create email logs table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'email_logs') THEN
        CREATE TABLE public.email_logs (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            organization_id UUID REFERENCES public.organizations(id),
            sender_id UUID,
            recipient TEXT NOT NULL,
            subject TEXT NOT NULL,
            body_html TEXT NOT NULL,
            status TEXT NOT NULL,
            error TEXT,
            sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Create drivers table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'drivers') THEN
        CREATE TABLE public.drivers (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            organization_id UUID REFERENCES public.organizations(id),
            first_name TEXT,
            last_name TEXT,
            email TEXT,
            phone TEXT,
            mobile_no TEXT,
            address_line_1 TEXT,
            address_line_2 TEXT,
            dob DATE,
            nationality TEXT,
            license_number TEXT,
            driving_licence_expiry DATE,
            ni_number TEXT,
            employment_type TEXT,
            status TEXT DEFAULT 'active',
            next_of_kin_name TEXT,
            next_of_kin_relationship TEXT,
            next_of_kin_primary_contact TEXT,
            next_of_kin_secondary_contact TEXT,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.ensure_single_primary_location()
RETURNS TRIGGER AS $$
BEGIN
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

-- Create trigger if table exists and trigger doesn't exist
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'work_locations') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'ensure_single_primary_location_trigger') THEN
            CREATE TRIGGER ensure_single_primary_location_trigger
              BEFORE INSERT OR UPDATE ON public.work_locations
              FOR EACH ROW EXECUTE FUNCTION public.ensure_single_primary_location();
        END IF;
    END IF;
END $$;

-- Create admin functions
CREATE OR REPLACE FUNCTION public.is_root_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  SET search_path TO public, pg_catalog;
  
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'root_admin'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_login_as(target_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_is_admin BOOLEAN;
BEGIN
  SET search_path TO public, pg_catalog;
  
  SELECT public.is_root_admin() INTO caller_is_admin;
  
  IF NOT caller_is_admin THEN
    RAISE EXCEPTION 'Only root administrators can impersonate users';
  END IF;

  INSERT INTO auth.audit_log_entries (instance_id, ip_address, payload, created_at)
  VALUES (
    (SELECT instance_id FROM auth.instances LIMIT 1),
    '127.0.0.1',
    jsonb_build_object(
      'action', 'admin_impersonation',
      'admin_id', auth.uid(),
      'target_user_id', target_user_id
    ),
    now()
  );
  
  RETURN 'Success';
END;
$$;
