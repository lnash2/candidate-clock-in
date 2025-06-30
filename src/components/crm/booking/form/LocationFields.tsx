import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, AlertCircle } from 'lucide-react';

interface LocationFormData {
  pickup_location: string;
  dropoff_location: string;
  notes: string;
}

interface LocationFieldsProps {
  formData: LocationFormData;
  onUpdate: (updates: Partial<LocationFormData>) => void;
}

const LocationFields = ({ formData, onUpdate }: LocationFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pickup_location">Pickup Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-600" />
            <Input
              id="pickup_location"
              value={formData.pickup_location}
              onChange={(e) => onUpdate({ pickup_location: e.target.value })}
              placeholder="Pickup address"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="dropoff_location">Dropoff Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-red-600" />
            <Input
              id="dropoff_location"
              value={formData.dropoff_location}
              onChange={(e) => onUpdate({ dropoff_location: e.target.value })}
              placeholder="Dropoff address"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <div className="relative">
          <AlertCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Additional booking notes..."
            rows={3}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationFields;
