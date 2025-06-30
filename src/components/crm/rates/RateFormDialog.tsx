
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { driverClasses, rateCategories } from './constants';
import { RateFormData } from './types';

interface RateFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formData: RateFormData;
  onFormDataChange: (data: RateFormData) => void;
  onSubmit: () => void;
}

const RateFormDialog = ({
  isOpen,
  onOpenChange,
  title,
  formData,
  onFormDataChange,
  onSubmit
}: RateFormDialogProps) => {
  const updateFormData = (field: keyof RateFormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="driver_class">Driver Class</Label>
            <Select value={formData.driver_class} onValueChange={(value) => updateFormData('driver_class', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select driver class" />
              </SelectTrigger>
              <SelectContent>
                {driverClasses.map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="rate_category">Rate Category</Label>
            <Select value={formData.rate_category} onValueChange={(value) => updateFormData('rate_category', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rateCategories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="charge_rate">Charge Rate (£/hour)</Label>
              <Input
                id="charge_rate"
                type="number"
                step="0.01"
                value={formData.charge_rate}
                onChange={(e) => updateFormData('charge_rate', e.target.value)}
                placeholder="24.00"
              />
            </div>
            <div>
              <Label htmlFor="pay_rate">Pay Rate (£/hour)</Label>
              <Input
                id="pay_rate"
                type="number"
                step="0.01"
                value={formData.pay_rate}
                onChange={(e) => updateFormData('pay_rate', e.target.value)}
                placeholder="20.00"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Rate description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valid_from">Valid From</Label>
              <Input
                id="valid_from"
                type="date"
                value={formData.valid_from}
                onChange={(e) => updateFormData('valid_from', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="valid_to">Valid To (Optional)</Label>
              <Input
                id="valid_to"
                type="date"
                value={formData.valid_to}
                onChange={(e) => updateFormData('valid_to', e.target.value)}
              />
            </div>
          </div>
          <Button onClick={onSubmit} className="w-full">
            {title === 'Add New Rate' ? 'Add Rate' : 'Update Rate'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RateFormDialog;
