
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { CandidateFormData } from './types';
import { registrationStatuses, onboardingStatuses, activeStatuses, preferredShifts, payrollTypes } from './constants';

interface CandidateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CandidateFormData) => void;
  candidate?: CandidateFormData;
  mode: 'create' | 'edit';
}

const CandidateFormDialog = ({ open, onOpenChange, onSubmit, candidate, mode }: CandidateFormDialogProps) => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<CandidateFormData>({
    defaultValues: candidate || {
      candidate_name: '',
      email: '',
      phone: '',
      address: '',
      postcode: '',
      national_insurance_no: '',
      preferred_shift: '',
      job_title: '',
      registration_status: 'Pre-Registered',
      registration_type: '',
      onboarding_status: 'Pending',
      active_status: 'Active',
      department_tags: [],
      industries: [],
      job_categories: [],
      recruiter: '',
      resourcer: '',
      payroll_type: 'PAYE',
      portal_access_enabled: false
    }
  });

  const portalAccessEnabled = watch('portal_access_enabled');

  const handleFormSubmit = (data: CandidateFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Candidate' : 'Edit Candidate'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="candidate_name">Full Name *</Label>
              <Input
                id="candidate_name"
                {...register('candidate_name', { required: 'Name is required' })}
                placeholder="Enter full name"
              />
              {errors.candidate_name && (
                <p className="text-sm text-red-600">{errors.candidate_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="candidate@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+44 1234 567890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                {...register('job_title')}
                placeholder="Enter job title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="national_insurance_no">National Insurance Number</Label>
              <Input
                id="national_insurance_no"
                {...register('national_insurance_no')}
                placeholder="AB123456C"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode</Label>
              <Input
                id="postcode"
                {...register('postcode')}
                placeholder="SW1A 1AA"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="Enter full address"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferred_shift">Preferred Shift</Label>
              <Select onValueChange={(value) => setValue('preferred_shift', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred shift" />
                </SelectTrigger>
                <SelectContent>
                  {preferredShifts.map((shift) => (
                    <SelectItem key={shift} value={shift}>
                      {shift}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payroll_type">Payroll Type</Label>
              <Select onValueChange={(value) => setValue('payroll_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payroll type" />
                </SelectTrigger>
                <SelectContent>
                  {payrollTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registration_status">Registration Status</Label>
              <Select onValueChange={(value) => setValue('registration_status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {registrationStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="onboarding_status">Onboarding Status</Label>
              <Select onValueChange={(value) => setValue('onboarding_status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {onboardingStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="active_status">Active Status</Label>
              <Select onValueChange={(value) => setValue('active_status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {activeStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recruiter">Recruiter</Label>
              <Input
                id="recruiter"
                {...register('recruiter')}
                placeholder="Enter recruiter name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resourcer">Resourcer</Label>
              <Input
                id="resourcer"
                {...register('resourcer')}
                placeholder="Enter resourcer name"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={portalAccessEnabled}
              onCheckedChange={(checked) => setValue('portal_access_enabled', checked)}
            />
            <Label htmlFor="portal_access">Enable Portal Access</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Create Candidate' : 'Update Candidate'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateFormDialog;
