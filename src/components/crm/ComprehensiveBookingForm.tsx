
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, DollarSign, User, Building2, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ComprehensiveBookingFormProps {
  onSubmit: (bookingData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const ComprehensiveBookingForm = ({ onSubmit, onCancel, initialData }: ComprehensiveBookingFormProps) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [workLocations, setWorkLocations] = useState<any[]>([]);
  const [companyRates, setCompanyRates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    candidate_id: '',
    customer_id: '',
    work_location_id: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    role: '',
    job_categories: [] as string[],
    booking_type: 'day_shift',
    booking_status: 'pending',
    start_date: '',
    start_time: '09:00',
    end_date: '',
    end_time: '17:00',
    day_type: 'weekday',
    driver_class: '',
    pay_rate: '',
    amended_pay_rate: '',
    charge_rate: '',
    holiday_accrual: false,
    expenses: '',
    notes: '',
    pickup_location: '',
    dropoff_location: ''
  });

  const [ratePreview, setRatePreview] = useState<any>(null);

  const jobCategories = [
    'Horse Transport',
    'Livestock Transport',
    'Racing Events',
    'Training Facilities',
    'Veterinary Transport',
    'Competition Events'
  ];

  const dayTypes = [
    { value: 'weekday', label: 'Weekday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
    { value: 'bank_holiday', label: 'Bank Holiday' }
  ];

  const driverClasses = ['Class 1', 'Class 2', 'Class 3', 'Specialist', 'Trainee'];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.customer_id) {
      fetchWorkLocations(formData.customer_id);
    }
  }, [formData.customer_id]);

  useEffect(() => {
    calculateRates();
  }, [formData.customer_id, formData.driver_class, formData.day_type, formData.booking_type]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch candidates
      const { data: candidatesData, error: candidatesError } = await supabase
        .from('candidates_prod')
        .select('*')
        .eq('active_status', 'Active')
        .order('candidate_name');

      if (candidatesError) throw candidatesError;

      // Fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers_prod')
        .select('*')
        .order('company');

      if (customersError) throw customersError;

      // Fetch company rates
      const { data: ratesData, error: ratesError } = await supabase
        .from('company_rates_prod')
        .select('*')
        .eq('is_active', true);

      if (ratesError) throw ratesError;

      setCandidates(candidatesData || []);
      setCustomers(customersData || []);
      setCompanyRates(ratesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load booking data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkLocations = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('work_locations_prod')
        .select('*')
        .eq('customer_id', customerId)
        .eq('is_active', true)
        .order('location_name');

      if (error) throw error;
      setWorkLocations(data || []);
    } catch (error) {
      console.error('Error fetching work locations:', error);
    }
  };

  const calculateRates = () => {
    if (!formData.customer_id || !formData.driver_class) {
      setRatePreview(null);
      return;
    }

    // Find applicable rate from company_rates table
    const applicableRate = companyRates.find(rate => 
      rate.customer_id === formData.customer_id && 
      rate.driver_class === formData.driver_class &&
      rate.rate_category === getRateCategory()
    );

    if (applicableRate) {
      const chargeRate = applicableRate.charge_rate;
      const payRate = applicableRate.pay_rate;
      const margin = chargeRate - payRate;
      const marginPercent = (margin / chargeRate) * 100;

      setRatePreview({
        charge_rate: chargeRate,
        pay_rate: payRate,
        margin: margin,
        margin_percent: marginPercent,
        rate_description: applicableRate.description || 'Standard rate'
      });

      // Auto-populate rate fields
      setFormData(prev => ({
        ...prev,
        charge_rate: chargeRate.toString(),
        pay_rate: payRate.toString()
      }));
    } else {
      setRatePreview(null);
    }
  };

  const getRateCategory = () => {
    if (formData.booking_type === 'night_shift') return 'nights';
    if (formData.day_type === 'saturday') return 'saturday';
    if (formData.day_type === 'sunday') return 'sunday';
    return 'days';
  };

  const selectedCustomer = customers.find(c => c.id === formData.customer_id);
  const selectedCandidate = candidates.find(c => c.id === formData.candidate_id);
  const selectedWorkLocation = workLocations.find(l => l.id === formData.work_location_id);

  const handleJobCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      job_categories: prev.job_categories.includes(category)
        ? prev.job_categories.filter(c => c !== category)
        : [...prev.job_categories, category]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingData = {
      ...formData,
      customer_name: selectedCustomer?.company || '',
      candidate_name: selectedCandidate?.candidate_name || '',
      work_location: selectedWorkLocation?.location_name || '',
      rate_preview: ratePreview,
      total_duration: calculateDuration(),
      status: formData.booking_status
    };

    onSubmit(bookingData);
  };

  const calculateDuration = () => {
    if (!formData.start_date || !formData.end_date || !formData.start_time || !formData.end_time) {
      return 0;
    }
    
    const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
    const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);
    
    return (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60); // hours
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading booking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Create Comprehensive Booking</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Candidate Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="candidate_id">Candidate *</Label>
                <Select value={formData.candidate_id} onValueChange={(value) => setFormData(prev => ({...prev, candidate_id: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map(candidate => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{candidate.candidate_name}</span>
                          {candidate.phone && <span className="text-sm text-muted-foreground">({candidate.phone})</span>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customer_id">Company *</Label>
                <Select value={formData.customer_id} onValueChange={(value) => setFormData(prev => ({...prev, customer_id: value, work_location_id: ''}))}>
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

            {/* Work Location and Contact Details */}
            {formData.customer_id && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="work_location_id">Work Location</Label>
                  <Select value={formData.work_location_id} onValueChange={(value) => {
                    const location = workLocations.find(l => l.id === value);
                    setFormData(prev => ({
                      ...prev, 
                      work_location_id: value,
                      contact_name: location?.contact_name || '',
                      contact_phone: location?.contact_phone || '',
                      contact_email: location?.contact_email || ''
                    }));
                  }}>
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

                <div>
                  <Label htmlFor="contact_name">Contact Name</Label>
                  <Input
                    id="contact_name"
                    value={formData.contact_name}
                    onChange={(e) => setFormData(prev => ({...prev, contact_name: e.target.value}))}
                    placeholder="Contact person"
                  />
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({...prev, contact_phone: e.target.value}))}
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
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({...prev, contact_email: e.target.value}))}
                    placeholder="Contact email"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({...prev, role: e.target.value}))}
                  placeholder="e.g., Horse Transport Driver"
                  required
                />
              </div>

              <div>
                <Label htmlFor="driver_class">Driver Class *</Label>
                <Select value={formData.driver_class} onValueChange={(value) => setFormData(prev => ({...prev, driver_class: value}))}>
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

            {/* Job Categories */}
            <div>
              <Label>Job Categories</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {jobCategories.map(category => (
                  <Badge
                    key={category}
                    variant={formData.job_categories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleJobCategoryToggle(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Booking Type and Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="booking_type">Shift Type *</Label>
                <Select value={formData.booking_type} onValueChange={(value) => setFormData(prev => ({...prev, booking_type: value}))}>
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
                <Select value={formData.day_type} onValueChange={(value) => setFormData(prev => ({...prev, day_type: value}))}>
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
                <Select value={formData.booking_status} onValueChange={(value) => setFormData(prev => ({...prev, booking_status: value}))}>
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

            {/* Date and Time */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({...prev, start_date: e.target.value}))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="start_time">Start Time *</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData(prev => ({...prev, start_time: e.target.value}))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({...prev, end_date: e.target.value}))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="end_time">End Time *</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData(prev => ({...prev, end_time: e.target.value}))}
                  required
                />
              </div>
            </div>

            {/* Rate Information */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="pay_rate">Pay Rate (£/hour)</Label>
                <Input
                  id="pay_rate"
                  type="number"
                  step="0.01"
                  value={formData.pay_rate}
                  onChange={(e) => setFormData(prev => ({...prev, pay_rate: e.target.value}))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="amended_pay_rate">Amended Pay Rate (£/hour)</Label>
                <Input
                  id="amended_pay_rate"
                  type="number"
                  step="0.01"
                  value={formData.amended_pay_rate}
                  onChange={(e) => setFormData(prev => ({...prev, amended_pay_rate: e.target.value}))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="charge_rate">Charge Rate (£/hour)</Label>
                <Input
                  id="charge_rate"
                  type="number"
                  step="0.01"
                  value={formData.charge_rate}
                  onChange={(e) => setFormData(prev => ({...prev, charge_rate: e.target.value}))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="expenses">Expenses (£)</Label>
                <Input
                  id="expenses"
                  type="number"
                  step="0.01"
                  value={formData.expenses}
                  onChange={(e) => setFormData(prev => ({...prev, expenses: e.target.value}))}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Holiday Accrual */}
            <div className="flex items-center space-x-2">
              <Switch
                id="holiday_accrual"
                checked={formData.holiday_accrual}
                onCheckedChange={(checked) => setFormData(prev => ({...prev, holiday_accrual: checked}))}
              />
              <Label htmlFor="holiday_accrual">Holiday Accrual</Label>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickup_location">Pickup Location</Label>
                <Input
                  id="pickup_location"
                  value={formData.pickup_location}
                  onChange={(e) => setFormData(prev => ({...prev, pickup_location: e.target.value}))}
                  placeholder="Pickup address"
                />
              </div>

              <div>
                <Label htmlFor="dropoff_location">Dropoff Location</Label>
                <Input
                  id="dropoff_location"
                  value={formData.dropoff_location}
                  onChange={(e) => setFormData(prev => ({...prev, dropoff_location: e.target.value}))}
                  placeholder="Dropoff address"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                placeholder="Additional booking notes..."
                rows={3}
              />
            </div>

            {/* Rate Preview */}
            {ratePreview && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Rate Preview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-lg text-green-600">£{ratePreview.charge_rate}</div>
                      <div className="text-muted-foreground">Charge Rate/hour</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg text-blue-600">£{ratePreview.pay_rate}</div>
                      <div className="text-muted-foreground">Pay Rate/hour</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg text-purple-600">£{ratePreview.margin.toFixed(2)}</div>
                      <div className="text-muted-foreground">Margin/hour</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg text-orange-600">{ratePreview.margin_percent.toFixed(1)}%</div>
                      <div className="text-muted-foreground">Margin %</div>
                    </div>
                  </div>
                  {calculateDuration() > 0 && (
                    <div className="mt-4 p-3 bg-white rounded border">
                      <div className="text-sm text-center">
                        <span className="font-medium">Total Duration: {calculateDuration().toFixed(1)} hours</span>
                        <span className="mx-4">|</span>
                        <span className="font-medium">Total Charge: £{(parseFloat(formData.charge_rate || '0') * calculateDuration()).toFixed(2)}</span>
                        <span className="mx-4">|</span>
                        <span className="font-medium">Total Pay: £{(parseFloat(formData.amended_pay_rate || formData.pay_rate || '0') * calculateDuration()).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                Create Booking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveBookingForm;
