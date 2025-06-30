
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Trash2, Phone, Mail, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export interface WorkLocation {
  id: string;
  customer_id: string;
  location_name: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  county?: string;
  post_code?: string;
  country: string;
  contact_name: string;
  contact_phone?: string;
  contact_mobile?: string;
  contact_email?: string;
  contact_position?: string;
  notes?: string;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface WorkLocationFormProps {
  companyId: number;
  location?: WorkLocation;
  onSave: (location: Partial<WorkLocation>) => void;
  onCancel: () => void;
}

const WorkLocationForm = ({ companyId, location, onSave, onCancel }: WorkLocationFormProps) => {
  const [formData, setFormData] = useState({
    location_name: location?.location_name || '',
    address_line_1: location?.address_line_1 || '',
    address_line_2: location?.address_line_2 || '',
    city: location?.city || '',
    county: location?.county || '',
    post_code: location?.post_code || '',
    country: location?.country || 'United Kingdom',
    contact_name: location?.contact_name || '',
    contact_phone: location?.contact_phone || '',
    contact_mobile: location?.contact_mobile || '',
    contact_email: location?.contact_email || '',
    contact_position: location?.contact_position || '',
    notes: location?.notes || '',
    is_primary: location?.is_primary || false,
    is_active: location?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      customer_id: companyId.toString()
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location_name">Location Name *</Label>
          <Input
            id="location_name"
            value={formData.location_name}
            onChange={(e) => handleInputChange('location_name', e.target.value)}
            placeholder="e.g. Main Office, Warehouse 1"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact_name">Contact Name *</Label>
          <Input
            id="contact_name"
            value={formData.contact_name}
            onChange={(e) => handleInputChange('contact_name', e.target.value)}
            placeholder="Site contact person"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Address Information</h4>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address_line_1">Address Line 1</Label>
            <Input
              id="address_line_1"
              value={formData.address_line_1}
              onChange={(e) => handleInputChange('address_line_1', e.target.value)}
              placeholder="Street address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address_line_2">Address Line 2</Label>
            <Input
              id="address_line_2"
              value={formData.address_line_2}
              onChange={(e) => handleInputChange('address_line_2', e.target.value)}
              placeholder="Building, suite, etc."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="county">County</Label>
              <Input
                id="county"
                value={formData.county}
                onChange={(e) => handleInputChange('county', e.target.value)}
                placeholder="County"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="post_code">Post Code</Label>
              <Input
                id="post_code"
                value={formData.post_code}
                onChange={(e) => handleInputChange('post_code', e.target.value)}
                placeholder="Post code"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact_position">Position/Role</Label>
            <Input
              id="contact_position"
              value={formData.contact_position}
              onChange={(e) => handleInputChange('contact_position', e.target.value)}
              placeholder="e.g. Site Manager, Operations Lead"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact_email">Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleInputChange('contact_email', e.target.value)}
              placeholder="contact@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact_phone">Phone</Label>
            <Input
              id="contact_phone"
              value={formData.contact_phone}
              onChange={(e) => handleInputChange('contact_phone', e.target.value)}
              placeholder="Office phone"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact_mobile">Mobile</Label>
            <Input
              id="contact_mobile"
              value={formData.contact_mobile}
              onChange={(e) => handleInputChange('contact_mobile', e.target.value)}
              placeholder="Mobile phone"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Additional notes about this location"
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_primary"
            checked={formData.is_primary}
            onCheckedChange={(checked) => handleInputChange('is_primary', checked as boolean)}
          />
          <Label htmlFor="is_primary">Primary Location</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => handleInputChange('is_active', checked as boolean)}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {location ? 'Update Location' : 'Add Location'}
        </Button>
      </div>
    </form>
  );
};

export default WorkLocationForm;
