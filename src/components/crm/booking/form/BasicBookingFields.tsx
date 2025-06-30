
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock } from 'lucide-react';

interface BasicBookingFieldsProps {
  formData: {
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    role: string;
    driver_class: string;
    booking_type: string;
    day_type: string;
    booking_status: string;
  };
  onUpdate: (updates: Partial<typeof formData>) => void;
}

const BasicBookingFields = ({ formData, onUpdate }: BasicBookingFieldsProps) => {
  const driverClasses = ['Class 1', 'Class 2', 'Class 3', 'Specialist', 'Trainee'];
  
  const dayTypes = [
    { value: 'weekday', label: 'Weekday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
    { value: 'bank_holiday', label: 'Bank Holiday' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="start_date">Start Date *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => onUpdate({ start_date: e.target.value })}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="start_time">Start Time *</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="start_time"
              type="time"
              value={formData.start_time}
              onChange={(e) => onUpdate({ start_time: e.target.value })}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="end_date">End Date *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => onUpdate({ end_date: e.target.value })}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="end_time">End Time *</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="end_time"
              type="time"
              value={formData.end_time}
              onChange={(e) => onUpdate({ end_time: e.target.value })}
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">Role *</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => onUpdate({ role: e.target.value })}
            placeholder="e.g., Horse Transport Driver"
            required
          />
        </div>

        <div>
          <Label htmlFor="driver_class">Driver Class *</Label>
          <Select 
            value={formData.driver_class} 
            onValueChange={(value) => onUpdate({ driver_class: value })}
          >
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="booking_type">Shift Type *</Label>
          <Select 
            value={formData.booking_type} 
            onValueChange={(value) => onUpdate({ booking_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day_shift">Day Shift</SelectItem>
              <SelectItem value="night_shift">Night Shift</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="day_type">Day Type *</Label>
          <Select 
            value={formData.day_type} 
            onValueChange={(value) => onUpdate({ day_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dayTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="booking_status">Status</Label>
          <Select 
            value={formData.booking_status} 
            onValueChange={(value) => onUpdate({ booking_status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BasicBookingFields;
