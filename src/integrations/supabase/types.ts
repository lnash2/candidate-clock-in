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
          created_at: string
          customer_id: string
          dropoff_coordinates: Json | null
          dropoff_location: string | null
          end_date: string
          estimated_duration: number | null
          id: string
          is_night_shift: boolean | null
          notes: string | null
          organization_id: string | null
          pickup_coordinates: Json | null
          pickup_location: string | null
          route_distance: number | null
          start_date: string
          status: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          dropoff_coordinates?: Json | null
          dropoff_location?: string | null
          end_date: string
          estimated_duration?: number | null
          id?: string
          is_night_shift?: boolean | null
          notes?: string | null
          organization_id?: string | null
          pickup_coordinates?: Json | null
          pickup_location?: string | null
          route_distance?: number | null
          start_date: string
          status?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          dropoff_coordinates?: Json | null
          dropoff_location?: string | null
          end_date?: string
          estimated_duration?: number | null
          id?: string
          is_night_shift?: boolean | null
          notes?: string | null
          organization_id?: string | null
          pickup_coordinates?: Json | null
          pickup_location?: string | null
          route_distance?: number | null
          start_date?: string
          status?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
      company_rates: {
        Row: {
          charge_rate: number
          created_at: string
          customer_id: string
          description: string | null
          driver_class: string
          id: string
          is_active: boolean
          pay_rate: number
          rate_category: string
          updated_at: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          charge_rate: number
          created_at?: string
          customer_id: string
          description?: string | null
          driver_class: string
          id?: string
          is_active?: boolean
          pay_rate: number
          rate_category?: string
          updated_at?: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          charge_rate?: number
          created_at?: string
          customer_id?: string
          description?: string | null
          driver_class?: string
          id?: string
          is_active?: boolean
          pay_rate?: number
          rate_category?: string
          updated_at?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_company_rates_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          address_type: string | null
          company: string | null
          contact_email: string | null
          contact_fax: string | null
          contact_mobile: string | null
          contact_name: string | null
          contact_phone: string | null
          country: string | null
          county: string | null
          created_at: string
          credit_limit: number | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          ledger_account: string | null
          notes: string | null
          organization_id: string | null
          payment_terms: string | null
          phone: string | null
          post_code: string | null
          reference: string | null
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          address_type?: string | null
          company?: string | null
          contact_email?: string | null
          contact_fax?: string | null
          contact_mobile?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          county?: string | null
          created_at?: string
          credit_limit?: number | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          ledger_account?: string | null
          notes?: string | null
          organization_id?: string | null
          payment_terms?: string | null
          phone?: string | null
          post_code?: string | null
          reference?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          address_type?: string | null
          company?: string | null
          contact_email?: string | null
          contact_fax?: string | null
          contact_mobile?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          county?: string | null
          created_at?: string
          credit_limit?: number | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          ledger_account?: string | null
          notes?: string | null
          organization_id?: string | null
          payment_terms?: string | null
          phone?: string | null
          post_code?: string | null
          reference?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      day_type_rates: {
        Row: {
          charge_rate: number
          created_at: string
          day_type: string
          id: string
          pay_rate: number
          updated_at: string
        }
        Insert: {
          charge_rate: number
          created_at?: string
          day_type: string
          id?: string
          pay_rate: number
          updated_at?: string
        }
        Update: {
          charge_rate?: number
          created_at?: string
          day_type?: string
          id?: string
          pay_rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          created_at: string
          dob: string | null
          driving_licence_expiry: string | null
          email: string | null
          employment_type: string | null
          first_name: string | null
          id: string
          last_name: string | null
          license_number: string | null
          mobile_no: string | null
          nationality: string | null
          next_of_kin_name: string | null
          next_of_kin_primary_contact: string | null
          next_of_kin_relationship: string | null
          next_of_kin_secondary_contact: string | null
          ni_number: string | null
          notes: string | null
          organization_id: string | null
          phone: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          created_at?: string
          dob?: string | null
          driving_licence_expiry?: string | null
          email?: string | null
          employment_type?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          license_number?: string | null
          mobile_no?: string | null
          nationality?: string | null
          next_of_kin_name?: string | null
          next_of_kin_primary_contact?: string | null
          next_of_kin_relationship?: string | null
          next_of_kin_secondary_contact?: string | null
          ni_number?: string | null
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          created_at?: string
          dob?: string | null
          driving_licence_expiry?: string | null
          email?: string | null
          employment_type?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          license_number?: string | null
          mobile_no?: string | null
          nationality?: string | null
          next_of_kin_name?: string | null
          next_of_kin_primary_contact?: string | null
          next_of_kin_relationship?: string | null
          next_of_kin_secondary_contact?: string | null
          ni_number?: string | null
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          body_html: string
          error: string | null
          id: string
          organization_id: string | null
          recipient: string
          sender_id: string | null
          sent_at: string
          status: string
          subject: string
        }
        Insert: {
          body_html: string
          error?: string | null
          id?: string
          organization_id?: string | null
          recipient: string
          sender_id?: string | null
          sent_at?: string
          status: string
          subject: string
        }
        Update: {
          body_html?: string
          error?: string | null
          id?: string
          organization_id?: string | null
          recipient?: string
          sender_id?: string | null
          sent_at?: string
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body_html: string
          created_at: string
          id: string
          name: string
          organization_id: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          body_html: string
          created_at?: string
          id?: string
          name: string
          organization_id?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          body_html?: string
          created_at?: string
          id?: string
          name?: string
          organization_id?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      note_types: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          entity_id: string
          entity_type: string
          id: string
          note_type_id: string | null
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          note_type_id?: string | null
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          note_type_id?: string | null
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_note_type_id_fkey"
            columns: ["note_type_id"]
            isOneToOne: false
            referencedRelation: "note_types"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          has_completed_onboarding: boolean | null
          id: string
          last_active_at: string | null
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          has_completed_onboarding?: boolean | null
          id: string
          last_active_at?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          has_completed_onboarding?: boolean | null
          id?: string
          last_active_at?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          can_go_overseas: boolean | null
          horse_capacity: number | null
          id: string
          model: string | null
          notes: string | null
          status: string | null
          truck_length_m: string | null
          truck_registration: string
          weight: string | null
          year: number | null
        }
        Insert: {
          can_go_overseas?: boolean | null
          horse_capacity?: number | null
          id?: string
          model?: string | null
          notes?: string | null
          status?: string | null
          truck_length_m?: string | null
          truck_registration: string
          weight?: string | null
          year?: number | null
        }
        Update: {
          can_go_overseas?: boolean | null
          horse_capacity?: number | null
          id?: string
          model?: string | null
          notes?: string | null
          status?: string | null
          truck_length_m?: string | null
          truck_registration?: string
          weight?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_login_as: {
        Args: { target_user_id: string }
        Returns: string
      }
      is_root_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: "root_admin" | "admin" | "user"
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
    Enums: {
      user_role: ["root_admin", "admin", "user"],
    },
  },
} as const
