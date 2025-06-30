
export interface Candidate {
  id: string;
  organization_id?: string;
  candidate_name: string;
  email?: string;
  phone?: string;
  address?: string;
  postcode?: string;
  national_insurance_no?: string;
  preferred_shift?: string;
  job_title?: string;
  registration_status: string;
  registration_type?: string;
  onboarding_status: string;
  active_status: string;
  department_tags?: string[];
  industries?: string[];
  job_categories?: string[];
  recruiter?: string;
  resourcer?: string;
  created_by?: string;
  registered_at?: string;
  date_added?: string;
  created_at: string;
  updated_at: string;
  payroll_type: string;
  portal_access_enabled: boolean;
  portal_access_token?: string;
  last_portal_login?: string;
}

export interface CandidateCommunication {
  id: string;
  candidate_id: string;
  organization_id?: string;
  communication_type: string;
  subject?: string;
  content: string;
  sent_by?: string;
  sent_at?: string;
  created_at: string;
}

export interface CandidateDocument {
  id: string;
  candidate_id: string;
  organization_id?: string;
  document_type: string;
  document_name: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  upload_date?: string;
  expiry_date?: string;
  status: string;
  uploaded_by?: string;
  created_at: string;
}

export interface CandidateNote {
  id: string;
  candidate_id: string;
  organization_id?: string;
  note_type_id?: string;
  content: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CandidateFormData {
  candidate_name: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  national_insurance_no: string;
  preferred_shift: string;
  job_title: string;
  registration_status: string;
  registration_type: string;
  onboarding_status: string;
  active_status: string;
  department_tags: string[];
  industries: string[];
  job_categories: string[];
  recruiter: string;
  resourcer: string;
  payroll_type: string;
  portal_access_enabled: boolean;
}
