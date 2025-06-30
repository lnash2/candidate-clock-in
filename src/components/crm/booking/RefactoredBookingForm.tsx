
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BasicBookingFields from './form/BasicBookingFields';
import CustomerSelectionFields from './form/CustomerSelectionFields';
import RateFields from './form/RateFields';
import LocationFields from './form/LocationFields';
import JobCategoriesField from './form/JobCategoriesField';

interface RefactoredBookingFormProps {
  onSubmit: (bookingData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const RefactoredBookingForm = ({ onSubmit, onCancel, initialData }: RefactoredBookingFormProps) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [workLocations, setWorkLocations] = useState<any[]>([]);
  const [companyRates, setCompanyRates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Basic fields
    start_date: '',
    start_time: '09:00',
    end_date: '',
    end_time: '17:00',
    role: '',
    driver_class: '',
    booking_type: 'day_shift',
    day_type: 'weekday',
    booking_status: 'pending',
    
    // Customer fields
    candidate_id: '',
    customer_id: '',
    work_location_id: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    
    // Rate fields
    pay_rate: '',
    amended_pay_rate: '',
    charge_rate: '',
    expenses: '',
    holiday_accrual: false,
    
    // Location fields
    pickup_location: '',
    dropoff_location: '',
    notes: '',
    
    // Job categories
    job_categories: [] as string[]
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

      const [candidatesRes, customersRes, ratesRes] = await Promise.all([
        supabase.from('candidates').select('*').eq('active_status', 'Active').order('candidate_name'),
        supabase.from('customers').select('*').order('company'),
        supabase.from('company_rates').select('*').eq('is_active', true)
      ]);

      if (candidatesRes.error) throw candidatesRes.error;
      if (customersRes.error) throw customersRes.error;
      if (ratesRes.error) throw ratesRes.error;

      setCandidates(candidatesRes.data || []);
      setCustomers(customersRes.data || []);
      setCompanyRates(ratesRes.data || []);
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
        .from('work_locations')
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

    const rateCategory = getRateCategory();
    const applicableRate = companyRates.find(rate => 
      rate.customer_id === formData.customer_id && 
      rate.driver_class === formData.driver_class &&
      rate.rate_category === rateCategory
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

  const calculateDuration = () => {
    if (!formData.start_date || !formData.end_date || !formData.start_time || !formData.end_time) {
      return 0;
    }
    
    const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
    const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);
    
    return (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
  };

  const handleJobCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      job_categories: prev.job_categories.includes(category)
        ? prev.job_categories.filter(c => c !== category)
        : [...prev.job_categories, category]
    }));
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCustomer = customers.find(c => c.id === formData.customer_id);
    const selectedCandidate = candidates.find(c => c.id === formData.candidate_id);
    const selectedWorkLocation = workLocations.find(l => l.id === formData.work_location_id);

    const bookingData = {
      ...formData,
      customer_name: selectedCustomer?.company || '',
      candidate_name: selectedCandidate?.candidate_name || '',
      work_location: selectedWorkLocation?.location_name || '',
      rate_preview: ratePreview,
      total_duration: calculateDuration(),
      status: formData.booking_status,
      estimated_duration: calculateDuration(),
      route_distance: 0
    };

    onSubmit(bookingData);
  };

  const duration = calculateDuration();

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
            {/* Customer Selection */}
            <div>
              <h3 className="text-lg font-medium mb-4">Assignment & Contact</h3>
              <CustomerSelectionFields
                formData={formData}
                onUpdate={updateFormData}
                candidates={candidates}
                customers={customers}
                workLocations={workLocations}
                onCustomerChange={fetchWorkLocations}
              />
            </div>

            {/* Basic Booking Fields */}
            <div>
              <h3 className="text-lg font-medium mb-4">Booking Details</h3>
              <BasicBookingFields
                formData={formData}
                onUpdate={updateFormData}
              />
            </div>

            {/* Job Categories */}
            <div>
              <h3 className="text-lg font-medium mb-4">Job Information</h3>
              <JobCategoriesField
                jobCategories={jobCategories}
                selectedCategories={formData.job_categories}
                onToggleCategory={handleJobCategoryToggle}
              />
            </div>

            {/* Rate Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Rate Information</h3>
              <RateFields
                formData={formData}
                onUpdate={updateFormData}
                ratePreview={ratePreview}
                duration={duration}
              />
            </div>

            {/* Locations & Notes */}
            <div>
              <h3 className="text-lg font-medium mb-4">Locations & Notes</h3>
              <LocationFields
                formData={formData}
                onUpdate={updateFormData}
              />
            </div>

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

export default RefactoredBookingForm;
