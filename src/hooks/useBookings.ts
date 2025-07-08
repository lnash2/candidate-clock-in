
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Booking {
  id: string;
  created_by_user_id: number;
  candidate_id: number | null;
  company_id: number;
  contact_id: number | null;
  company_rate_id: number;
  from_date: number;
  to_date: number;
  pay_rate: number;
  pay_rate2: number;
  charge_rate: number;
  is_night: boolean;
  amended_pay_rate: number;
  holiday_accrued: boolean;
  cost_rates_submitted: any;
  company_rate_submitted: any;
  payroll_type_id: number | null;
  vacancy_id: number | null;
  organization_id: number | null;
  booking_shifted_date: number | null;
  address_id: number | null;
  expenses: number | null;
  booking_group_id: number | null;
  date: number | null;
  old_booking_id: number | null;
  job_category_ids: number[] | null;
  margin: string | null;
  amended_margin: string | null;
  booking_type: string | null;
  booking_status: string | null;
  missed_booking_reason: string | null;
  note: string | null;
  day_type: string;
  created_at: number;
  updated_at: number | null;
  // Legacy field mappings for compatibility
  customer_id: string | null;
  vehicle_id: string | null;
  start_date: string;
  end_date: string;
  pickup_location: string | null;
  dropoff_location: string | null;
  driver_class: string | null;
  status: string | null;
  is_night_shift: boolean | null;
  estimated_duration: number | null;
  route_distance: number | null;
  notes: string | null;
  // Joined data
  companies?: {
    id: number;
    name: string;
  };
  candidates?: {
    id: number;
    name: string;
  };
  contacts?: {
    id: number;
    name: string;
  };
}

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings_with_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data using the new view with proper relationships
      const transformedData = (data || []).map(booking => ({
        ...booking,
        id: booking.id.toString(),
        customer_id: booking.company_id?.toString() || null,
        vehicle_id: null,
        start_date: new Date(booking.from_date * 1000).toISOString().split('T')[0],
        end_date: new Date(booking.to_date * 1000).toISOString().split('T')[0],
        pickup_location: booking.booking_address,
        dropoff_location: booking.booking_address,
        driver_class: null,
        status: booking.booking_status,
        is_night_shift: booking.is_night,
        estimated_duration: null,
        route_distance: null,
        notes: booking.note,
        companies: booking.company_name ? {
          id: booking.company_id,
          name: booking.company_name
        } : null,
        candidates: booking.candidate_name ? {
          id: booking.candidate_id,
          name: booking.candidate_name
        } : null
      }));
      
      setBookings(transformedData);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: any) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          company_id: parseInt(bookingData.customer_id || '1'),
          candidate_id: bookingData.candidate_id ? parseInt(bookingData.candidate_id) : null,
          company_rate_id: 1, // Default value
          from_date: Math.floor(new Date(bookingData.start_date).getTime() / 1000),
          to_date: Math.floor(new Date(bookingData.end_date).getTime() / 1000),
          pay_rate: 0,
          pay_rate2: 0,
          charge_rate: 0,
          is_night: bookingData.is_night_shift || false,
          amended_pay_rate: 0,
          holiday_accrued: false,
          cost_rates_submitted: {},
          company_rate_submitted: {},
          booking_type: bookingData.booking_type || 'open',
          booking_status: bookingData.status || 'open',
          note: bookingData.notes,
          day_type: 'weekday',
          created_by_user_id: 1, // Default value - should be actual user
          created_at: Math.floor(Date.now() / 1000)
        }])
        .select('*')
        .single();

      if (error) throw error;
      
      // Transform the new booking like we do in fetchBookings
      const transformedBooking = {
        ...data,
        id: data.id.toString(),
        customer_id: data.company_id?.toString() || null,
        vehicle_id: null,
        start_date: new Date(data.from_date * 1000).toISOString().split('T')[0],
        end_date: new Date(data.to_date * 1000).toISOString().split('T')[0],
        pickup_location: null,
        dropoff_location: null,
        driver_class: null,
        status: data.booking_status,
        is_night_shift: data.is_night,
        estimated_duration: null,
        route_distance: null,
        notes: data.note,
        companies: null,
        candidates: null
      };
      
      setBookings(prev => [transformedBooking, ...prev]);
      toast({
        title: 'Success',
        description: 'Booking created successfully',
      });
      return data;
    } catch (err) {
      console.error('Error creating booking:', err);
      toast({
        title: 'Error',
        description: 'Failed to create booking',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateBooking = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          company_id: updates.customer_id ? parseInt(updates.customer_id) : undefined,
          candidate_id: updates.candidate_id,
          from_date: updates.start_date ? Math.floor(new Date(updates.start_date).getTime() / 1000) : undefined,
          to_date: updates.end_date ? Math.floor(new Date(updates.end_date).getTime() / 1000) : undefined,
          is_night: updates.is_night_shift,
          booking_type: updates.booking_type,
          booking_status: updates.status,
          note: updates.notes,
          updated_at: Math.floor(Date.now() / 1000)
        })
        .eq('id', parseInt(id))
        .select('*')
        .single();

      if (error) throw error;
      
      // Transform the updated booking
      const transformedBooking = {
        ...data,
        id: data.id.toString(),
        customer_id: data.company_id?.toString() || null,
        vehicle_id: null,
        start_date: new Date(data.from_date * 1000).toISOString().split('T')[0],
        end_date: new Date(data.to_date * 1000).toISOString().split('T')[0],
        pickup_location: null,
        dropoff_location: null,
        driver_class: null,
        status: data.booking_status,
        is_night_shift: data.is_night,
        estimated_duration: null,
        route_distance: null,
        notes: data.note,
        companies: null,
        candidates: null
      };
      
      setBookings(prev => prev.map(booking => 
        booking.id === id ? transformedBooking : booking
      ));
      toast({
        title: 'Success',
        description: 'Booking updated successfully',
      });
      return data;
    } catch (err) {
      console.error('Error updating booking:', err);
      toast({
        title: 'Error',
        description: 'Failed to update booking',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', parseInt(id));

      if (error) throw error;
      
      setBookings(prev => prev.filter(booking => booking.id !== id));
      toast({
        title: 'Success',
        description: 'Booking deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting booking:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete booking',
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
  };
};
