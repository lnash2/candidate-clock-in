import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export interface FilterState {
  status_id: string;
  company_id: string;
  assigned_contact_id: string;
  recruiter_id: string;
  resourcer_id: string;
  industry_id: string;
  job_category_id: string;
  organization_id: string;
  postcode: string;
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
  const [statuses, setStatuses] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [jobCategories, setJobCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [statusesData, companiesData, contactsData, usersData, industriesData, jobCategoriesData] = await Promise.all([
          supabase.from('vacancy_statuses').select('id, name').order('name'),
          supabase.from('companies').select('id, name').order('name'),
          supabase.from('contacts').select('id, name').order('name'),
          supabase.from('candidates').select('recruiter_id, resourcer_id').neq('recruiter_id', null).neq('resourcer_id', null),
          supabase.from('industry_types').select('id, name').order('name'),
          supabase.from('job_categories').select('id, name').order('name')
        ]);

        setStatuses(statusesData.data || []);
        setCompanies(companiesData.data || []);
        setContacts(contactsData.data || []);
        setIndustries(industriesData.data || []);
        setJobCategories(jobCategoriesData.data || []);

        // Extract unique user IDs for recruiters/resourcers
        const uniqueUserIds = new Set<number>();
        usersData.data?.forEach(item => {
          if (item.recruiter_id) uniqueUserIds.add(item.recruiter_id);
          if (item.resourcer_id) uniqueUserIds.add(item.resourcer_id);
        });

        // Create user objects (in a real app, you'd fetch from a users table)
        const usersList = Array.from(uniqueUserIds).map(id => ({
          id,
          name: `User ${id}`
        }));
        
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilterData();
  }, []);

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-4">
          <Select value={filters.status_id} onValueChange={(value) => updateFilter('status_id', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status.id} value={status.id.toString()}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.company_id} onValueChange={(value) => updateFilter('company_id', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.assigned_contact_id} onValueChange={(value) => updateFilter('assigned_contact_id', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Contact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contacts</SelectItem>
              {contacts.map((contact) => (
                <SelectItem key={contact.id} value={contact.id.toString()}>
                  {contact.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.recruiter_id} onValueChange={(value) => updateFilter('recruiter_id', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Recruiter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Recruiters</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.resourcer_id} onValueChange={(value) => updateFilter('resourcer_id', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Resourcer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resourcers</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.industry_id} onValueChange={(value) => updateFilter('industry_id', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry.id} value={industry.id.toString()}>
                  {industry.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.job_category_id} onValueChange={(value) => updateFilter('job_category_id', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Job Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {jobCategories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Postcode"
            value={filters.postcode}
            onChange={(e) => updateFilter('postcode', e.target.value)}
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