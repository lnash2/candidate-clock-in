import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterState {
  active_status: string;
  onboarding_status: string;
  registration_status: string;
  payroll_type: string;
  recruiter: string;
  resourcer: string;
  postcode: string;
  job_title: string;
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const activeFilterCount = Object.values(filters).filter(value => value && value !== 'all').length;

  const getActiveFilters = () => {
    return Object.entries(filters)
      .filter(([_, value]) => value && value !== 'all')
      .map(([key, value]) => ({ key, value }));
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">
                {activeFilterCount}
              </Badge>
            )}
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        )}
      </div>

      <CollapsibleContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
          <Select value={filters.active_status} onValueChange={(value) => updateFilter('active_status', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.onboarding_status} onValueChange={(value) => updateFilter('onboarding_status', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Onboarding" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Onboarding</SelectItem>
              <SelectItem value="Complete">Complete</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.registration_status} onValueChange={(value) => updateFilter('registration_status', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Registration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Registration</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.payroll_type} onValueChange={(value) => updateFilter('payroll_type', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Payroll" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payroll</SelectItem>
              <SelectItem value="PAYE">PAYE</SelectItem>
              <SelectItem value="Umbrella">Umbrella</SelectItem>
              <SelectItem value="CIS">CIS</SelectItem>
              <SelectItem value="Ltd">Ltd Company</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Postcode"
            value={filters.postcode}
            onChange={(e) => updateFilter('postcode', e.target.value)}
            className="h-8"
          />

          <Input
            placeholder="Job Title"
            value={filters.job_title}
            onChange={(e) => updateFilter('job_title', e.target.value)}
            className="h-8"
          />
        </div>

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-1">
            {getActiveFilters().map(({ key, value }) => (
              <Badge key={key} variant="secondary" className="flex items-center gap-1 text-xs h-6">
                {key.replace('_', ' ')}: {value}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter(key as keyof FilterState, 'all')}
                />
              </Badge>
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};