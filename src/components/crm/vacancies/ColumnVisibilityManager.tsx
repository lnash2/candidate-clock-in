import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings2 } from 'lucide-react';

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  required?: boolean;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: 'id', label: 'ID', visible: true },
  { key: 'title', label: 'Title', visible: true, required: true },
  { key: 'company_name', label: 'Company', visible: true },
  { key: 'company_rate_id', label: 'Company Rate', visible: true },
  { key: 'contact_name', label: 'Assigned Contact', visible: true },
  { key: 'address', label: 'Address', visible: false },
  { key: 'postcode', label: 'Postcode', visible: true },
  { key: 'recruiter_name', label: 'Recruiter', visible: true },
  { key: 'resourcer_name', label: 'Resourcer', visible: true },
  { key: 'organization_id', label: 'Organization', visible: false },
  { key: 'status_name', label: 'Status', visible: true },
  { key: 'industry_names', label: 'Industries', visible: false },
  { key: 'job_category_names', label: 'Job Categories', visible: true },
  { key: 'job_posted_at', label: 'Posted Date', visible: false },
  { key: 'created_at', label: 'Created', visible: true },
];

interface ColumnVisibilityManagerProps {
  onColumnsChange: (columns: ColumnConfig[]) => void;
}

export const ColumnVisibilityManager: React.FC<ColumnVisibilityManagerProps> = ({
  onColumnsChange
}) => {
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);

  // Load saved column preferences
  useEffect(() => {
    const saved = localStorage.getItem('vacancy-columns');
    if (saved) {
      try {
        const savedColumns = JSON.parse(saved);
        setColumns(savedColumns);
        onColumnsChange(savedColumns);
      } catch (error) {
        console.error('Failed to load column preferences:', error);
      }
    } else {
      onColumnsChange(DEFAULT_COLUMNS);
    }
  }, [onColumnsChange]);

  const toggleColumn = (key: string) => {
    const updatedColumns = columns.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    setColumns(updatedColumns);
    onColumnsChange(updatedColumns);
    localStorage.setItem('vacancy-columns', JSON.stringify(updatedColumns));
  };

  const resetToDefault = () => {
    setColumns(DEFAULT_COLUMNS);
    onColumnsChange(DEFAULT_COLUMNS);
    localStorage.removeItem('vacancy-columns');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Column Visibility</h4>
            <Button variant="ghost" size="sm" onClick={resetToDefault}>
              Reset
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {columns.map((column) => (
              <div key={column.key} className="flex items-center space-x-2">
                <Checkbox
                  id={column.key}
                  checked={column.visible}
                  onCheckedChange={() => !column.required && toggleColumn(column.key)}
                  disabled={column.required}
                />
                <label
                  htmlFor={column.key}
                  className={`text-sm ${column.required ? 'text-muted-foreground' : 'cursor-pointer'}`}
                >
                  {column.label}
                  {column.required && ' *'}
                </label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            * Required columns cannot be hidden
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};