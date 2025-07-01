
export interface MigrationStatus {
  id: string;
  table_name: string;
  status: string;
  total_records: number;
  migrated_records: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}
