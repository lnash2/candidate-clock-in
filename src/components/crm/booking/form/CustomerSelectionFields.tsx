import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Phone, Mail, User } from 'lucide-react';

interface Customer {
  id: string;
  company: string;
  contact_name?: string;
}

interface Candidate {
  id: string;
  candidate_name: string;
  phone?: string;
}

interface WorkLocation {
  id: string;
  location_name: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  is_primary?: boolean;
}

interface CustomerSelectionFormData {
  candidate_id: string;
  customer_id: string;
  work_location_id: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
}

interface CustomerSelectionFieldsProps {
  formData: CustomerSelectionFormData;
  onUpdate: (updates: Partial<CustomerSelectionFormData>) => void;
  candidates: Candidate[];
  customers: Customer[];
  workLocations: WorkLocation[];
  onCustomerChange: (customerId: string) => void;
}

const CustomerSelectionFields = ({ 
  formData, 
  onUpdate, 
  candidates, 
  customers, 
  workLocations,
  onCustomerChange 
}: CustomerSelectionFieldsProps) => {
  const handleCustomerSelect = (customerId: string) => {
    onCustomerChange(customerId);
    onUpdate({ customer_id: customerId, work_location_id: '' });
  };

  const handleWorkLocationSelect = (locationId: string) => {
    const location = workLocations.find(l => l.id === locationId);
    onUpdate({
      work_location_id: locationId,
      contact_name: location?.contact_name || '',
      contact_phone: location?.contact_phone || '',
      contact_email: location?.contact_email || ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="candidate_id">Candidate *</Label>
          <Select 
            value={formData.candidate_id} 
            onValueChange={(value) => onUpdate({ candidate_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select candidate" />
            </SelectTrigger>
            <SelectContent>
              {candidates.map(candidate => (
                <SelectItem key={candidate.id} value={candidate.id}>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{candidate.candidate_name}</span>
                    {candidate.phone && (
                      <span className="text-sm text-muted-foreground">({candidate.phone})</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="customer_id">Company *</Label>
          <Select 
            value={formData.customer_id} 
            onValueChange={handleCustomerSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {customers.map(customer => (
                <SelectItem key={customer.id} value={customer.id}>
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>{customer.company}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.customer_id && workLocations.length > 0 && (
        <div>
          <Label htmlFor="work_location_id">Work Location</Label>
          <Select 
            value={formData.work_location_id} 
            onValueChange={handleWorkLocationSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select work location" />
            </SelectTrigger>
            <SelectContent>
              {workLocations.map(location => (
                <SelectItem key={location.id} value={location.id}>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{location.location_name}</span>
                    {location.is_primary && <Badge variant="outline">Primary</Badge>}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="contact_name">Contact Name</Label>
          <Input
            id="contact_name"
            value={formData.contact_name}
            onChange={(e) => onUpdate({ contact_name: e.target.value })}
            placeholder="Contact person"
          />
        </div>

        <div>
          <Label htmlFor="contact_phone">Contact Phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="contact_phone"
              value={formData.contact_phone}
              onChange={(e) => onUpdate({ contact_phone: e.target.value })}
              placeholder="Contact phone number"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="contact_email">Contact Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => onUpdate({ contact_email: e.target.value })}
              placeholder="Contact email"
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSelectionFields;
