import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useVacancies } from '@/hooks/useVacancies';
import { useCompanies } from '@/hooks/useCompanies';
import { useContacts } from '@/hooks/useContacts';
import { Filter, X } from 'lucide-react';

const VacancyFilters = () => {
  const { filters, applyFilters, statuses } = useVacancies();
  const { companies } = useCompanies();
  const { contacts } = useContacts();
  
  const [localFilters, setLocalFilters] = useState(filters);
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = () => {
    applyFilters(localFilters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      status_id: '',
      company_id: '',
      assigned_contact_id: ''
    };
    setLocalFilters(emptyFilters);
    applyFilters(emptyFilters);
    setIsOpen(false);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 rounded-full bg-primary text-primary-foreground px-1.5 py-0.5 text-xs">
              {Object.values(filters).filter(v => v !== '').length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter Vacancies</h4>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-auto p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={localFilters.status_id}
                onValueChange={(value) => 
                  setLocalFilters(prev => ({ ...prev, status_id: value }))
                }
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="company-filter">Company</Label>
              <Select
                value={localFilters.company_id}
                onValueChange={(value) => 
                  setLocalFilters(prev => ({ ...prev, company_id: value }))
                }
              >
                <SelectTrigger id="company-filter">
                  <SelectValue placeholder="All companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All companies</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contact-filter">Assigned Contact</Label>
              <Select
                value={localFilters.assigned_contact_id}
                onValueChange={(value) => 
                  setLocalFilters(prev => ({ ...prev, assigned_contact_id: value }))
                }
              >
                <SelectTrigger id="contact-filter">
                  <SelectValue placeholder="All contacts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All contacts</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id.toString()}>
                      {contact.name || contact.contact_name || 'Unnamed Contact'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleClearFilters}
            >
              Clear
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={handleApplyFilters}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VacancyFilters;