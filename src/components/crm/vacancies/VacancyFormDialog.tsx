import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVacancies } from '@/hooks/useVacancies';
import { useCompanies } from '@/hooks/useCompanies';
import { useContacts } from '@/hooks/useContacts';
import { toast } from 'sonner';

interface VacancyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacancy?: any;
}

const VacancyFormDialog = ({ open, onOpenChange, vacancy }: VacancyFormDialogProps) => {
  const { createVacancy, updateVacancy, statuses } = useVacancies();
  const { companies } = useCompanies();
  const { contacts } = useContacts();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company_id: '',
    assigned_contact_id: '',
    vacancy_status_id: '',
    created_by_user_id: 1, // Default user ID
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vacancy) {
      setFormData({
        title: vacancy.title || '',
        description: vacancy.description || '',
        company_id: vacancy.company_id?.toString() || '',
        assigned_contact_id: vacancy.assigned_contact_id?.toString() || '',
        vacancy_status_id: vacancy.vacancy_status_id?.toString() || '',
        created_by_user_id: vacancy.created_by_user_id || 1,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        company_id: '',
        assigned_contact_id: '',
        vacancy_status_id: '',
        created_by_user_id: 1,
      });
    }
  }, [vacancy, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        company_id: formData.company_id ? parseInt(formData.company_id) : null,
        assigned_contact_id: formData.assigned_contact_id ? parseInt(formData.assigned_contact_id) : null,
        vacancy_status_id: formData.vacancy_status_id ? parseInt(formData.vacancy_status_id) : null,
        address_id: null,
        recruiter_id: null,
        resourcer_id: null,
        job_posted_at: null,
        company_rate_id: null,
        industry_ids: null,
        job_category_ids: null,
        organization_id: null,
      };

      if (vacancy) {
        await updateVacancy(vacancy.id, submitData);
      } else {
        await createVacancy(submitData);
      }
      
      onOpenChange(false);
    } catch (error) {
      toast.error(`Failed to ${vacancy ? 'update' : 'create'} vacancy`);
    } finally {
      setLoading(false);
    }
  };

  // Filter contacts by selected company
  const filteredContacts = formData.company_id 
    ? contacts.filter(contact => contact.company_id?.toString() === formData.company_id)
    : contacts;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {vacancy ? 'Edit Vacancy' : 'Create New Vacancy'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter job title"
                required
              />
            </div>

            <div>
              <Label htmlFor="company_id">Company</Label>
              <Select 
                value={formData.company_id} 
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  company_id: value,
                  assigned_contact_id: '' // Reset contact when company changes
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="assigned_contact_id">Assigned Contact</Label>
              <Select 
                value={formData.assigned_contact_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_contact_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent>
                  {filteredContacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id.toString()}>
                      {contact.name || contact.contact_name || 'Unnamed Contact'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vacancy_status_id">Status</Label>
              <Select 
                value={formData.vacancy_status_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, vacancy_status_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter job description"
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (vacancy ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VacancyFormDialog;