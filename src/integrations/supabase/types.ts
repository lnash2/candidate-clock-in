export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address1: string | null
          address2: string | null
          candidate_id: number | null
          city: string | null
          company_id: number | null
          country: string | null
          country_code: string | null
          county: string | null
          created_at: number
          district: string | null
          formatted_address: string | null
          id: number
          import_id: number | null
          lat: number | null
          lng: number | null
          name: string | null
          natural_feature: string | null
          neighborhood: string | null
          number: string | null
          phone_number: string | null
          postal_code: string | null
          premise: string | null
          state: string | null
          state_code: string | null
          street: string | null
          town: string | null
          updated_at: number | null
        }
        Insert: {
          address1?: string | null
          address2?: string | null
          candidate_id?: number | null
          city?: string | null
          company_id?: number | null
          country?: string | null
          country_code?: string | null
          county?: string | null
          created_at?: number
          district?: string | null
          formatted_address?: string | null
          id?: number
          import_id?: number | null
          lat?: number | null
          lng?: number | null
          name?: string | null
          natural_feature?: string | null
          neighborhood?: string | null
          number?: string | null
          phone_number?: string | null
          postal_code?: string | null
          premise?: string | null
          state?: string | null
          state_code?: string | null
          street?: string | null
          town?: string | null
          updated_at?: number | null
        }
        Update: {
          address1?: string | null
          address2?: string | null
          candidate_id?: number | null
          city?: string | null
          company_id?: number | null
          country?: string | null
          country_code?: string | null
          county?: string | null
          created_at?: number
          district?: string | null
          formatted_address?: string | null
          id?: number
          import_id?: number | null
          lat?: number | null
          lng?: number | null
          name?: string | null
          natural_feature?: string | null
          neighborhood?: string | null
          number?: string | null
          phone_number?: string | null
          postal_code?: string | null
          premise?: string | null
          state?: string | null
          state_code?: string | null
          street?: string | null
          town?: string | null
          updated_at?: number | null
        }
        Relationships: []
      }
      booking_groups: {
        Row: {
          address_id: number | null
          agency_margin_amended_pay_rate: string | null
          agency_margin_standard: string | null
          amended_margin: string | null
          amended_margin_total: string | null
          amended_pay_rate: number
          booking_shifted_date: number | null
          booking_status: string | null
          booking_type: string | null
          candidate_id: number | null
          charge_rate: number
          company_id: number
          company_rate_id: number
          company_rate_submitted: Json
          contact_id: number | null
          cost_rates_submitted: Json
          created_at: number
          created_by_user_id: number
          day_type: string
          employers_ni: string | null
          expenses: number | null
          from_date: number
          holiday_accrued: boolean
          hourly_holiday_pay: string | null
          hourly_rate_with_holiday_included: string | null
          hourly_rate_without_holiday_pay: string | null
          id: number
          is_night: boolean
          job_category_ids: number[] | null
          margin: string | null
          margin_total: string | null
          margin_with_costs_amended_pay_rate: string | null
          margin_with_costs_standard: string | null
          missed_booking_reason: string | null
          note: string | null
          old_booking_id: number | null
          organization_id: number | null
          pay_rate: number
          pay_rate2: number
          payroll_type_id: number | null
          pension_contribution: string | null
          to_date: number
          total_employment_costs: string | null
          updated_at: number | null
          vacancy_id: number | null
        }
        Insert: {
          address_id?: number | null
          agency_margin_amended_pay_rate?: string | null
          agency_margin_standard?: string | null
          amended_margin?: string | null
          amended_margin_total?: string | null
          amended_pay_rate?: number
          booking_shifted_date?: number | null
          booking_status?: string | null
          booking_type?: string | null
          candidate_id?: number | null
          charge_rate?: number
          company_id: number
          company_rate_id: number
          company_rate_submitted: Json
          contact_id?: number | null
          cost_rates_submitted: Json
          created_at?: number
          created_by_user_id: number
          day_type?: string
          employers_ni?: string | null
          expenses?: number | null
          from_date: number
          holiday_accrued?: boolean
          hourly_holiday_pay?: string | null
          hourly_rate_with_holiday_included?: string | null
          hourly_rate_without_holiday_pay?: string | null
          id?: number
          is_night?: boolean
          job_category_ids?: number[] | null
          margin?: string | null
          margin_total?: string | null
          margin_with_costs_amended_pay_rate?: string | null
          margin_with_costs_standard?: string | null
          missed_booking_reason?: string | null
          note?: string | null
          old_booking_id?: number | null
          organization_id?: number | null
          pay_rate?: number
          pay_rate2?: number
          payroll_type_id?: number | null
          pension_contribution?: string | null
          to_date: number
          total_employment_costs?: string | null
          updated_at?: number | null
          vacancy_id?: number | null
        }
        Update: {
          address_id?: number | null
          agency_margin_amended_pay_rate?: string | null
          agency_margin_standard?: string | null
          amended_margin?: string | null
          amended_margin_total?: string | null
          amended_pay_rate?: number
          booking_shifted_date?: number | null
          booking_status?: string | null
          booking_type?: string | null
          candidate_id?: number | null
          charge_rate?: number
          company_id?: number
          company_rate_id?: number
          company_rate_submitted?: Json
          contact_id?: number | null
          cost_rates_submitted?: Json
          created_at?: number
          created_by_user_id?: number
          day_type?: string
          employers_ni?: string | null
          expenses?: number | null
          from_date?: number
          holiday_accrued?: boolean
          hourly_holiday_pay?: string | null
          hourly_rate_with_holiday_included?: string | null
          hourly_rate_without_holiday_pay?: string | null
          id?: number
          is_night?: boolean
          job_category_ids?: number[] | null
          margin?: string | null
          margin_total?: string | null
          margin_with_costs_amended_pay_rate?: string | null
          margin_with_costs_standard?: string | null
          missed_booking_reason?: string | null
          note?: string | null
          old_booking_id?: number | null
          organization_id?: number | null
          pay_rate?: number
          pay_rate2?: number
          payroll_type_id?: number | null
          pension_contribution?: string | null
          to_date?: number
          total_employment_costs?: string | null
          updated_at?: number | null
          vacancy_id?: number | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          address_id: number | null
          agency_margin_amended_pay_rate: string | null
          agency_margin_standard: string | null
          amended_margin: string | null
          amended_margin_total: string | null
          amended_pay_rate: number
          booking_backfilled_at: number | null
          booking_cancelled_at: number | null
          booking_foc_at: number | null
          booking_group_id: number | null
          booking_missed_at: number | null
          booking_shifted_date: number | null
          booking_status: string | null
          booking_type: string | null
          candidate_id: number | null
          charge_rate: number
          company_id: number
          company_rate_id: number
          company_rate_submitted: Json
          contact_id: number | null
          cost_rates_submitted: Json
          created_at: number
          created_by_user_id: number
          date: number | null
          day_type: string
          employers_ni: string | null
          expenses: number | null
          from_date: number
          holiday_accrued: boolean
          hourly_holiday_pay: string | null
          hourly_rate_with_holiday_included: string | null
          hourly_rate_without_holiday_pay: string | null
          id: number
          is_night: boolean
          job_category_ids: number[] | null
          margin: string | null
          margin_total: string | null
          margin_with_costs_amended_pay_rate: string | null
          margin_with_costs_standard: string | null
          missed_booking_reason: string | null
          note: string | null
          old_booking_id: number | null
          organization_id: number | null
          pay_rate: number
          pay_rate2: number
          payroll_type_id: number | null
          pension_contribution: string | null
          to_date: number
          total_employment_costs: string | null
          updated_at: number | null
          vacancy_id: number | null
        }
        Insert: {
          address_id?: number | null
          agency_margin_amended_pay_rate?: string | null
          agency_margin_standard?: string | null
          amended_margin?: string | null
          amended_margin_total?: string | null
          amended_pay_rate?: number
          booking_backfilled_at?: number | null
          booking_cancelled_at?: number | null
          booking_foc_at?: number | null
          booking_group_id?: number | null
          booking_missed_at?: number | null
          booking_shifted_date?: number | null
          booking_status?: string | null
          booking_type?: string | null
          candidate_id?: number | null
          charge_rate?: number
          company_id: number
          company_rate_id: number
          company_rate_submitted: Json
          contact_id?: number | null
          cost_rates_submitted: Json
          created_at?: number
          created_by_user_id: number
          date?: number | null
          day_type?: string
          employers_ni?: string | null
          expenses?: number | null
          from_date: number
          holiday_accrued?: boolean
          hourly_holiday_pay?: string | null
          hourly_rate_with_holiday_included?: string | null
          hourly_rate_without_holiday_pay?: string | null
          id?: number
          is_night?: boolean
          job_category_ids?: number[] | null
          margin?: string | null
          margin_total?: string | null
          margin_with_costs_amended_pay_rate?: string | null
          margin_with_costs_standard?: string | null
          missed_booking_reason?: string | null
          note?: string | null
          old_booking_id?: number | null
          organization_id?: number | null
          pay_rate?: number
          pay_rate2?: number
          payroll_type_id?: number | null
          pension_contribution?: string | null
          to_date: number
          total_employment_costs?: string | null
          updated_at?: number | null
          vacancy_id?: number | null
        }
        Update: {
          address_id?: number | null
          agency_margin_amended_pay_rate?: string | null
          agency_margin_standard?: string | null
          amended_margin?: string | null
          amended_margin_total?: string | null
          amended_pay_rate?: number
          booking_backfilled_at?: number | null
          booking_cancelled_at?: number | null
          booking_foc_at?: number | null
          booking_group_id?: number | null
          booking_missed_at?: number | null
          booking_shifted_date?: number | null
          booking_status?: string | null
          booking_type?: string | null
          candidate_id?: number | null
          charge_rate?: number
          company_id?: number
          company_rate_id?: number
          company_rate_submitted?: Json
          contact_id?: number | null
          cost_rates_submitted?: Json
          created_at?: number
          created_by_user_id?: number
          date?: number | null
          day_type?: string
          employers_ni?: string | null
          expenses?: number | null
          from_date?: number
          holiday_accrued?: boolean
          hourly_holiday_pay?: string | null
          hourly_rate_with_holiday_included?: string | null
          hourly_rate_without_holiday_pay?: string | null
          id?: number
          is_night?: boolean
          job_category_ids?: number[] | null
          margin?: string | null
          margin_total?: string | null
          margin_with_costs_amended_pay_rate?: string | null
          margin_with_costs_standard?: string | null
          missed_booking_reason?: string | null
          note?: string | null
          old_booking_id?: number | null
          organization_id?: number | null
          pay_rate?: number
          pay_rate2?: number
          payroll_type_id?: number | null
          pension_contribution?: string | null
          to_date?: number
          total_employment_costs?: string | null
          updated_at?: number | null
          vacancy_id?: number | null
        }
        Relationships: []
      }
      bookings_prod: {
        Row: {
          booking_type: string | null
          candidate_id: string | null
          created_at: string
          customer_id: string | null
          driver_class: string | null
          dropoff_location: string | null
          end_date: string
          estimated_duration: number | null
          id: string
          is_night_shift: boolean | null
          notes: string | null
          pickup_location: string | null
          route_distance: number | null
          start_date: string
          status: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          booking_type?: string | null
          candidate_id?: string | null
          created_at?: string
          customer_id?: string | null
          driver_class?: string | null
          dropoff_location?: string | null
          end_date: string
          estimated_duration?: number | null
          id?: string
          is_night_shift?: boolean | null
          notes?: string | null
          pickup_location?: string | null
          route_distance?: number | null
          start_date: string
          status?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          booking_type?: string | null
          candidate_id?: string | null
          created_at?: string
          customer_id?: string | null
          driver_class?: string | null
          dropoff_location?: string | null
          end_date?: string
          estimated_duration?: number | null
          id?: string
          is_night_shift?: boolean | null
          notes?: string | null
          pickup_location?: string | null
          route_distance?: number | null
          start_date?: string
          status?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates_prod"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_prod"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_prod"
            referencedColumns: ["id"]
          },
        ]
      }
      cache_addresses: {
        Row: {
          address1: string | null
          address2: string | null
          city: string | null
          country: string | null
          country_code: string | null
          county: string | null
          created_at: number
          district: string | null
          formatted_address: string | null
          id: number
          lat: number | null
          lng: number | null
          md5_hash: string
          natural_feature: string | null
          neighborhood: string | null
          number: string | null
          postal_code: string | null
          premise: string | null
          state: string | null
          state_code: string | null
          street: string | null
          town: string | null
          updated_at: number | null
        }
        Insert: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          county?: string | null
          created_at?: number
          district?: string | null
          formatted_address?: string | null
          id?: number
          lat?: number | null
          lng?: number | null
          md5_hash: string
          natural_feature?: string | null
          neighborhood?: string | null
          number?: string | null
          postal_code?: string | null
          premise?: string | null
          state?: string | null
          state_code?: string | null
          street?: string | null
          town?: string | null
          updated_at?: number | null
        }
        Update: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          county?: string | null
          created_at?: number
          district?: string | null
          formatted_address?: string | null
          id?: number
          lat?: number | null
          lng?: number | null
          md5_hash?: string
          natural_feature?: string | null
          neighborhood?: string | null
          number?: string | null
          postal_code?: string | null
          premise?: string | null
          state?: string | null
          state_code?: string | null
          street?: string | null
          town?: string | null
          updated_at?: number | null
        }
        Relationships: []
      }
      candidate_available_bookings: {
        Row: {
          call_status: string | null
          candidate_id: number
          created_at: number
          created_by_user_id: number
          date: number | null
          id: number
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          call_status?: string | null
          candidate_id: number
          created_at?: number
          created_by_user_id: number
          date?: number | null
          id?: number
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          call_status?: string | null
          candidate_id?: number
          created_at?: number
          created_by_user_id?: number
          date?: number | null
          id?: number
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      candidate_onboarding_document: {
        Row: {
          attachment: Json | null
          candidate_id: number
          created_at: number
          created_by_user_id: number
          expiry_date: number | null
          id: number
          onboarding_document_type_id: number
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          attachment?: Json | null
          candidate_id: number
          created_at?: number
          created_by_user_id: number
          expiry_date?: number | null
          id?: number
          onboarding_document_type_id: number
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          attachment?: Json | null
          candidate_id?: number
          created_at?: number
          created_by_user_id?: number
          expiry_date?: number | null
          id?: number
          onboarding_document_type_id?: number
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      candidate_settings: {
        Row: {
          created_at: number
          has_onboarding: boolean | null
          id: number
          industry_type_id: number | null
          old_id: number | null
          onboarding_steps: string[] | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          has_onboarding?: boolean | null
          id?: number
          industry_type_id?: number | null
          old_id?: number | null
          onboarding_steps?: string[] | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          has_onboarding?: boolean | null
          id?: number
          industry_type_id?: number | null
          old_id?: number | null
          onboarding_steps?: string[] | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      candidate_statuses: {
        Row: {
          color: string | null
          created_at: number
          id: number
          is_available: boolean
          is_default: boolean
          name: string
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          color?: string | null
          created_at?: number
          id?: number
          is_available?: boolean
          is_default?: boolean
          name: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          color?: string | null
          created_at?: number
          id?: number
          is_available?: boolean
          is_default?: boolean
          name?: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      candidate_time_sheets: {
        Row: {
          booking_id: number
          created_at: number
          created_by_user_id: number
          date: number
          from_date: number
          id: number
          organization_id: number | null
          to_date: number
          updated_at: number | null
        }
        Insert: {
          booking_id: number
          created_at?: number
          created_by_user_id: number
          date: number
          from_date: number
          id?: number
          organization_id?: number | null
          to_date: number
          updated_at?: number | null
        }
        Update: {
          booking_id?: number
          created_at?: number
          created_by_user_id?: number
          date?: number
          from_date?: number
          id?: number
          organization_id?: number | null
          to_date?: number
          updated_at?: number | null
        }
        Relationships: []
      }
      candidates: {
        Row: {
          active_status: string | null
          active_status_changed_at: number | null
          added_to_loader: boolean
          added_to_loader_at: number | null
          address_id: number | null
          attachments: Json | null
          booking_status: string | null
          candidate_settings: Json | null
          candidate_status_id: number | null
          company_name: string | null
          company_number: string | null
          cpc_back_attachment: Json | null
          cpc_expire_date: number | null
          cpc_front_attachment: Json | null
          created_at: number
          created_by_user_id: number
          current_salary: number | null
          date_of_rehabilitation: number | null
          department_tag_ids: number[] | null
          details_of_convictions: string | null
          digi_card_back_attachment: Json | null
          digi_card_expire_date: number | null
          digi_card_front_attachment: Json | null
          dob: number | null
          document_required_steps: string[] | null
          document_steps: string[] | null
          document_steps_changed_at: number | null
          driver_card_back_attachment: Json | null
          driver_card_front_attachment: Json | null
          driver_license: string | null
          driver_license_back_attachment: Json | null
          driver_license_check: boolean | null
          driver_license_expire_date: number | null
          driver_license_front_attachment: Json | null
          email: string | null
          expected_salary: number | null
          external_zoho_template_id: string | null
          forename: string | null
          ghl_contact_id: string | null
          ghl_location_id: string | null
          has_own_transport: boolean | null
          health_issue_state: string | null
          hear_about_us: string | null
          hiab_card_back_attachment: Json | null
          hiab_card_expire_date: number | null
          hiab_card_front_attachment: Json | null
          id: number
          import_id: number | null
          industry_ids: number[] | null
          industry_type_id: number | null
          is_completed_onboarding_steps: boolean | null
          job_category_ids: number[] | null
          job_title: string | null
          job_title_id: number | null
          manual_handling: string | null
          marketing_preferences: string[] | null
          name: string | null
          next_of_kin_name: string | null
          next_of_kin_phone_number: string | null
          next_of_kin_relationship: string | null
          ni_number: string | null
          notice_period_id: number | null
          onboarding_at: number | null
          onboarding_status: string | null
          onboarding_status_changed_at: number | null
          onboarding_steps: string[] | null
          organization_id: number | null
          passport_attachments: Json | null
          payroll_type_id: number | null
          phone_number: string | null
          preferred_shift_ids: number[] | null
          proof_of_address_attachments: Json | null
          proof_of_national_insurance_attachments: Json | null
          recruiter_id: number | null
          reference_contact_number_1: string | null
          reference_contact_number_2: string | null
          reference_date_held_from_1: number | null
          reference_date_held_from_2: number | null
          reference_date_held_to_1: number | null
          reference_date_held_to_2: number | null
          reference_email_1: string | null
          reference_email_2: string | null
          reference_job_title_1: string | null
          reference_job_title_2: string | null
          reference_name_1: string | null
          reference_name_2: string | null
          reference_notice_period_1: string | null
          reference_notice_period_2: string | null
          reference_organization_1: string | null
          reference_organization_2: string | null
          reference_position_held_1: string | null
          reference_position_held_2: string | null
          registered_at: number | null
          registration_attachment: Json | null
          resourcer_id: number | null
          rtw_attachments: Json | null
          sent_to_portal_at: number | null
          sign_contract_attachment: Json | null
          surname: string | null
          title: string | null
          type_of_work: string | null
          updated_at: number | null
          yoti_attachments: Json | null
          yoti_document_type: string | null
          yoti_session_id: string | null
          yoti_status: string | null
          zoho_request_id: string | null
          zoho_request_status: string | null
          zoho_setting_id: number | null
        }
        Insert: {
          active_status?: string | null
          active_status_changed_at?: number | null
          added_to_loader?: boolean
          added_to_loader_at?: number | null
          address_id?: number | null
          attachments?: Json | null
          booking_status?: string | null
          candidate_settings?: Json | null
          candidate_status_id?: number | null
          company_name?: string | null
          company_number?: string | null
          cpc_back_attachment?: Json | null
          cpc_expire_date?: number | null
          cpc_front_attachment?: Json | null
          created_at?: number
          created_by_user_id: number
          current_salary?: number | null
          date_of_rehabilitation?: number | null
          department_tag_ids?: number[] | null
          details_of_convictions?: string | null
          digi_card_back_attachment?: Json | null
          digi_card_expire_date?: number | null
          digi_card_front_attachment?: Json | null
          dob?: number | null
          document_required_steps?: string[] | null
          document_steps?: string[] | null
          document_steps_changed_at?: number | null
          driver_card_back_attachment?: Json | null
          driver_card_front_attachment?: Json | null
          driver_license?: string | null
          driver_license_back_attachment?: Json | null
          driver_license_check?: boolean | null
          driver_license_expire_date?: number | null
          driver_license_front_attachment?: Json | null
          email?: string | null
          expected_salary?: number | null
          external_zoho_template_id?: string | null
          forename?: string | null
          ghl_contact_id?: string | null
          ghl_location_id?: string | null
          has_own_transport?: boolean | null
          health_issue_state?: string | null
          hear_about_us?: string | null
          hiab_card_back_attachment?: Json | null
          hiab_card_expire_date?: number | null
          hiab_card_front_attachment?: Json | null
          id?: number
          import_id?: number | null
          industry_ids?: number[] | null
          industry_type_id?: number | null
          is_completed_onboarding_steps?: boolean | null
          job_category_ids?: number[] | null
          job_title?: string | null
          job_title_id?: number | null
          manual_handling?: string | null
          marketing_preferences?: string[] | null
          name?: string | null
          next_of_kin_name?: string | null
          next_of_kin_phone_number?: string | null
          next_of_kin_relationship?: string | null
          ni_number?: string | null
          notice_period_id?: number | null
          onboarding_at?: number | null
          onboarding_status?: string | null
          onboarding_status_changed_at?: number | null
          onboarding_steps?: string[] | null
          organization_id?: number | null
          passport_attachments?: Json | null
          payroll_type_id?: number | null
          phone_number?: string | null
          preferred_shift_ids?: number[] | null
          proof_of_address_attachments?: Json | null
          proof_of_national_insurance_attachments?: Json | null
          recruiter_id?: number | null
          reference_contact_number_1?: string | null
          reference_contact_number_2?: string | null
          reference_date_held_from_1?: number | null
          reference_date_held_from_2?: number | null
          reference_date_held_to_1?: number | null
          reference_date_held_to_2?: number | null
          reference_email_1?: string | null
          reference_email_2?: string | null
          reference_job_title_1?: string | null
          reference_job_title_2?: string | null
          reference_name_1?: string | null
          reference_name_2?: string | null
          reference_notice_period_1?: string | null
          reference_notice_period_2?: string | null
          reference_organization_1?: string | null
          reference_organization_2?: string | null
          reference_position_held_1?: string | null
          reference_position_held_2?: string | null
          registered_at?: number | null
          registration_attachment?: Json | null
          resourcer_id?: number | null
          rtw_attachments?: Json | null
          sent_to_portal_at?: number | null
          sign_contract_attachment?: Json | null
          surname?: string | null
          title?: string | null
          type_of_work?: string | null
          updated_at?: number | null
          yoti_attachments?: Json | null
          yoti_document_type?: string | null
          yoti_session_id?: string | null
          yoti_status?: string | null
          zoho_request_id?: string | null
          zoho_request_status?: string | null
          zoho_setting_id?: number | null
        }
        Update: {
          active_status?: string | null
          active_status_changed_at?: number | null
          added_to_loader?: boolean
          added_to_loader_at?: number | null
          address_id?: number | null
          attachments?: Json | null
          booking_status?: string | null
          candidate_settings?: Json | null
          candidate_status_id?: number | null
          company_name?: string | null
          company_number?: string | null
          cpc_back_attachment?: Json | null
          cpc_expire_date?: number | null
          cpc_front_attachment?: Json | null
          created_at?: number
          created_by_user_id?: number
          current_salary?: number | null
          date_of_rehabilitation?: number | null
          department_tag_ids?: number[] | null
          details_of_convictions?: string | null
          digi_card_back_attachment?: Json | null
          digi_card_expire_date?: number | null
          digi_card_front_attachment?: Json | null
          dob?: number | null
          document_required_steps?: string[] | null
          document_steps?: string[] | null
          document_steps_changed_at?: number | null
          driver_card_back_attachment?: Json | null
          driver_card_front_attachment?: Json | null
          driver_license?: string | null
          driver_license_back_attachment?: Json | null
          driver_license_check?: boolean | null
          driver_license_expire_date?: number | null
          driver_license_front_attachment?: Json | null
          email?: string | null
          expected_salary?: number | null
          external_zoho_template_id?: string | null
          forename?: string | null
          ghl_contact_id?: string | null
          ghl_location_id?: string | null
          has_own_transport?: boolean | null
          health_issue_state?: string | null
          hear_about_us?: string | null
          hiab_card_back_attachment?: Json | null
          hiab_card_expire_date?: number | null
          hiab_card_front_attachment?: Json | null
          id?: number
          import_id?: number | null
          industry_ids?: number[] | null
          industry_type_id?: number | null
          is_completed_onboarding_steps?: boolean | null
          job_category_ids?: number[] | null
          job_title?: string | null
          job_title_id?: number | null
          manual_handling?: string | null
          marketing_preferences?: string[] | null
          name?: string | null
          next_of_kin_name?: string | null
          next_of_kin_phone_number?: string | null
          next_of_kin_relationship?: string | null
          ni_number?: string | null
          notice_period_id?: number | null
          onboarding_at?: number | null
          onboarding_status?: string | null
          onboarding_status_changed_at?: number | null
          onboarding_steps?: string[] | null
          organization_id?: number | null
          passport_attachments?: Json | null
          payroll_type_id?: number | null
          phone_number?: string | null
          preferred_shift_ids?: number[] | null
          proof_of_address_attachments?: Json | null
          proof_of_national_insurance_attachments?: Json | null
          recruiter_id?: number | null
          reference_contact_number_1?: string | null
          reference_contact_number_2?: string | null
          reference_date_held_from_1?: number | null
          reference_date_held_from_2?: number | null
          reference_date_held_to_1?: number | null
          reference_date_held_to_2?: number | null
          reference_email_1?: string | null
          reference_email_2?: string | null
          reference_job_title_1?: string | null
          reference_job_title_2?: string | null
          reference_name_1?: string | null
          reference_name_2?: string | null
          reference_notice_period_1?: string | null
          reference_notice_period_2?: string | null
          reference_organization_1?: string | null
          reference_organization_2?: string | null
          reference_position_held_1?: string | null
          reference_position_held_2?: string | null
          registered_at?: number | null
          registration_attachment?: Json | null
          resourcer_id?: number | null
          rtw_attachments?: Json | null
          sent_to_portal_at?: number | null
          sign_contract_attachment?: Json | null
          surname?: string | null
          title?: string | null
          type_of_work?: string | null
          updated_at?: number | null
          yoti_attachments?: Json | null
          yoti_document_type?: string | null
          yoti_session_id?: string | null
          yoti_status?: string | null
          zoho_request_id?: string | null
          zoho_request_status?: string | null
          zoho_setting_id?: number | null
        }
        Relationships: []
      }
      candidates_backup: {
        Row: {
          active_status: string | null
          active_status_changed_at: number | null
          added_to_loader: boolean | null
          added_to_loader_at: number | null
          address_id: number | null
          attachments: Json | null
          booking_status: string | null
          candidate_settings: Json | null
          candidate_status_id: number | null
          company_name: string | null
          company_number: string | null
          cpc_back_attachment: Json | null
          cpc_expire_date: number | null
          cpc_front_attachment: Json | null
          created_at: number | null
          created_by_user_id: number | null
          current_salary: number | null
          date_of_rehabilitation: number | null
          department_tag_ids: number[] | null
          details_of_convictions: string | null
          digi_card_back_attachment: Json | null
          digi_card_expire_date: number | null
          digi_card_front_attachment: Json | null
          dob: number | null
          document_required_steps: string[] | null
          document_steps: string[] | null
          document_steps_changed_at: number | null
          driver_card_back_attachment: Json | null
          driver_card_front_attachment: Json | null
          driver_license: string | null
          driver_license_back_attachment: Json | null
          driver_license_check: boolean | null
          driver_license_expire_date: number | null
          driver_license_front_attachment: Json | null
          email: string | null
          expected_salary: number | null
          external_zoho_template_id: string | null
          forename: string | null
          ghl_contact_id: string | null
          ghl_location_id: string | null
          has_own_transport: boolean | null
          health_issue_state: string | null
          hear_about_us: string | null
          hiab_card_back_attachment: Json | null
          hiab_card_expire_date: number | null
          hiab_card_front_attachment: Json | null
          id: number | null
          import_id: number | null
          industry_ids: number[] | null
          industry_type_id: number | null
          is_completed_onboarding_steps: boolean | null
          job_category_ids: number[] | null
          job_title: string | null
          job_title_id: number | null
          manual_handling: string | null
          marketing_preferences: string[] | null
          name: string | null
          next_of_kin_name: string | null
          next_of_kin_phone_number: string | null
          next_of_kin_relationship: string | null
          ni_number: string | null
          notice_period_id: number | null
          onboarding_at: number | null
          onboarding_status: string | null
          onboarding_status_changed_at: number | null
          onboarding_steps: string[] | null
          organization_id: number | null
          passport_attachments: Json | null
          payroll_type_id: number | null
          phone_number: string | null
          preferred_shift_ids: number[] | null
          proof_of_address_attachments: Json | null
          proof_of_national_insurance_attachments: Json | null
          recruiter_id: number | null
          reference_contact_number_1: string | null
          reference_contact_number_2: string | null
          reference_date_held_from_1: number | null
          reference_date_held_from_2: number | null
          reference_date_held_to_1: number | null
          reference_date_held_to_2: number | null
          reference_email_1: string | null
          reference_email_2: string | null
          reference_job_title_1: string | null
          reference_job_title_2: string | null
          reference_name_1: string | null
          reference_name_2: string | null
          reference_notice_period_1: string | null
          reference_notice_period_2: string | null
          reference_organization_1: string | null
          reference_organization_2: string | null
          reference_position_held_1: string | null
          reference_position_held_2: string | null
          registered_at: number | null
          registration_attachment: Json | null
          resourcer_id: number | null
          rtw_attachments: Json | null
          sent_to_portal_at: number | null
          sign_contract_attachment: Json | null
          surname: string | null
          title: string | null
          type_of_work: string | null
          updated_at: number | null
          yoti_attachments: Json | null
          yoti_document_type: string | null
          yoti_session_id: string | null
          yoti_status: string | null
          zoho_request_id: string | null
          zoho_request_status: string | null
          zoho_setting_id: number | null
        }
        Insert: {
          active_status?: string | null
          active_status_changed_at?: number | null
          added_to_loader?: boolean | null
          added_to_loader_at?: number | null
          address_id?: number | null
          attachments?: Json | null
          booking_status?: string | null
          candidate_settings?: Json | null
          candidate_status_id?: number | null
          company_name?: string | null
          company_number?: string | null
          cpc_back_attachment?: Json | null
          cpc_expire_date?: number | null
          cpc_front_attachment?: Json | null
          created_at?: number | null
          created_by_user_id?: number | null
          current_salary?: number | null
          date_of_rehabilitation?: number | null
          department_tag_ids?: number[] | null
          details_of_convictions?: string | null
          digi_card_back_attachment?: Json | null
          digi_card_expire_date?: number | null
          digi_card_front_attachment?: Json | null
          dob?: number | null
          document_required_steps?: string[] | null
          document_steps?: string[] | null
          document_steps_changed_at?: number | null
          driver_card_back_attachment?: Json | null
          driver_card_front_attachment?: Json | null
          driver_license?: string | null
          driver_license_back_attachment?: Json | null
          driver_license_check?: boolean | null
          driver_license_expire_date?: number | null
          driver_license_front_attachment?: Json | null
          email?: string | null
          expected_salary?: number | null
          external_zoho_template_id?: string | null
          forename?: string | null
          ghl_contact_id?: string | null
          ghl_location_id?: string | null
          has_own_transport?: boolean | null
          health_issue_state?: string | null
          hear_about_us?: string | null
          hiab_card_back_attachment?: Json | null
          hiab_card_expire_date?: number | null
          hiab_card_front_attachment?: Json | null
          id?: number | null
          import_id?: number | null
          industry_ids?: number[] | null
          industry_type_id?: number | null
          is_completed_onboarding_steps?: boolean | null
          job_category_ids?: number[] | null
          job_title?: string | null
          job_title_id?: number | null
          manual_handling?: string | null
          marketing_preferences?: string[] | null
          name?: string | null
          next_of_kin_name?: string | null
          next_of_kin_phone_number?: string | null
          next_of_kin_relationship?: string | null
          ni_number?: string | null
          notice_period_id?: number | null
          onboarding_at?: number | null
          onboarding_status?: string | null
          onboarding_status_changed_at?: number | null
          onboarding_steps?: string[] | null
          organization_id?: number | null
          passport_attachments?: Json | null
          payroll_type_id?: number | null
          phone_number?: string | null
          preferred_shift_ids?: number[] | null
          proof_of_address_attachments?: Json | null
          proof_of_national_insurance_attachments?: Json | null
          recruiter_id?: number | null
          reference_contact_number_1?: string | null
          reference_contact_number_2?: string | null
          reference_date_held_from_1?: number | null
          reference_date_held_from_2?: number | null
          reference_date_held_to_1?: number | null
          reference_date_held_to_2?: number | null
          reference_email_1?: string | null
          reference_email_2?: string | null
          reference_job_title_1?: string | null
          reference_job_title_2?: string | null
          reference_name_1?: string | null
          reference_name_2?: string | null
          reference_notice_period_1?: string | null
          reference_notice_period_2?: string | null
          reference_organization_1?: string | null
          reference_organization_2?: string | null
          reference_position_held_1?: string | null
          reference_position_held_2?: string | null
          registered_at?: number | null
          registration_attachment?: Json | null
          resourcer_id?: number | null
          rtw_attachments?: Json | null
          sent_to_portal_at?: number | null
          sign_contract_attachment?: Json | null
          surname?: string | null
          title?: string | null
          type_of_work?: string | null
          updated_at?: number | null
          yoti_attachments?: Json | null
          yoti_document_type?: string | null
          yoti_session_id?: string | null
          yoti_status?: string | null
          zoho_request_id?: string | null
          zoho_request_status?: string | null
          zoho_setting_id?: number | null
        }
        Update: {
          active_status?: string | null
          active_status_changed_at?: number | null
          added_to_loader?: boolean | null
          added_to_loader_at?: number | null
          address_id?: number | null
          attachments?: Json | null
          booking_status?: string | null
          candidate_settings?: Json | null
          candidate_status_id?: number | null
          company_name?: string | null
          company_number?: string | null
          cpc_back_attachment?: Json | null
          cpc_expire_date?: number | null
          cpc_front_attachment?: Json | null
          created_at?: number | null
          created_by_user_id?: number | null
          current_salary?: number | null
          date_of_rehabilitation?: number | null
          department_tag_ids?: number[] | null
          details_of_convictions?: string | null
          digi_card_back_attachment?: Json | null
          digi_card_expire_date?: number | null
          digi_card_front_attachment?: Json | null
          dob?: number | null
          document_required_steps?: string[] | null
          document_steps?: string[] | null
          document_steps_changed_at?: number | null
          driver_card_back_attachment?: Json | null
          driver_card_front_attachment?: Json | null
          driver_license?: string | null
          driver_license_back_attachment?: Json | null
          driver_license_check?: boolean | null
          driver_license_expire_date?: number | null
          driver_license_front_attachment?: Json | null
          email?: string | null
          expected_salary?: number | null
          external_zoho_template_id?: string | null
          forename?: string | null
          ghl_contact_id?: string | null
          ghl_location_id?: string | null
          has_own_transport?: boolean | null
          health_issue_state?: string | null
          hear_about_us?: string | null
          hiab_card_back_attachment?: Json | null
          hiab_card_expire_date?: number | null
          hiab_card_front_attachment?: Json | null
          id?: number | null
          import_id?: number | null
          industry_ids?: number[] | null
          industry_type_id?: number | null
          is_completed_onboarding_steps?: boolean | null
          job_category_ids?: number[] | null
          job_title?: string | null
          job_title_id?: number | null
          manual_handling?: string | null
          marketing_preferences?: string[] | null
          name?: string | null
          next_of_kin_name?: string | null
          next_of_kin_phone_number?: string | null
          next_of_kin_relationship?: string | null
          ni_number?: string | null
          notice_period_id?: number | null
          onboarding_at?: number | null
          onboarding_status?: string | null
          onboarding_status_changed_at?: number | null
          onboarding_steps?: string[] | null
          organization_id?: number | null
          passport_attachments?: Json | null
          payroll_type_id?: number | null
          phone_number?: string | null
          preferred_shift_ids?: number[] | null
          proof_of_address_attachments?: Json | null
          proof_of_national_insurance_attachments?: Json | null
          recruiter_id?: number | null
          reference_contact_number_1?: string | null
          reference_contact_number_2?: string | null
          reference_date_held_from_1?: number | null
          reference_date_held_from_2?: number | null
          reference_date_held_to_1?: number | null
          reference_date_held_to_2?: number | null
          reference_email_1?: string | null
          reference_email_2?: string | null
          reference_job_title_1?: string | null
          reference_job_title_2?: string | null
          reference_name_1?: string | null
          reference_name_2?: string | null
          reference_notice_period_1?: string | null
          reference_notice_period_2?: string | null
          reference_organization_1?: string | null
          reference_organization_2?: string | null
          reference_position_held_1?: string | null
          reference_position_held_2?: string | null
          registered_at?: number | null
          registration_attachment?: Json | null
          resourcer_id?: number | null
          rtw_attachments?: Json | null
          sent_to_portal_at?: number | null
          sign_contract_attachment?: Json | null
          surname?: string | null
          title?: string | null
          type_of_work?: string | null
          updated_at?: number | null
          yoti_attachments?: Json | null
          yoti_document_type?: string | null
          yoti_session_id?: string | null
          yoti_status?: string | null
          zoho_request_id?: string | null
          zoho_request_status?: string | null
          zoho_setting_id?: number | null
        }
        Relationships: []
      }
      candidates_missing_postal: {
        Row: {
          active_status: string | null
          active_status_changed_at: number | null
          added_to_loader: boolean | null
          added_to_loader_at: number | null
          address_id: number | null
          attachments: Json | null
          booking_status: string | null
          candidate_settings: Json | null
          candidate_status_id: number | null
          company_name: string | null
          company_number: string | null
          cpc_back_attachment: Json | null
          cpc_expire_date: number | null
          cpc_front_attachment: Json | null
          created_at: number | null
          created_by_user_id: number | null
          current_salary: number | null
          date_of_rehabilitation: number | null
          department_tag_ids: number[] | null
          details_of_convictions: string | null
          digi_card_back_attachment: Json | null
          digi_card_expire_date: number | null
          digi_card_front_attachment: Json | null
          dob: number | null
          document_required_steps: string[] | null
          document_steps: string[] | null
          document_steps_changed_at: number | null
          driver_card_back_attachment: Json | null
          driver_card_front_attachment: Json | null
          driver_license: string | null
          driver_license_back_attachment: Json | null
          driver_license_check: boolean | null
          driver_license_expire_date: number | null
          driver_license_front_attachment: Json | null
          email: string | null
          expected_salary: number | null
          external_zoho_template_id: string | null
          forename: string | null
          ghl_contact_id: string | null
          ghl_location_id: string | null
          has_own_transport: boolean | null
          health_issue_state: string | null
          hear_about_us: string | null
          hiab_card_back_attachment: Json | null
          hiab_card_expire_date: number | null
          hiab_card_front_attachment: Json | null
          id: number | null
          import_id: number | null
          industry_ids: number[] | null
          industry_type_id: number | null
          is_completed_onboarding_steps: boolean | null
          job_category_ids: number[] | null
          job_title: string | null
          job_title_id: number | null
          manual_handling: string | null
          marketing_preferences: string[] | null
          name: string | null
          next_of_kin_name: string | null
          next_of_kin_phone_number: string | null
          next_of_kin_relationship: string | null
          ni_number: string | null
          notice_period_id: number | null
          onboarding_at: number | null
          onboarding_status: string | null
          onboarding_status_changed_at: number | null
          onboarding_steps: string[] | null
          organization_id: number | null
          passport_attachments: Json | null
          payroll_type_id: number | null
          phone_number: string | null
          preferred_shift_ids: number[] | null
          proof_of_address_attachments: Json | null
          proof_of_national_insurance_attachments: Json | null
          recruiter_id: number | null
          reference_contact_number_1: string | null
          reference_contact_number_2: string | null
          reference_date_held_from_1: number | null
          reference_date_held_from_2: number | null
          reference_date_held_to_1: number | null
          reference_date_held_to_2: number | null
          reference_email_1: string | null
          reference_email_2: string | null
          reference_job_title_1: string | null
          reference_job_title_2: string | null
          reference_name_1: string | null
          reference_name_2: string | null
          reference_notice_period_1: string | null
          reference_notice_period_2: string | null
          reference_organization_1: string | null
          reference_organization_2: string | null
          reference_position_held_1: string | null
          reference_position_held_2: string | null
          registered_at: number | null
          registration_attachment: Json | null
          resourcer_id: number | null
          rtw_attachments: Json | null
          sent_to_portal_at: number | null
          sign_contract_attachment: Json | null
          surname: string | null
          title: string | null
          type_of_work: string | null
          updated_at: number | null
          yoti_attachments: Json | null
          yoti_document_type: string | null
          yoti_session_id: string | null
          yoti_status: string | null
          zoho_request_id: string | null
          zoho_request_status: string | null
          zoho_setting_id: number | null
        }
        Insert: {
          active_status?: string | null
          active_status_changed_at?: number | null
          added_to_loader?: boolean | null
          added_to_loader_at?: number | null
          address_id?: number | null
          attachments?: Json | null
          booking_status?: string | null
          candidate_settings?: Json | null
          candidate_status_id?: number | null
          company_name?: string | null
          company_number?: string | null
          cpc_back_attachment?: Json | null
          cpc_expire_date?: number | null
          cpc_front_attachment?: Json | null
          created_at?: number | null
          created_by_user_id?: number | null
          current_salary?: number | null
          date_of_rehabilitation?: number | null
          department_tag_ids?: number[] | null
          details_of_convictions?: string | null
          digi_card_back_attachment?: Json | null
          digi_card_expire_date?: number | null
          digi_card_front_attachment?: Json | null
          dob?: number | null
          document_required_steps?: string[] | null
          document_steps?: string[] | null
          document_steps_changed_at?: number | null
          driver_card_back_attachment?: Json | null
          driver_card_front_attachment?: Json | null
          driver_license?: string | null
          driver_license_back_attachment?: Json | null
          driver_license_check?: boolean | null
          driver_license_expire_date?: number | null
          driver_license_front_attachment?: Json | null
          email?: string | null
          expected_salary?: number | null
          external_zoho_template_id?: string | null
          forename?: string | null
          ghl_contact_id?: string | null
          ghl_location_id?: string | null
          has_own_transport?: boolean | null
          health_issue_state?: string | null
          hear_about_us?: string | null
          hiab_card_back_attachment?: Json | null
          hiab_card_expire_date?: number | null
          hiab_card_front_attachment?: Json | null
          id?: number | null
          import_id?: number | null
          industry_ids?: number[] | null
          industry_type_id?: number | null
          is_completed_onboarding_steps?: boolean | null
          job_category_ids?: number[] | null
          job_title?: string | null
          job_title_id?: number | null
          manual_handling?: string | null
          marketing_preferences?: string[] | null
          name?: string | null
          next_of_kin_name?: string | null
          next_of_kin_phone_number?: string | null
          next_of_kin_relationship?: string | null
          ni_number?: string | null
          notice_period_id?: number | null
          onboarding_at?: number | null
          onboarding_status?: string | null
          onboarding_status_changed_at?: number | null
          onboarding_steps?: string[] | null
          organization_id?: number | null
          passport_attachments?: Json | null
          payroll_type_id?: number | null
          phone_number?: string | null
          preferred_shift_ids?: number[] | null
          proof_of_address_attachments?: Json | null
          proof_of_national_insurance_attachments?: Json | null
          recruiter_id?: number | null
          reference_contact_number_1?: string | null
          reference_contact_number_2?: string | null
          reference_date_held_from_1?: number | null
          reference_date_held_from_2?: number | null
          reference_date_held_to_1?: number | null
          reference_date_held_to_2?: number | null
          reference_email_1?: string | null
          reference_email_2?: string | null
          reference_job_title_1?: string | null
          reference_job_title_2?: string | null
          reference_name_1?: string | null
          reference_name_2?: string | null
          reference_notice_period_1?: string | null
          reference_notice_period_2?: string | null
          reference_organization_1?: string | null
          reference_organization_2?: string | null
          reference_position_held_1?: string | null
          reference_position_held_2?: string | null
          registered_at?: number | null
          registration_attachment?: Json | null
          resourcer_id?: number | null
          rtw_attachments?: Json | null
          sent_to_portal_at?: number | null
          sign_contract_attachment?: Json | null
          surname?: string | null
          title?: string | null
          type_of_work?: string | null
          updated_at?: number | null
          yoti_attachments?: Json | null
          yoti_document_type?: string | null
          yoti_session_id?: string | null
          yoti_status?: string | null
          zoho_request_id?: string | null
          zoho_request_status?: string | null
          zoho_setting_id?: number | null
        }
        Update: {
          active_status?: string | null
          active_status_changed_at?: number | null
          added_to_loader?: boolean | null
          added_to_loader_at?: number | null
          address_id?: number | null
          attachments?: Json | null
          booking_status?: string | null
          candidate_settings?: Json | null
          candidate_status_id?: number | null
          company_name?: string | null
          company_number?: string | null
          cpc_back_attachment?: Json | null
          cpc_expire_date?: number | null
          cpc_front_attachment?: Json | null
          created_at?: number | null
          created_by_user_id?: number | null
          current_salary?: number | null
          date_of_rehabilitation?: number | null
          department_tag_ids?: number[] | null
          details_of_convictions?: string | null
          digi_card_back_attachment?: Json | null
          digi_card_expire_date?: number | null
          digi_card_front_attachment?: Json | null
          dob?: number | null
          document_required_steps?: string[] | null
          document_steps?: string[] | null
          document_steps_changed_at?: number | null
          driver_card_back_attachment?: Json | null
          driver_card_front_attachment?: Json | null
          driver_license?: string | null
          driver_license_back_attachment?: Json | null
          driver_license_check?: boolean | null
          driver_license_expire_date?: number | null
          driver_license_front_attachment?: Json | null
          email?: string | null
          expected_salary?: number | null
          external_zoho_template_id?: string | null
          forename?: string | null
          ghl_contact_id?: string | null
          ghl_location_id?: string | null
          has_own_transport?: boolean | null
          health_issue_state?: string | null
          hear_about_us?: string | null
          hiab_card_back_attachment?: Json | null
          hiab_card_expire_date?: number | null
          hiab_card_front_attachment?: Json | null
          id?: number | null
          import_id?: number | null
          industry_ids?: number[] | null
          industry_type_id?: number | null
          is_completed_onboarding_steps?: boolean | null
          job_category_ids?: number[] | null
          job_title?: string | null
          job_title_id?: number | null
          manual_handling?: string | null
          marketing_preferences?: string[] | null
          name?: string | null
          next_of_kin_name?: string | null
          next_of_kin_phone_number?: string | null
          next_of_kin_relationship?: string | null
          ni_number?: string | null
          notice_period_id?: number | null
          onboarding_at?: number | null
          onboarding_status?: string | null
          onboarding_status_changed_at?: number | null
          onboarding_steps?: string[] | null
          organization_id?: number | null
          passport_attachments?: Json | null
          payroll_type_id?: number | null
          phone_number?: string | null
          preferred_shift_ids?: number[] | null
          proof_of_address_attachments?: Json | null
          proof_of_national_insurance_attachments?: Json | null
          recruiter_id?: number | null
          reference_contact_number_1?: string | null
          reference_contact_number_2?: string | null
          reference_date_held_from_1?: number | null
          reference_date_held_from_2?: number | null
          reference_date_held_to_1?: number | null
          reference_date_held_to_2?: number | null
          reference_email_1?: string | null
          reference_email_2?: string | null
          reference_job_title_1?: string | null
          reference_job_title_2?: string | null
          reference_name_1?: string | null
          reference_name_2?: string | null
          reference_notice_period_1?: string | null
          reference_notice_period_2?: string | null
          reference_organization_1?: string | null
          reference_organization_2?: string | null
          reference_position_held_1?: string | null
          reference_position_held_2?: string | null
          registered_at?: number | null
          registration_attachment?: Json | null
          resourcer_id?: number | null
          rtw_attachments?: Json | null
          sent_to_portal_at?: number | null
          sign_contract_attachment?: Json | null
          surname?: string | null
          title?: string | null
          type_of_work?: string | null
          updated_at?: number | null
          yoti_attachments?: Json | null
          yoti_document_type?: string | null
          yoti_session_id?: string | null
          yoti_status?: string | null
          zoho_request_id?: string | null
          zoho_request_status?: string | null
          zoho_setting_id?: number | null
        }
        Relationships: []
      }
      candidates_prod: {
        Row: {
          active_status: string | null
          address: string | null
          availability_status: string | null
          bank_account_number: string | null
          bank_sort_code: string | null
          candidate_name: string
          city: string | null
          cpc_expiry_date: string | null
          created_at: string
          date_of_birth: string | null
          driving_licence_number: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          hourly_rate: number | null
          id: string
          licence_categories: string[] | null
          licence_expiry_date: string | null
          medical_certificate_expiry: string | null
          national_insurance_number: string | null
          notes: string | null
          phone: string | null
          postcode: string | null
          skills: string[] | null
          updated_at: string
        }
        Insert: {
          active_status?: string | null
          address?: string | null
          availability_status?: string | null
          bank_account_number?: string | null
          bank_sort_code?: string | null
          candidate_name: string
          city?: string | null
          cpc_expiry_date?: string | null
          created_at?: string
          date_of_birth?: string | null
          driving_licence_number?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          hourly_rate?: number | null
          id?: string
          licence_categories?: string[] | null
          licence_expiry_date?: string | null
          medical_certificate_expiry?: string | null
          national_insurance_number?: string | null
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Update: {
          active_status?: string | null
          address?: string | null
          availability_status?: string | null
          bank_account_number?: string | null
          bank_sort_code?: string | null
          candidate_name?: string
          city?: string | null
          cpc_expiry_date?: string | null
          created_at?: string
          date_of_birth?: string | null
          driving_licence_number?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          hourly_rate?: number | null
          id?: string
          licence_categories?: string[] | null
          licence_expiry_date?: string | null
          medical_certificate_expiry?: string | null
          national_insurance_number?: string | null
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address_id: number | null
          advised_credit_rating: string | null
          company_status_id: number | null
          created_at: number
          created_by_user_id: number
          credit_limit: string | null
          description: string | null
          id: number
          import_id: number | null
          industry_ids: number[] | null
          name: string
          organization_id: number | null
          owner_id: number | null
          payroll_type_ids: number[] | null
          phone_number: string | null
          previous_company_status_id: number | null
          primary_agency_id: number | null
          updated_at: number | null
          vat_number: string | null
          website: string | null
        }
        Insert: {
          address_id?: number | null
          advised_credit_rating?: string | null
          company_status_id?: number | null
          created_at?: number
          created_by_user_id: number
          credit_limit?: string | null
          description?: string | null
          id?: number
          import_id?: number | null
          industry_ids?: number[] | null
          name: string
          organization_id?: number | null
          owner_id?: number | null
          payroll_type_ids?: number[] | null
          phone_number?: string | null
          previous_company_status_id?: number | null
          primary_agency_id?: number | null
          updated_at?: number | null
          vat_number?: string | null
          website?: string | null
        }
        Update: {
          address_id?: number | null
          advised_credit_rating?: string | null
          company_status_id?: number | null
          created_at?: number
          created_by_user_id?: number
          credit_limit?: string | null
          description?: string | null
          id?: number
          import_id?: number | null
          industry_ids?: number[] | null
          name?: string
          organization_id?: number | null
          owner_id?: number | null
          payroll_type_ids?: number[] | null
          phone_number?: string | null
          previous_company_status_id?: number | null
          primary_agency_id?: number | null
          updated_at?: number | null
          vat_number?: string | null
          website?: string | null
        }
        Relationships: []
      }
      company_addresses: {
        Row: {
          address1: string
          address2: string
          city: string
          company_id: number
          country: string
          country_code: string
          county: string
          created_at: number
          district: string
          formatted_address: string
          phone_number: string
          postal_code: string
          state: string
          updated_at: number | null
        }
        Insert: {
          address1: string
          address2: string
          city: string
          company_id?: number
          country: string
          country_code: string
          county: string
          created_at?: number
          district: string
          formatted_address: string
          phone_number: string
          postal_code: string
          state: string
          updated_at?: number | null
        }
        Update: {
          address1?: string
          address2?: string
          city?: string
          company_id?: number
          country?: string
          country_code?: string
          county?: string
          created_at?: number
          district?: string
          formatted_address?: string
          phone_number?: string
          postal_code?: string
          state?: string
          updated_at?: number | null
        }
        Relationships: []
      }
      company_rates: {
        Row: {
          breaks_deducted: boolean | null
          company_id: number
          created_at: number
          created_by_user_id: number
          day_charge_rate: number
          day_pay_rate: number
          id: number
          import_id: number | null
          min_hours: string | null
          night_charge_rate: number
          night_pay_rate: number
          role: string | null
          saturday_charge_rate: number
          saturday_pay_rate: number
          sunday_charge_rate: number
          sunday_pay_rate: number
          updated_at: number | null
        }
        Insert: {
          breaks_deducted?: boolean | null
          company_id: number
          created_at?: number
          created_by_user_id: number
          day_charge_rate?: number
          day_pay_rate?: number
          id?: number
          import_id?: number | null
          min_hours?: string | null
          night_charge_rate?: number
          night_pay_rate?: number
          role?: string | null
          saturday_charge_rate?: number
          saturday_pay_rate?: number
          sunday_charge_rate?: number
          sunday_pay_rate?: number
          updated_at?: number | null
        }
        Update: {
          breaks_deducted?: boolean | null
          company_id?: number
          created_at?: number
          created_by_user_id?: number
          day_charge_rate?: number
          day_pay_rate?: number
          id?: number
          import_id?: number | null
          min_hours?: string | null
          night_charge_rate?: number
          night_pay_rate?: number
          role?: string | null
          saturday_charge_rate?: number
          saturday_pay_rate?: number
          sunday_charge_rate?: number
          sunday_pay_rate?: number
          updated_at?: number | null
        }
        Relationships: []
      }
      company_rates_prod: {
        Row: {
          charge_rate: number
          created_at: string
          customer_id: string | null
          description: string | null
          driver_class: string
          effective_from: string | null
          effective_to: string | null
          id: string
          is_active: boolean | null
          pay_rate: number
          rate_category: string
          updated_at: string
        }
        Insert: {
          charge_rate: number
          created_at?: string
          customer_id?: string | null
          description?: string | null
          driver_class: string
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          pay_rate: number
          rate_category: string
          updated_at?: string
        }
        Update: {
          charge_rate?: number
          created_at?: string
          customer_id?: string | null
          description?: string | null
          driver_class?: string
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          pay_rate?: number
          rate_category?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_rates_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_prod"
            referencedColumns: ["id"]
          },
        ]
      }
      company_statuses: {
        Row: {
          color: string | null
          created_at: number
          id: number
          is_available: boolean
          is_default: boolean
          name: string
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          color?: string | null
          created_at?: number
          id?: number
          is_available?: boolean
          is_default?: boolean
          name: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          color?: string | null
          created_at?: number
          id?: number
          is_available?: boolean
          is_default?: boolean
          name?: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      connected_365_accounts: {
        Row: {
          access_token: string | null
          account_365_id: string
          account_365_name: string | null
          account_365_username: string | null
          created_at: number
          created_by_user_id: number
          expired_at: number | null
          id: number
          id_token: string | null
          organization_id: number | null
          prevented_domains: string[] | null
          refresh_token: string | null
          subscription_expired_at: number | null
          subscription_id: string | null
          token_type: string | null
          updated_at: number | null
          user_id: number | null
        }
        Insert: {
          access_token?: string | null
          account_365_id: string
          account_365_name?: string | null
          account_365_username?: string | null
          created_at?: number
          created_by_user_id: number
          expired_at?: number | null
          id?: number
          id_token?: string | null
          organization_id?: number | null
          prevented_domains?: string[] | null
          refresh_token?: string | null
          subscription_expired_at?: number | null
          subscription_id?: string | null
          token_type?: string | null
          updated_at?: number | null
          user_id?: number | null
        }
        Update: {
          access_token?: string | null
          account_365_id?: string
          account_365_name?: string | null
          account_365_username?: string | null
          created_at?: number
          created_by_user_id?: number
          expired_at?: number | null
          id?: number
          id_token?: string | null
          organization_id?: number | null
          prevented_domains?: string[] | null
          refresh_token?: string | null
          subscription_expired_at?: number | null
          subscription_id?: string | null
          token_type?: string | null
          updated_at?: number | null
          user_id?: number | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          address_id: number | null
          business_user_id: number | null
          company_id: number | null
          created_at: number
          created_by_user_id: number
          direct_dial_phone: string | null
          forename: string | null
          ghl_contact_id: string | null
          ghl_location_id: string | null
          id: number
          import_id: number | null
          industry_ids: number[] | null
          job_title: string | null
          name: string | null
          organization_id: number | null
          personal_email: string | null
          personal_mobile: string | null
          recruiter_id: number | null
          surname: string | null
          updated_at: number | null
          work_email: string | null
          work_phone: string | null
        }
        Insert: {
          address_id?: number | null
          business_user_id?: number | null
          company_id?: number | null
          created_at?: number
          created_by_user_id: number
          direct_dial_phone?: string | null
          forename?: string | null
          ghl_contact_id?: string | null
          ghl_location_id?: string | null
          id?: number
          import_id?: number | null
          industry_ids?: number[] | null
          job_title?: string | null
          name?: string | null
          organization_id?: number | null
          personal_email?: string | null
          personal_mobile?: string | null
          recruiter_id?: number | null
          surname?: string | null
          updated_at?: number | null
          work_email?: string | null
          work_phone?: string | null
        }
        Update: {
          address_id?: number | null
          business_user_id?: number | null
          company_id?: number | null
          created_at?: number
          created_by_user_id?: number
          direct_dial_phone?: string | null
          forename?: string | null
          ghl_contact_id?: string | null
          ghl_location_id?: string | null
          id?: number
          import_id?: number | null
          industry_ids?: number[] | null
          job_title?: string | null
          name?: string | null
          organization_id?: number | null
          personal_email?: string | null
          personal_mobile?: string | null
          recruiter_id?: number | null
          surname?: string | null
          updated_at?: number | null
          work_email?: string | null
          work_phone?: string | null
        }
        Relationships: []
      }
      contacts_prod: {
        Row: {
          contact_email: string | null
          contact_name: string
          contact_phone: string | null
          contact_position: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          is_primary_contact: boolean | null
          updated_at: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_name: string
          contact_phone?: string | null
          contact_position?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          is_primary_contact?: boolean | null
          updated_at?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string | null
          contact_position?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          is_primary_contact?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_prod_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_prod"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_rates: {
        Row: {
          created_at: number
          id: number
          old_id: number | null
          organization_id: number | null
          type: string
          updated_at: number | null
          value: number
        }
        Insert: {
          created_at?: number
          id?: number
          old_id?: number | null
          organization_id?: number | null
          type: string
          updated_at?: number | null
          value?: number
        }
        Update: {
          created_at?: number
          id?: number
          old_id?: number | null
          organization_id?: number | null
          type?: string
          updated_at?: number | null
          value?: number
        }
        Relationships: []
      }
      customers_prod: {
        Row: {
          address: string | null
          business_type: string | null
          city: string | null
          company: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          country: string | null
          created_at: string
          credit_limit: number | null
          id: string
          is_active: boolean | null
          notes: string | null
          payment_terms: number | null
          postcode: string | null
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          business_type?: string | null
          city?: string | null
          company: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          credit_limit?: number | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          payment_terms?: number | null
          postcode?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          business_type?: string | null
          city?: string | null
          company?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          credit_limit?: number | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          payment_terms?: number | null
          postcode?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      department_tags: {
        Row: {
          created_at: number
          id: number
          name: string
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          id?: number
          name: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          id?: number
          name?: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      document_types: {
        Row: {
          created_at: number
          id: number
          name: string
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          id?: number
          name: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          id?: number
          name?: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          attachment: Json | null
          candidate_id: number | null
          company_id: number | null
          contact_id: number | null
          created_at: number
          created_by_user_id: number | null
          document_type_id: number
          id: number
          organization_id: number | null
          updated_at: number | null
          vacancy_id: number | null
        }
        Insert: {
          attachment?: Json | null
          candidate_id?: number | null
          company_id?: number | null
          contact_id?: number | null
          created_at?: number
          created_by_user_id?: number | null
          document_type_id: number
          id?: number
          organization_id?: number | null
          updated_at?: number | null
          vacancy_id?: number | null
        }
        Update: {
          attachment?: Json | null
          candidate_id?: number | null
          company_id?: number | null
          contact_id?: number | null
          created_at?: number
          created_by_user_id?: number | null
          document_type_id?: number
          id?: number
          organization_id?: number | null
          updated_at?: number | null
          vacancy_id?: number | null
        }
        Relationships: []
      }
      email_send_addresses: {
        Row: {
          created_at: number
          email: string
          id: number
          is_verified: boolean | null
          name: string | null
          organization_id: number | null
          organization_ids: number[] | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          email: string
          id: number
          is_verified?: boolean | null
          name?: string | null
          organization_id?: number | null
          organization_ids?: number[] | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          email?: string
          id?: number
          is_verified?: boolean | null
          name?: string | null
          organization_id?: number | null
          organization_ids?: number[] | null
          updated_at?: number | null
        }
        Relationships: []
      }
      ghl: {
        Row: {
          access_token: string | null
          code: string | null
          company_id: string
          created_at: number
          expired_at: number | null
          id: number
          is_default: boolean
          location_id: string
          old_id: number | null
          organization_id: number | null
          refresh_token: string | null
          scope: string | null
          token_type: string | null
          updated_at: number | null
          user_id: string
          user_type: string
        }
        Insert: {
          access_token?: string | null
          code?: string | null
          company_id: string
          created_at?: number
          expired_at?: number | null
          id?: number
          is_default?: boolean
          location_id: string
          old_id?: number | null
          organization_id?: number | null
          refresh_token?: string | null
          scope?: string | null
          token_type?: string | null
          updated_at?: number | null
          user_id: string
          user_type: string
        }
        Update: {
          access_token?: string | null
          code?: string | null
          company_id?: string
          created_at?: number
          expired_at?: number | null
          id?: number
          is_default?: boolean
          location_id?: string
          old_id?: number | null
          organization_id?: number | null
          refresh_token?: string | null
          scope?: string | null
          token_type?: string | null
          updated_at?: number | null
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      ghl_locations: {
        Row: {
          business: Json | null
          company_id: string
          country: string | null
          created_at: number
          date_added: string
          domain: string
          email: string | null
          first_name: string | null
          id: number
          last_name: string | null
          location_id: string
          name: string | null
          old_id: number | null
          organization_id: number | null
          phone: string | null
          postal_code: string | null
          settings: Json | null
          social: Json | null
          state: string | null
          timezone: string | null
          updated_at: number | null
          website: string | null
        }
        Insert: {
          business?: Json | null
          company_id: string
          country?: string | null
          created_at?: number
          date_added: string
          domain: string
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          location_id: string
          name?: string | null
          old_id?: number | null
          organization_id?: number | null
          phone?: string | null
          postal_code?: string | null
          settings?: Json | null
          social?: Json | null
          state?: string | null
          timezone?: string | null
          updated_at?: number | null
          website?: string | null
        }
        Update: {
          business?: Json | null
          company_id?: string
          country?: string | null
          created_at?: number
          date_added?: string
          domain?: string
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          location_id?: string
          name?: string | null
          old_id?: number | null
          organization_id?: number | null
          phone?: string | null
          postal_code?: string | null
          settings?: Json | null
          social?: Json | null
          state?: string | null
          timezone?: string | null
          updated_at?: number | null
          website?: string | null
        }
        Relationships: []
      }
      ghl_snippets: {
        Row: {
          created_at: number
          ghl_function_snippet: string
          ghl_location_id: string
          ghl_snippet_id: string
          id: number
          name: string
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          ghl_function_snippet: string
          ghl_location_id: string
          ghl_snippet_id: string
          id?: number
          name: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          ghl_function_snippet?: string
          ghl_location_id?: string
          ghl_snippet_id?: string
          id?: number
          name?: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      ghl_workflows: {
        Row: {
          created_at: number
          ghl_function_workflow: string
          ghl_location_id: string
          ghl_work_flow_id: string
          id: number
          name: string
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          ghl_function_workflow: string
          ghl_location_id: string
          ghl_work_flow_id: string
          id?: number
          name: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          ghl_function_workflow?: string
          ghl_location_id?: string
          ghl_work_flow_id?: string
          id?: number
          name?: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      id_mappings_prod: {
        Row: {
          created_at: string
          id: string
          new_id: string
          old_id: string
          table_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          new_id: string
          old_id: string
          table_name: string
        }
        Update: {
          created_at?: string
          id?: string
          new_id?: string
          old_id?: string
          table_name?: string
        }
        Relationships: []
      }
      import_candidates: {
        Row: {
          email: string | null
          name: string | null
          phone: string | null
        }
        Insert: {
          email?: string | null
          name?: string | null
          phone?: string | null
        }
        Update: {
          email?: string | null
          name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      imports: {
        Row: {
          attachment: Json
          created_at: number
          created_by_user_id: number
          entity_type: string
          id: number
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          attachment: Json
          created_at?: number
          created_by_user_id: number
          entity_type: string
          id?: number
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          attachment?: Json
          created_at?: number
          created_by_user_id?: number
          entity_type?: string
          id?: number
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      industries: {
        Row: {
          created_at: number
          id: number
          name: string
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          id?: number
          name: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          id?: number
          name?: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      industry_type_onboarding_document_type: {
        Row: {
          created_at: number
          id: number
          industry_type_id: number
          onboarding_document_type_id: number
          organization_id: number
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          id?: number
          industry_type_id: number
          onboarding_document_type_id: number
          organization_id: number
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          id?: number
          industry_type_id?: number
          onboarding_document_type_id?: number
          organization_id?: number
          updated_at?: number | null
        }
        Relationships: []
      }
      industry_types: {
        Row: {
          created_at: number
          id: number
          name: string
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          id?: number
          name: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          id?: number
          name?: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      job_categories: {
        Row: {
          created_at: number
          id: number
          name: string
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          id?: number
          name: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          id?: number
          name?: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      job_titles: {
        Row: {
          created_at: number
          id: number
          name: string | null
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          id?: number
          name?: string | null
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          id?: number
          name?: string | null
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      legacy_import_log_prod: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          import_status: string
          records_imported: number | null
          table_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          import_status?: string
          records_imported?: number | null
          table_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          import_status?: string
          records_imported?: number | null
          table_name?: string
        }
        Relationships: []
      }
      legacy_mappings_final: {
        Row: {
          created_at: string | null
          legacy_id: number
          legacy_table: string
          new_id: string
        }
        Insert: {
          created_at?: string | null
          legacy_id: number
          legacy_table: string
          new_id: string
        }
        Update: {
          created_at?: string | null
          legacy_id?: number
          legacy_table?: string
          new_id?: string
        }
        Relationships: []
      }
      magic_token: {
        Row: {
          created_at: number
          expired_at: number
          id: number
          is_used: boolean
          token: string
          updated_at: number | null
          user_id: number
        }
        Insert: {
          created_at?: number
          expired_at: number
          id?: number
          is_used?: boolean
          token: string
          updated_at?: number | null
          user_id: number
        }
        Update: {
          created_at?: number
          expired_at?: number
          id?: number
          is_used?: boolean
          token?: string
          updated_at?: number | null
          user_id?: number
        }
        Relationships: []
      }
      migration_status_prod: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          migrated_records: number | null
          started_at: string | null
          status: string
          table_name: string
          total_records: number | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          migrated_records?: number | null
          started_at?: string | null
          status: string
          table_name: string
          total_records?: number | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          migrated_records?: number | null
          started_at?: string | null
          status?: string
          table_name?: string
          total_records?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      note_types: {
        Row: {
          created_at: number
          id: number
          name: string
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          id?: number
          name: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          id?: number
          name?: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      note_types_prod: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          booking_id: number | null
          candidate_id: number | null
          company_id: number | null
          contact_id: number | null
          content: string
          created_at: number
          created_by_user_id: number | null
          id: number
          note_type_id: number | null
          organization_id: number | null
          task_id: number | null
          updated_at: number | null
          vacancy_id: number | null
        }
        Insert: {
          booking_id?: number | null
          candidate_id?: number | null
          company_id?: number | null
          contact_id?: number | null
          content: string
          created_at?: number
          created_by_user_id?: number | null
          id?: number
          note_type_id?: number | null
          organization_id?: number | null
          task_id?: number | null
          updated_at?: number | null
          vacancy_id?: number | null
        }
        Update: {
          booking_id?: number | null
          candidate_id?: number | null
          company_id?: number | null
          contact_id?: number | null
          content?: string
          created_at?: number
          created_by_user_id?: number | null
          id?: number
          note_type_id?: number | null
          organization_id?: number | null
          task_id?: number | null
          updated_at?: number | null
          vacancy_id?: number | null
        }
        Relationships: []
      }
      notes_prod: {
        Row: {
          booking_id: string | null
          candidate_id: string | null
          contact_id: string | null
          content: string
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          id: string
          note_type: string | null
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          candidate_id?: string | null
          contact_id?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          id?: string
          note_type?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          candidate_id?: string | null
          contact_id?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          id?: string
          note_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_prod_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings_prod"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_prod_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates_prod"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_prod_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts_prod"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_prod_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_prod"
            referencedColumns: ["id"]
          },
        ]
      }
      notice_periods: {
        Row: {
          created_at: number
          id: number
          name: string
          old_id: number | null
          organization_id: number | null
          organization_ids: number[] | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          id?: number
          name: string
          old_id?: number | null
          organization_id?: number | null
          organization_ids?: number[] | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          id?: number
          name?: string
          old_id?: number | null
          organization_id?: number | null
          organization_ids?: number[] | null
          updated_at?: number | null
        }
        Relationships: []
      }
      onboarding_document_types: {
        Row: {
          created_at: number
          has_expiry_date: boolean
          id: number
          is_required: boolean
          name: string
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          has_expiry_date?: boolean
          id?: number
          is_required?: boolean
          name: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          has_expiry_date?: boolean
          id?: number
          is_required?: boolean
          name?: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          attachment: Json | null
          created_at: number
          ghl_location_id: string | null
          id: number
          name: string
          updated_at: number | null
        }
        Insert: {
          attachment?: Json | null
          created_at?: number
          ghl_location_id?: string | null
          id?: number
          name: string
          updated_at?: number | null
        }
        Update: {
          attachment?: Json | null
          created_at?: number
          ghl_location_id?: string | null
          id?: number
          name?: string
          updated_at?: number | null
        }
        Relationships: []
      }
      outbound_phone_numbers: {
        Row: {
          created_at: number
          id: number
          name: string | null
          organization_id: number | null
          organization_ids: number[] | null
          phone_number: string
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          id?: number
          name?: string | null
          organization_id?: number | null
          organization_ids?: number[] | null
          phone_number: string
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          id?: number
          name?: string | null
          organization_id?: number | null
          organization_ids?: number[] | null
          phone_number?: string
          updated_at?: number | null
        }
        Relationships: []
      }
      payroll_types: {
        Row: {
          created_at: number
          id: number
          name: string
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          id?: number
          name: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          id?: number
          name?: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      preferred_shifts: {
        Row: {
          created_at: number
          id: number
          name: string
          old_id: number | null
          organization_id: number | null
          organization_ids: number[] | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          id?: number
          name: string
          old_id?: number | null
          organization_id?: number | null
          organization_ids?: number[] | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          id?: number
          name?: string
          old_id?: number | null
          organization_id?: number | null
          organization_ids?: number[] | null
          updated_at?: number | null
        }
        Relationships: []
      }
      request_contacts: {
        Row: {
          company_email: string
          company_name: string | null
          created_at: number
          id: number
          job_title: string | null
          name: string | null
          notify_news_and_update: number | null
          number_of_consultants: number | null
          phone_number: string | null
          type: string | null
          updated_at: number | null
        }
        Insert: {
          company_email: string
          company_name?: string | null
          created_at?: number
          id?: number
          job_title?: string | null
          name?: string | null
          notify_news_and_update?: number | null
          number_of_consultants?: number | null
          phone_number?: string | null
          type?: string | null
          updated_at?: number | null
        }
        Update: {
          company_email?: string
          company_name?: string | null
          created_at?: number
          id?: number
          job_title?: string | null
          name?: string | null
          notify_news_and_update?: number | null
          number_of_consultants?: number | null
          phone_number?: string | null
          type?: string | null
          updated_at?: number | null
        }
        Relationships: []
      }
      shortlist_statuses: {
        Row: {
          color: string | null
          created_at: number
          id: number
          is_available: boolean
          is_default: boolean
          name: string
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          color?: string | null
          created_at?: number
          id?: number
          is_available?: boolean
          is_default?: boolean
          name: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          color?: string | null
          created_at?: number
          id?: number
          is_available?: boolean
          is_default?: boolean
          name?: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      shortlists: {
        Row: {
          candidate_id: number | null
          created_at: number
          from_booking_id: number | null
          id: number
          shortlist_status_id: number | null
          updated_at: number | null
          vacancy_id: number | null
        }
        Insert: {
          candidate_id?: number | null
          created_at?: number
          from_booking_id?: number | null
          id?: number
          shortlist_status_id?: number | null
          updated_at?: number | null
          vacancy_id?: number | null
        }
        Update: {
          candidate_id?: number | null
          created_at?: number
          from_booking_id?: number | null
          id?: number
          shortlist_status_id?: number | null
          updated_at?: number | null
          vacancy_id?: number | null
        }
        Relationships: []
      }
      table_preferences: {
        Row: {
          created_at: number
          id: number
          menu: string
          preferences: Json
          updated_at: number | null
          user_id: number
        }
        Insert: {
          created_at?: number
          id?: number
          menu: string
          preferences: Json
          updated_at?: number | null
          user_id: number
        }
        Update: {
          created_at?: number
          id?: number
          menu?: string
          preferences?: Json
          updated_at?: number | null
          user_id?: number
        }
        Relationships: []
      }
      task_priorities: {
        Row: {
          created_at: number
          id: number
          name: string
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          id?: number
          name: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          id?: number
          name?: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      task_types: {
        Row: {
          created_at: number
          id: number
          name: string
          old_id: number | null
          organization_id: number | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number
          id?: number
          name: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number
          id?: number
          name?: string
          old_id?: number | null
          organization_id?: number | null
          updated_at?: number | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_user_id: number
          booking_id: number | null
          candidate_id: number | null
          company_id: number | null
          completed_at: number | null
          contact_id: number | null
          created_at: number
          created_by_user_id: number | null
          description: string
          due_date: number
          entity_type: string
          id: number
          is_public: boolean
          notification_seen_by: Json | null
          organization_id: number | null
          owner_id: number
          reminder_date: number | null
          reminder_date_option: string | null
          sent_reminder_at: number | null
          task_priority_id: number
          task_type_id: number
          title: string
          updated_at: number | null
          vacancy_id: number | null
        }
        Insert: {
          assigned_user_id: number
          booking_id?: number | null
          candidate_id?: number | null
          company_id?: number | null
          completed_at?: number | null
          contact_id?: number | null
          created_at?: number
          created_by_user_id?: number | null
          description: string
          due_date: number
          entity_type: string
          id?: number
          is_public?: boolean
          notification_seen_by?: Json | null
          organization_id?: number | null
          owner_id: number
          reminder_date?: number | null
          reminder_date_option?: string | null
          sent_reminder_at?: number | null
          task_priority_id: number
          task_type_id: number
          title: string
          updated_at?: number | null
          vacancy_id?: number | null
        }
        Update: {
          assigned_user_id?: number
          booking_id?: number | null
          candidate_id?: number | null
          company_id?: number | null
          completed_at?: number | null
          contact_id?: number | null
          created_at?: number
          created_by_user_id?: number | null
          description?: string
          due_date?: number
          entity_type?: string
          id?: number
          is_public?: boolean
          notification_seen_by?: Json | null
          organization_id?: number | null
          owner_id?: number
          reminder_date?: number | null
          reminder_date_option?: string | null
          sent_reminder_at?: number | null
          task_priority_id?: number
          task_type_id?: number
          title?: string
          updated_at?: number | null
          vacancy_id?: number | null
        }
        Relationships: []
      }
      track_emails: {
        Row: {
          account_365_id: string | null
          account_365_name: string | null
          account_365_username: string | null
          attachments: Json | null
          body: string
          candidate_id: number | null
          connected365_account_id: number | null
          connected365_account_user_id: number | null
          contact_id: number | null
          created_at: number
          created_by_user_id: number | null
          email_send_address_id: number | null
          from_email: string | null
          id: number
          ms_message_id: string
          subject: string
          subscription_id: string | null
          to_email: string | null
          updated_at: number | null
          vacancy_id: number | null
        }
        Insert: {
          account_365_id?: string | null
          account_365_name?: string | null
          account_365_username?: string | null
          attachments?: Json | null
          body: string
          candidate_id?: number | null
          connected365_account_id?: number | null
          connected365_account_user_id?: number | null
          contact_id?: number | null
          created_at?: number
          created_by_user_id?: number | null
          email_send_address_id?: number | null
          from_email?: string | null
          id?: number
          ms_message_id: string
          subject: string
          subscription_id?: string | null
          to_email?: string | null
          updated_at?: number | null
          vacancy_id?: number | null
        }
        Update: {
          account_365_id?: string | null
          account_365_name?: string | null
          account_365_username?: string | null
          attachments?: Json | null
          body?: string
          candidate_id?: number | null
          connected365_account_id?: number | null
          connected365_account_user_id?: number | null
          contact_id?: number | null
          created_at?: number
          created_by_user_id?: number | null
          email_send_address_id?: number | null
          from_email?: string | null
          id?: number
          ms_message_id?: string
          subject?: string
          subscription_id?: string | null
          to_email?: string | null
          updated_at?: number | null
          vacancy_id?: number | null
        }
        Relationships: []
      }
      typeorm_metadata: {
        Row: {
          database: string | null
          name: string | null
          schema: string | null
          table: string | null
          type: string
          value: string | null
        }
        Insert: {
          database?: string | null
          name?: string | null
          schema?: string | null
          table?: string | null
          type: string
          value?: string | null
        }
        Update: {
          database?: string | null
          name?: string | null
          schema?: string | null
          table?: string | null
          type?: string
          value?: string | null
        }
        Relationships: []
      }
      user: {
        Row: {
          email: string
          id: number
          is_active: boolean
          name: string
          password: string
          roles: Database["public"]["Enums"]["user_roles_enum"]
        }
        Insert: {
          email: string
          id?: number
          is_active?: boolean
          name: string
          password: string
          roles?: Database["public"]["Enums"]["user_roles_enum"]
        }
        Update: {
          email?: string
          id?: number
          is_active?: boolean
          name?: string
          password?: string
          roles?: Database["public"]["Enums"]["user_roles_enum"]
        }
        Relationships: []
      }
      user_routes: {
        Row: {
          created_at: number
          id: number
          name: string
          route: string
          updated_at: number | null
          user_id: number
        }
        Insert: {
          created_at?: number
          id?: number
          name: string
          route: string
          updated_at?: number | null
          user_id: number
        }
        Update: {
          created_at?: number
          id?: number
          name?: string
          route?: string
          updated_at?: number | null
          user_id?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          candidate_id: number | null
          code_2fa: string | null
          code_2fa_sent_at: number | null
          created_at: number
          email: string
          enable_2fa: boolean | null
          ghl_contact_id: string | null
          ghl_location_id: string | null
          id: number
          is_active: boolean
          last_logged_in_at: number | null
          name: string
          organization_ids: number[] | null
          password: string | null
          password_changed_at: number | null
          phone_number: string | null
          roles: string[]
          show_in_dashboard: boolean | null
          updated_at: number | null
        }
        Insert: {
          candidate_id?: number | null
          code_2fa?: string | null
          code_2fa_sent_at?: number | null
          created_at?: number
          email: string
          enable_2fa?: boolean | null
          ghl_contact_id?: string | null
          ghl_location_id?: string | null
          id?: number
          is_active?: boolean
          last_logged_in_at?: number | null
          name: string
          organization_ids?: number[] | null
          password?: string | null
          password_changed_at?: number | null
          phone_number?: string | null
          roles?: string[]
          show_in_dashboard?: boolean | null
          updated_at?: number | null
        }
        Update: {
          candidate_id?: number | null
          code_2fa?: string | null
          code_2fa_sent_at?: number | null
          created_at?: number
          email?: string
          enable_2fa?: boolean | null
          ghl_contact_id?: string | null
          ghl_location_id?: string | null
          id?: number
          is_active?: boolean
          last_logged_in_at?: number | null
          name?: string
          organization_ids?: number[] | null
          password?: string | null
          password_changed_at?: number | null
          phone_number?: string | null
          roles?: string[]
          show_in_dashboard?: boolean | null
          updated_at?: number | null
        }
        Relationships: []
      }
      vacancies: {
        Row: {
          address_id: number | null
          assigned_contact_id: number | null
          company_id: number | null
          company_rate_id: number | null
          created_at: number
          created_by_user_id: number
          description: string | null
          id: number
          industry_ids: number[] | null
          job_category_ids: number[] | null
          job_posted_at: number | null
          organization_id: number | null
          recruiter_id: number | null
          resourcer_id: number | null
          title: string
          updated_at: number | null
          vacancy_status_id: number | null
        }
        Insert: {
          address_id?: number | null
          assigned_contact_id?: number | null
          company_id?: number | null
          company_rate_id?: number | null
          created_at?: number
          created_by_user_id: number
          description?: string | null
          id?: number
          industry_ids?: number[] | null
          job_category_ids?: number[] | null
          job_posted_at?: number | null
          organization_id?: number | null
          recruiter_id?: number | null
          resourcer_id?: number | null
          title: string
          updated_at?: number | null
          vacancy_status_id?: number | null
        }
        Update: {
          address_id?: number | null
          assigned_contact_id?: number | null
          company_id?: number | null
          company_rate_id?: number | null
          created_at?: number
          created_by_user_id?: number
          description?: string | null
          id?: number
          industry_ids?: number[] | null
          job_category_ids?: number[] | null
          job_posted_at?: number | null
          organization_id?: number | null
          recruiter_id?: number | null
          resourcer_id?: number | null
          title?: string
          updated_at?: number | null
          vacancy_status_id?: number | null
        }
        Relationships: []
      }
      vacancy_statuses: {
        Row: {
          color: string | null
          created_at: number
          id: number
          is_available: boolean
          is_default: boolean
          name: string
          old_id: number | null
          organization_id: number | null
          organization_ids: number[] | null
          updated_at: number | null
        }
        Insert: {
          color?: string | null
          created_at?: number
          id?: number
          is_available?: boolean
          is_default?: boolean
          name: string
          old_id?: number | null
          organization_id?: number | null
          organization_ids?: number[] | null
          updated_at?: number | null
        }
        Update: {
          color?: string | null
          created_at?: number
          id?: number
          is_available?: boolean
          is_default?: boolean
          name?: string
          old_id?: number | null
          organization_id?: number | null
          organization_ids?: number[] | null
          updated_at?: number | null
        }
        Relationships: []
      }
      vehicles_prod: {
        Row: {
          created_at: string
          fuel_type: string | null
          gross_weight: number | null
          id: string
          insurance_expiry_date: string | null
          last_service_date: string | null
          location: string | null
          manufacturer: string | null
          mileage: number | null
          model: string | null
          mot_expiry_date: string | null
          next_service_due_date: string | null
          notes: string | null
          status: string | null
          tax_expiry_date: string | null
          truck_registration: string
          updated_at: string
          vehicle_type: string | null
          year_manufactured: number | null
        }
        Insert: {
          created_at?: string
          fuel_type?: string | null
          gross_weight?: number | null
          id?: string
          insurance_expiry_date?: string | null
          last_service_date?: string | null
          location?: string | null
          manufacturer?: string | null
          mileage?: number | null
          model?: string | null
          mot_expiry_date?: string | null
          next_service_due_date?: string | null
          notes?: string | null
          status?: string | null
          tax_expiry_date?: string | null
          truck_registration: string
          updated_at?: string
          vehicle_type?: string | null
          year_manufactured?: number | null
        }
        Update: {
          created_at?: string
          fuel_type?: string | null
          gross_weight?: number | null
          id?: string
          insurance_expiry_date?: string | null
          last_service_date?: string | null
          location?: string | null
          manufacturer?: string | null
          mileage?: number | null
          model?: string | null
          mot_expiry_date?: string | null
          next_service_due_date?: string | null
          notes?: string | null
          status?: string | null
          tax_expiry_date?: string | null
          truck_registration?: string
          updated_at?: string
          vehicle_type?: string | null
          year_manufactured?: number | null
        }
        Relationships: []
      }
      work_locations_prod: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          country: string | null
          created_at: string
          customer_id: string | null
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          location_name: string
          postcode: string | null
          special_instructions: string | null
          updated_at: string
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          location_name: string
          postcode?: string | null
          special_instructions?: string | null
          updated_at?: string
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          location_name?: string
          postcode?: string | null
          special_instructions?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_locations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_prod"
            referencedColumns: ["id"]
          },
        ]
      }
      zoho_document_fields: {
        Row: {
          created_at: number
          external_zoho_document_field_id: string
          external_zoho_document_field_label: string
          external_zoho_document_field_name: string | null
          external_zoho_document_field_type_id: string | null
          external_zoho_document_id: string
          external_zoho_template_id: string
          field: string | null
          id: number
          mapping: Json | null
          organization_id: number | null
          updated_at: number | null
          zoho_setting_id: number
        }
        Insert: {
          created_at?: number
          external_zoho_document_field_id: string
          external_zoho_document_field_label: string
          external_zoho_document_field_name?: string | null
          external_zoho_document_field_type_id?: string | null
          external_zoho_document_id: string
          external_zoho_template_id: string
          field?: string | null
          id?: number
          mapping?: Json | null
          organization_id?: number | null
          updated_at?: number | null
          zoho_setting_id: number
        }
        Update: {
          created_at?: number
          external_zoho_document_field_id?: string
          external_zoho_document_field_label?: string
          external_zoho_document_field_name?: string | null
          external_zoho_document_field_type_id?: string | null
          external_zoho_document_id?: string
          external_zoho_template_id?: string
          field?: string | null
          id?: number
          mapping?: Json | null
          organization_id?: number | null
          updated_at?: number | null
          zoho_setting_id?: number
        }
        Relationships: []
      }
      zoho_settings: {
        Row: {
          access_token: string | null
          api_domain: string | null
          client_id: string
          client_secret: string
          connected_at: number | null
          created_at: number
          domain: string | null
          expires_at: number | null
          id: number
          name: string | null
          old_id: number | null
          organization_id: number | null
          refresh_token: string | null
          token_type: string | null
          updated_at: number | null
        }
        Insert: {
          access_token?: string | null
          api_domain?: string | null
          client_id: string
          client_secret: string
          connected_at?: number | null
          created_at?: number
          domain?: string | null
          expires_at?: number | null
          id?: number
          name?: string | null
          old_id?: number | null
          organization_id?: number | null
          refresh_token?: string | null
          token_type?: string | null
          updated_at?: number | null
        }
        Update: {
          access_token?: string | null
          api_domain?: string | null
          client_id?: string
          client_secret?: string
          connected_at?: number | null
          created_at?: number
          domain?: string | null
          expires_at?: number | null
          id?: number
          name?: string | null
          old_id?: number | null
          organization_id?: number | null
          refresh_token?: string | null
          token_type?: string | null
          updated_at?: number | null
        }
        Relationships: []
      }
      zoho_templates: {
        Row: {
          created_at: number
          external_template_name: string
          external_zoho_template_id: string
          id: number
          is_primary: boolean
          mapping: Json | null
          organization_id: number | null
          payroll_type_ids: number[] | null
          updated_at: number | null
          zoho_action_id: string | null
          zoho_action_type: string | null
          zoho_setting_id: number
        }
        Insert: {
          created_at?: number
          external_template_name: string
          external_zoho_template_id: string
          id?: number
          is_primary?: boolean
          mapping?: Json | null
          organization_id?: number | null
          payroll_type_ids?: number[] | null
          updated_at?: number | null
          zoho_action_id?: string | null
          zoho_action_type?: string | null
          zoho_setting_id: number
        }
        Update: {
          created_at?: number
          external_template_name?: string
          external_zoho_template_id?: string
          id?: number
          is_primary?: boolean
          mapping?: Json | null
          organization_id?: number | null
          payroll_type_ids?: number[] | null
          updated_at?: number | null
          zoho_action_id?: string | null
          zoho_action_type?: string | null
          zoho_setting_id?: number
        }
        Relationships: []
      }
    }
    Views: {
      bookings_candidates: {
        Row: {
          bookings: Json | null
          candidate_id: number | null
        }
        Relationships: []
      }
      candidate_duplicated_with_phone_email_and_notes: {
        Row: {
          candidate_email: string | null
          candidate_id: number | null
          candidate_name: string | null
          candidate_phone: string | null
          date_added: string | null
          last_note_date: string | null
          last_note_type: string | null
          total_notes: number | null
        }
        Relationships: []
      }
      candidate_phone_whatsapp_preview: {
        Row: {
          candidate_id: number | null
          candidate_name: string | null
          normalized_phone: string | null
          raw_phone: string | null
          whatsapp_preview: string | null
        }
        Insert: {
          candidate_id?: number | null
          candidate_name?: string | null
          normalized_phone?: never
          raw_phone?: string | null
          whatsapp_preview?: never
        }
        Update: {
          candidate_id?: number | null
          candidate_name?: string | null
          normalized_phone?: never
          raw_phone?: string | null
          whatsapp_preview?: never
        }
        Relationships: []
      }
      candidates_no_job_category: {
        Row: {
          candidate_email: string | null
          candidate_id: number | null
          candidate_name: string | null
          date_added: string | null
          job_category_ids: number[] | null
          normalized_phone: string | null
          raw_phone: string | null
        }
        Relationships: []
      }
      candidates_short_phone_nonrecruiting: {
        Row: {
          candidate_email: string | null
          candidate_id: number | null
          candidate_name: string | null
          digit_count: number | null
          last_note_type: string | null
          normalized_phone: string | null
          raw_phone: string | null
        }
        Relationships: []
      }
      candidates_to_remove: {
        Row: {
          candidate_email: string | null
          candidate_id: number | null
          candidate_name: string | null
          digit_count: number | null
          last_note_type: string | null
          normalized_phone: string | null
          raw_phone: string | null
        }
        Relationships: []
      }
      candidates_too_short_phone: {
        Row: {
          candidate_id: number | null
          candidate_name: string | null
          digit_count: number | null
          normalized_phone: string | null
          raw_phone: string | null
        }
        Insert: {
          candidate_id?: number | null
          candidate_name?: string | null
          digit_count?: never
          normalized_phone?: never
          raw_phone?: string | null
        }
        Update: {
          candidate_id?: number | null
          candidate_name?: string | null
          digit_count?: never
          normalized_phone?: never
          raw_phone?: string | null
        }
        Relationships: []
      }
      candidates_with_0000: {
        Row: {
          candidate_id: number | null
        }
        Insert: {
          candidate_id?: number | null
        }
        Update: {
          candidate_id?: number | null
        }
        Relationships: []
      }
      missing_contacts_with_notes: {
        Row: {
          candidate_id: number | null
          candidate_name: string | null
          date_added: string | null
          last_note_date: string | null
          last_note_type: string | null
          total_notes: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      execute_sql: {
        Args: { sql_statement: string }
        Returns: Json
      }
      geodistance: {
        Args: { alat: number; alng: number; blat: number; blng: number }
        Returns: number
      }
      get_last_note: {
        Args: {
          entitytype: string
          candidate_id: number
          organization_ids: number[]
          old_organization_ids: number[]
        }
        Returns: Json
      }
      get_total_notes: {
        Args: {
          entitytype: string
          candidate_id: number
          organization_ids: number[]
          old_organization_ids: number[]
        }
        Returns: number
      }
    }
    Enums: {
      user_roles_enum: "standard" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_roles_enum: ["standard", "premium"],
    },
  },
} as const
