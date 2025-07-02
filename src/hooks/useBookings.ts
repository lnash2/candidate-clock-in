
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Booking {
  id: string;
  customer_id: string | null;
  candidate_id: string | null;
  vehicle_id: string | null;
  start_date: string;
  end_date: string;
  pickup_location: string | null;
  dropoff_location: string | null;
  driver_class: string | null;
  booking_type: string | null;
  status: string | null;
  is_night_shift: boolean | null;
  estimated_duration: number | null;
  route_distance: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  customers?: {
    id: string;
    company: string;
    contact_name: string | null;
  };
  candidates?: {
    id: string;
    candidate_name: string;
  };
  vehicles?: {
    id: string;
    truck_registration: string;
    model: string | null;
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
        .from('bookings_prod')
        .select(`
          *,
          customers_prod (
            id,
            company,
            contact_name
          ),
          candidates_prod (
            id,
            candidate_name
          ),
          vehicles_prod (
            id,
            truck_registration,
            model
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'customers' | 'candidates' | 'vehicles'>) => {
    try {
      const { data, error } = await supabase
        .from('bookings_prod')
        .insert([bookingData])
        .select(`
          *,
          customers_prod (
            id,
            company,
            contact_name
          ),
          candidates_prod (
            id,
            candidate_name
          ),
          vehicles_prod (
            id,
            truck_registration,
            model
          )
        `)
        .single();

      if (error) throw error;
      
      setBookings(prev => [data, ...prev]);
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

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    try {
      const { data, error } = await supabase
        .from('bookings_prod')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          customers_prod (
            id,
            company,
            contact_name
          ),
          candidates_prod (
            id,
            candidate_name
          ),
          vehicles_prod (
            id,
            truck_registration,
            model
          )
        `)
        .single();

      if (error) throw error;
      
      setBookings(prev => prev.map(booking => 
        booking.id === id ? data : booking
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
        .from('bookings_prod')
        .delete()
        .eq('id', id);

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
