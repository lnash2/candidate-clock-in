
-- Create candidates table
CREATE TABLE public.candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id),
  candidate_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  postcode TEXT,
  national_insurance_no TEXT,
  preferred_shift TEXT,
  job_title TEXT,
  registration_status TEXT DEFAULT 'Pre-Registered',
  registration_type TEXT,
  onboarding_status TEXT DEFAULT 'Pending',
  active_status TEXT DEFAULT 'Active',
  department_tags TEXT[],
  industries TEXT[],
  job_categories TEXT[],
  recruiter TEXT,
  resourcer TEXT,
  created_by TEXT,
  registered_at TIMESTAMP WITH TIME ZONE,
  date_added TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payroll_type TEXT DEFAULT 'PAYE',
  portal_access_enabled BOOLEAN DEFAULT false,
  portal_access_token TEXT,
  last_portal_login TIMESTAMP WITH TIME ZONE
);

-- Create candidate_communications table
CREATE TABLE public.candidate_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id),
  communication_type TEXT NOT NULL, -- email, phone, meeting, note
  subject TEXT,
  content TEXT NOT NULL,
  sent_by UUID,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create candidate_documents table
CREATE TABLE public.candidate_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id),
  document_type TEXT NOT NULL, -- compliance, contract, cv, certificate
  document_name TEXT NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  mime_type TEXT,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expiry_date DATE,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, expired
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create candidate_notes table (extending the existing notes table structure)
CREATE TABLE public.candidate_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id),
  note_type_id UUID REFERENCES public.note_types(id),
  content TEXT NOT NULL,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all candidate tables
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for candidates table
CREATE POLICY "Users can view candidates in their organization" 
  ON public.candidates 
  FOR SELECT 
  USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create candidates in their organization" 
  ON public.candidates 
  FOR INSERT 
  WITH CHECK (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update candidates in their organization" 
  ON public.candidates 
  FOR UPDATE 
  USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Create RLS policies for candidate_communications
CREATE POLICY "Users can view communications for candidates in their organization" 
  ON public.candidate_communications 
  FOR SELECT 
  USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create communications for candidates in their organization" 
  ON public.candidate_communications 
  FOR INSERT 
  WITH CHECK (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Create RLS policies for candidate_documents
CREATE POLICY "Users can view documents for candidates in their organization" 
  ON public.candidate_documents 
  FOR SELECT 
  USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create documents for candidates in their organization" 
  ON public.candidate_documents 
  FOR INSERT 
  WITH CHECK (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Create RLS policies for candidate_notes
CREATE POLICY "Users can view notes for candidates in their organization" 
  ON public.candidate_notes 
  FOR SELECT 
  USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create notes for candidates in their organization" 
  ON public.candidate_notes 
  FOR INSERT 
  WITH CHECK (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_candidates_organization_id ON public.candidates(organization_id);
CREATE INDEX idx_candidates_email ON public.candidates(email);
CREATE INDEX idx_candidate_communications_candidate_id ON public.candidate_communications(candidate_id);
CREATE INDEX idx_candidate_documents_candidate_id ON public.candidate_documents(candidate_id);
CREATE INDEX idx_candidate_notes_candidate_id ON public.candidate_notes(candidate_id);
