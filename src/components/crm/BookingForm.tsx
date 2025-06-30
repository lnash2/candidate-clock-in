import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, DollarSign, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BookingFormProps {
  customerId: string;
  onSubmit: (bookingData: any) => void;
  onCancel: () => void;
}

const BookingForm = ({ customerId, onSubmit, onCancel }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    pickup_location: '',
    dropoff_location: '',
    driver_class: '',
    booking_type: 'open',
    is_night_shift: false,
    notes: '',
    candidate_id: null as string | null,
    vehicle_id: null as string | null
  });

  const [ratePreview, setRatePreview] = useState<any>(null);

  const driverClasses = ['Class 1', 'Class 2', 'Class 3', 'Specialist', 'Trainee'];
  const bookingTypes = [
    { value: 'open', label: 'Open Booking', description: 'Create booking without assigning a candidate' },
    { value: 'assigned', label: 'Assigned Booking', description: 'Create booking and assign a candidate immediately' }
  ];

  // Mock candidates for assignment
  const availableCandidates = [
    { id: 'cand-001', name: 'John Smith', driverClass: 'Class 1', availability: 'Available' },
    { id: 'cand-002', name: 'Sarah Johnson', driverClass: 'Class 2', availability: 'Available' },
    { id: 'cand-003', name: 'Mike Thompson', driverClass: 'Class 1', availability: 'Busy until Jan 20' }
  ];

  // Mock vehicles
  const availableVehicles = [
    { id: 'veh-001', name: 'Mercedes Sprinter - ABC123', capacity: '8 horses', status: 'Available' },
    { id: 'veh-002', name: 'Ford Transit - DEF456', capacity: '6 horses', status: 'Available' },
    { id: 'veh-003', name: 'Iveco Daily - GHI789', capacity: '4 horses', status: 'In use until Jan 18' }
  ];

  // Mock rate data - this would come from your company_rates table
  const companyRates = {
    'Class 1': {
      days: { charge_rate: 24.00, pay_rate: 20.00 },
      nights: { charge_rate: 27.60, pay_rate: 23.00 },
      saturday: { charge_rate: 26.40, pay_rate: 22.00 },
      sunday: { charge_rate: 28.80, pay_rate: 24.00 }
    },
    'Class 2': {
      days: { charge_rate: 22.00, pay_rate: 18.00 },
      nights: { charge_rate: 25.30, pay_rate: 21.00 },
      saturday: { charge_rate: 24.20, pay_rate: 20.00 },
      sunday: { charge_rate: 26.40, pay_rate: 22.00 }
    }
  };

  const calculateRates = () => {
    if (!formData.start_date || !formData.end_date || !formData.driver_class) {
      setRatePreview(null);
      return;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const rates = companyRates[formData.driver_class as keyof typeof companyRates];
    
    if (!rates) {
      setRatePreview(null);
      return;
    }

    const dailyRates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
      let selectedRate;
      let rateName;

      if (formData.is_night_shift) {
        selectedRate = rates.nights;
        rateName = 'Night Rate';
      } else {
        if (dayOfWeek === 0) { // Sunday
          selectedRate = rates.sunday || rates.days;
          rateName = rates.sunday ? 'Sunday Rate' : 'Days Rate (fallback)';
        } else if (dayOfWeek === 6) { // Saturday
          selectedRate = rates.saturday || rates.days;
          rateName = rates.saturday ? 'Saturday Rate' : 'Days Rate (fallback)';
        } else { // Monday-Friday
          selectedRate = rates.days;
          rateName = 'Days Rate';
        }
      }

      dailyRates.push({
        date: currentDate.toISOString().split('T')[0],
        dayName: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
        rateName,
        charge_rate: selectedRate.charge_rate,
        pay_rate: selectedRate.pay_rate,
        margin: selectedRate.charge_rate - selectedRate.pay_rate
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const totalChargeRate = dailyRates.reduce((sum, day) => sum + day.charge_rate, 0);
    const totalPayRate = dailyRates.reduce((sum, day) => sum + day.pay_rate, 0);
    const totalMargin = totalChargeRate - totalPayRate;

    setRatePreview({
      dailyRates,
      totalChargeRate,
      totalPayRate,
      totalMargin,
      totalDays: dailyRates.length
    });
  };

  React.useEffect(() => {
    calculateRates();
  }, [formData.start_date, formData.end_date, formData.driver_class, formData.is_night_shift]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      customer_id: customerId,
      rate_preview: ratePreview,
      status: formData.booking_type === 'open' ? 'open' : 'pending'
    });
  };

  const isFormValid = () => {
    const requiredFields = ['start_date', 'end_date', 'pickup_location', 'dropoff_location', 'driver_class'];
    const hasRequiredFields = requiredFields.every(field => formData[field as keyof typeof formData]);
    
    if (formData.booking_type === 'assigned') {
      return hasRequiredFields && formData.candidate_id && formData.vehicle_id;
    }
    
    return hasRequiredFields && ratePreview;
  };

  return (
    <div className="space-y-6">
      <Tabs value={formData.booking_type} onValueChange={(value) => setFormData({...formData, booking_type: value})}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="open">Open Booking</TabsTrigger>
          <TabsTrigger value="assigned">Assigned Booking</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Open Booking</CardTitle>
              <p className="text-sm text-muted-foreground">
                Create a booking that will be available for candidate assignment later.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pickup_location">Pickup Location</Label>
                  <Input
                    id="pickup_location"
                    value={formData.pickup_location}
                    onChange={(e) => setFormData({...formData, pickup_location: e.target.value})}
                    placeholder="Enter pickup address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dropoff_location">Dropoff Location</Label>
                  <Input
                    id="dropoff_location"
                    value={formData.dropoff_location}
                    onChange={(e) => setFormData({...formData, dropoff_location: e.target.value})}
                    placeholder="Enter dropoff address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="driver_class">Driver Class Required</Label>
                  <Select value={formData.driver_class} onValueChange={(value) => setFormData({...formData, driver_class: value})}>
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

                <div className="flex items-center space-x-2 p-4 border rounded-lg bg-gray-50">
                  <Switch
                    id="is_night_shift"
                    checked={formData.is_night_shift}
                    onCheckedChange={(checked) => setFormData({...formData, is_night_shift: checked})}
                  />
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <Label htmlFor="is_night_shift" className="font-medium">Night Shift</Label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formData.is_night_shift ? 'Night rates will be applied to all days' : 'Day rates will be applied based on day of week'}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Additional booking notes"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!isFormValid()}>
                    Create {formData.booking_type === 'open' ? 'Open' : 'Assigned'} Booking
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Assigned Booking</CardTitle>
              <p className="text-sm text-muted-foreground">
                Create a booking and assign a candidate and vehicle immediately.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pickup_location">Pickup Location</Label>
                  <Input
                    id="pickup_location"
                    value={formData.pickup_location}
                    onChange={(e) => setFormData({...formData, pickup_location: e.target.value})}
                    placeholder="Enter pickup address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dropoff_location">Dropoff Location</Label>
                  <Input
                    id="dropoff_location"
                    value={formData.dropoff_location}
                    onChange={(e) => setFormData({...formData, dropoff_location: e.target.value})}
                    placeholder="Enter dropoff address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="driver_class">Driver Class Required</Label>
                  <Select value={formData.driver_class} onValueChange={(value) => setFormData({...formData, driver_class: value})}>
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

                <div className="flex items-center space-x-2 p-4 border rounded-lg bg-gray-50">
                  <Switch
                    id="is_night_shift"
                    checked={formData.is_night_shift}
                    onCheckedChange={(checked) => setFormData({...formData, is_night_shift: checked})}
                  />
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <Label htmlFor="is_night_shift" className="font-medium">Night Shift</Label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formData.is_night_shift ? 'Night rates will be applied to all days' : 'Day rates will be applied based on day of week'}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Additional booking notes"
                  />
                </div>
              
              {/* Additional fields for assigned bookings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="candidate_id">Assign Candidate</Label>
                  <Select 
                    value={formData.candidate_id || ''} 
                    onValueChange={(value) => setFormData({...formData, candidate_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select candidate" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCandidates
                        .filter(candidate => candidate.driverClass === formData.driver_class || !formData.driver_class)
                        .map(candidate => (
                          <SelectItem key={candidate.id} value={candidate.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{candidate.name}</span>
                              <Badge variant={candidate.availability === 'Available' ? 'default' : 'secondary'} className="ml-2">
                                {candidate.availability}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="vehicle_id">Assign Vehicle</Label>
                  <Select 
                    value={formData.vehicle_id || ''} 
                    onValueChange={(value) => setFormData({...formData, vehicle_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{vehicle.name}</span>
                            <Badge variant={vehicle.status === 'Available' ? 'default' : 'secondary'} className="ml-2">
                              {vehicle.status}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!isFormValid()}>
                    Create {formData.booking_type === 'open' ? 'Open' : 'Assigned'} Booking
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Common form fields */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pickup_location">Pickup Location</Label>
              <Input
                id="pickup_location"
                value={formData.pickup_location}
                onChange={(e) => setFormData({...formData, pickup_location: e.target.value})}
                placeholder="Enter pickup address"
                required
              />
            </div>

            <div>
              <Label htmlFor="dropoff_location">Dropoff Location</Label>
              <Input
                id="dropoff_location"
                value={formData.dropoff_location}
                onChange={(e) => setFormData({...formData, dropoff_location: e.target.value})}
                placeholder="Enter dropoff address"
                required
              />
            </div>

            <div>
              <Label htmlFor="driver_class">Driver Class Required</Label>
              <Select value={formData.driver_class} onValueChange={(value) => setFormData({...formData, driver_class: value})}>
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

            <div className="flex items-center space-x-2 p-4 border rounded-lg bg-gray-50">
              <Switch
                id="is_night_shift"
                checked={formData.is_night_shift}
                onCheckedChange={(checked) => setFormData({...formData, is_night_shift: checked})}
              />
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <Label htmlFor="is_night_shift" className="font-medium">Night Shift</Label>
              </div>
              <div className="text-sm text-muted-foreground">
                {formData.is_night_shift ? 'Night rates will be applied to all days' : 'Day rates will be applied based on day of week'}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional booking notes"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isFormValid()}>
                Create {formData.booking_type === 'open' ? 'Open' : 'Assigned'} Booking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {ratePreview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Rate Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">£{ratePreview.totalChargeRate.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Total Charge Rate</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">£{ratePreview.totalPayRate.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Total Pay Rate</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">£{ratePreview.totalMargin.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Total Margin</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Daily Rate Breakdown</h4>
                {ratePreview.dailyRates.map((day: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{day.dayName}</div>
                        <div className="text-sm text-muted-foreground">{day.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{day.rateName}</Badge>
                      <div className="text-right">
                        <div className="font-medium">£{day.charge_rate.toFixed(2)} / £{day.pay_rate.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Margin: £{day.margin.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingForm;
