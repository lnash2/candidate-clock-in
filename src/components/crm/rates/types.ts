
export interface CompanyRate {
  id: string;
  driver_class: string;
  rate_category: string;
  charge_rate: number;
  pay_rate: number;
  description?: string;
  valid_from: string;
  valid_to?: string;
  is_active: boolean;
}

export interface CompanyRatesProps {
  companyId: number;
}

export interface RateFormData {
  driver_class: string;
  rate_category: string;
  charge_rate: string;
  pay_rate: string;
  description: string;
  valid_from: string;
  valid_to: string;
}
