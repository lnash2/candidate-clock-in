export interface Vacancy {
  id: number;
  title: string;
  description?: string;
  company_id: number;
  assigned_contact_id?: number;
  address_id?: number;
  vacancy_status_id: number;
  company_rate_id: number;
  recruiter_id?: number;
  resourcer_id?: number;
  industry_ids?: number[];
  job_category_ids?: number[];
  organization_id?: number;
  created_by_user_id: number;
  job_posted_at?: number;
  created_at: number;
  updated_at?: number;
  
  // Joined fields
  company_name?: string;
  contact_name?: string;
  status_name?: string;
  status_color?: string;
  address?: string;
  city?: string;
  postcode?: string;
  recruiter_name?: string;
  resourcer_name?: string;
  industry_names?: string[];
  job_category_names?: string[];
}

export interface VacancyStatus {
  id: number;
  name: string;
  color: string;
  is_available: boolean;
  is_default: boolean;
  organization_id?: number;
}

export interface Industry {
  id: number;
  name: string;
}

export interface JobCategory {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email?: string;
}