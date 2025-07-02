export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
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
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
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
      company_rates: {
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
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
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
      id_mappings: {
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
      legacy_import_log: {
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
      migration_status: {
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
      vehicles: {
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
      work_locations: {
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
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_sql: {
        Args: { sql_statement: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
