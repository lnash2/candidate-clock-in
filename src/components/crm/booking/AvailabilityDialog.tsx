
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface AvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateId: string;
  candidateName: string;
  initialDate?: Date;
  onSaveAvailability: (candidateId: string, startDate: Date, endDate: Date, available: boolean) => void;
}

const AvailabilityDialog = ({ 
  open, 
  onOpenChange, 
  candidateId, 
  candidateName,
  initialDate,
  onSaveAvailability 
}: AvailabilityDialogProps) => {
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'unavailable'>('available');
  const [startDate, setStartDate] = useState<Date | undefined>(initialDate || new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(initialDate || new Date());

  const handleSave = () => {
    if (startDate && endDate) {
      onSaveAvailability(candidateId, startDate, endDate, availabilityStatus === 'available');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setAvailabilityStatus('available');
    setStartDate(initialDate || new Date());
    setEndDate(initialDate || new Date());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Set Availability for {candidateName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Availability Status Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Availability Status</Label>
            <RadioGroup
              value={availabilityStatus}
              onValueChange={(value) => setAvailabilityStatus(value as 'available' | 'unavailable')}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="available" id="available" />
                <Label htmlFor="available" className="text-green-600 font-medium">Available</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unavailable" id="unavailable" />
                <Label htmlFor="unavailable" className="text-red-600 font-medium">Unavailable</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date Range Selection */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Start Date</Label>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="rounded-md border"
              />
              {startDate && (
                <p className="text-sm text-gray-600">
                  Selected: {format(startDate, 'MMM dd, yyyy')}
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <Label className="text-base font-medium">End Date</Label>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                className="rounded-md border"
                disabled={(date) => startDate ? date < startDate : false}
              />
              {endDate && (
                <p className="text-sm text-gray-600">
                  Selected: {format(endDate, 'MMM dd, yyyy')}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!startDate || !endDate}
              className={availabilityStatus === 'available' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              Set {availabilityStatus === 'available' ? 'Available' : 'Unavailable'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityDialog;
