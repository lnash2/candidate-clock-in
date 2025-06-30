
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Trash2, Phone, Mail, User, Building } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import WorkLocationForm, { WorkLocation } from './WorkLocationForm';

interface WorkLocationsListProps {
  companyId: number;
}

const WorkLocationsList = ({ companyId }: WorkLocationsListProps) => {
  // Mock data - in real implementation, this would come from Supabase
  const [locations, setLocations] = useState<WorkLocation[]>([
    {
      id: '1',
      customer_id: companyId.toString(),
      location_name: 'Main Racecourse',
      address_line_1: 'Prestbury Park',
      address_line_2: '',
      city: 'Cheltenham',
      county: 'Gloucestershire',
      post_code: 'GL50 4SH',
      country: 'United Kingdom',
      contact_name: 'Sarah Johnson',
      contact_phone: '+44 1242 513014',
      contact_mobile: '+44 7700 900123',
      contact_email: 'sarah@cheltenham.co.uk',
      contact_position: 'Operations Manager',
      notes: 'Main contact for all racecourse operations and event coordination.',
      is_primary: true,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      customer_id: companyId.toString(),
      location_name: 'Training Facilities',
      address_line_1: 'Southam Road',
      address_line_2: 'Training Ground',
      city: 'Cheltenham',
      county: 'Gloucestershire',
      post_code: 'GL50 2LR',
      country: 'United Kingdom',
      contact_name: 'Mike Thompson',
      contact_phone: '+44 1242 513020',
      contact_mobile: '+44 7700 900124',
      contact_email: 'mike@cheltenham.co.uk',
      contact_position: 'Training Manager',
      notes: 'Responsible for training facility bookings and coordination.',
      is_primary: false,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<WorkLocation | null>(null);

  const handleAddLocation = (locationData: Partial<WorkLocation>) => {
    const newLocation: WorkLocation = {
      id: Date.now().toString(),
      customer_id: companyId.toString(),
      location_name: locationData.location_name!,
      address_line_1: locationData.address_line_1,
      address_line_2: locationData.address_line_2,
      city: locationData.city,
      county: locationData.county,
      post_code: locationData.post_code,
      country: locationData.country || 'United Kingdom',
      contact_name: locationData.contact_name!,
      contact_phone: locationData.contact_phone,
      contact_mobile: locationData.contact_mobile,
      contact_email: locationData.contact_email,
      contact_position: locationData.contact_position,
      notes: locationData.notes,
      is_primary: locationData.is_primary || false,
      is_active: locationData.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setLocations([...locations, newLocation]);
    setIsAddDialogOpen(false);
  };

  const handleEditLocation = (locationData: Partial<WorkLocation>) => {
    if (!editingLocation) return;

    const updatedLocations = locations.map(location =>
      location.id === editingLocation.id
        ? {
            ...location,
            ...locationData,
            updated_at: new Date().toISOString()
          }
        : location
    );

    setLocations(updatedLocations);
    setEditingLocation(null);
  };

  const handleDeleteLocation = (locationId: string) => {
    setLocations(locations.filter(location => location.id !== locationId));
  };

  const formatAddress = (location: WorkLocation) => {
    const parts = [
      location.address_line_1,
      location.address_line_2,
      location.city,
      location.county,
      location.post_code
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Work Locations</h3>
          <p className="text-sm text-muted-foreground">
            Manage multiple work locations and their designated contacts
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Work Location</DialogTitle>
            </DialogHeader>
            <WorkLocationForm
              companyId={companyId}
              onSave={handleAddLocation}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {locations.map(location => (
          <Card key={location.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Building className="w-5 h-5 text-blue-600" />
                      <h4 className="text-lg font-semibold">{location.location_name}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      {location.is_primary && (
                        <Badge variant="default">Primary</Badge>
                      )}
                      <Badge variant={location.is_active ? "secondary" : "outline"}>
                        {location.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="text-sm">
                          <div className="font-medium">Address</div>
                          <div className="text-muted-foreground">
                            {formatAddress(location) || 'No address provided'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <User className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="text-sm">
                          <div className="font-medium">Site Contact</div>
                          <div>{location.contact_name}</div>
                          {location.contact_position && (
                            <div className="text-muted-foreground">{location.contact_position}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {(location.contact_phone || location.contact_mobile || location.contact_email) && (
                      <div className="space-y-1">
                        <div className="font-medium text-sm">Contact Details</div>
                        {location.contact_phone && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <span>{location.contact_phone}</span>
                          </div>
                        )}
                        {location.contact_mobile && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <span>{location.contact_mobile} (Mobile)</span>
                          </div>
                        )}
                        {location.contact_email && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            <span>{location.contact_email}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {location.notes && (
                      <div className="space-y-1">
                        <div className="font-medium text-sm">Notes</div>
                        <div className="text-sm text-muted-foreground">{location.notes}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Dialog open={editingLocation?.id === location.id} onOpenChange={(open) => !open && setEditingLocation(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingLocation(location)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Work Location</DialogTitle>
                      </DialogHeader>
                      <WorkLocationForm
                        companyId={companyId}
                        location={editingLocation || undefined}
                        onSave={handleEditLocation}
                        onCancel={() => setEditingLocation(null)}
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteLocation(location.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {locations.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Work Locations</h3>
              <p className="text-muted-foreground mb-4">
                Add work locations to track different sites and their contacts for this company.
              </p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Location
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Work Location</DialogTitle>
                  </DialogHeader>
                  <WorkLocationForm
                    companyId={companyId}
                    onSave={handleAddLocation}
                    onCancel={() => setIsAddDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkLocationsList;
