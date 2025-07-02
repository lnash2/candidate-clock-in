import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CompanyRate {
  id: string;
  customer_id: string | null;
  driver_class: string | null;
  rate_category: string | null;
  charge_rate: number | null;
  pay_rate: number | null;
  description: string | null;
  effective_from: string;
  effective_to: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
  // Joined data
  customers_prod?: {
    id: string;
    company: string;
  };
}

export const useCompanyRates = () => {
  const [rates, setRates] = useState<CompanyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_rates_prod')
        .select(`
          *,
          customers_prod (
            id,
            company
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRates(data || []);
    } catch (err) {
      console.error('Error fetching rates:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createRate = async (rateData: Omit<CompanyRate, 'id' | 'created_at' | 'updated_at' | 'customers_prod'>) => {
    try {
      const { data, error } = await supabase
        .from('company_rates_prod')
        .insert([rateData])
        .select(`
          *,
          customers_prod (
            id,
            company
          )
        `)
        .single();

      if (error) throw error;
      
      setRates(prev => [data, ...prev]);
      toast({
        title: 'Success',
        description: 'Rate created successfully',
      });
      return data;
    } catch (err) {
      console.error('Error creating rate:', err);
      toast({
        title: 'Error',
        description: 'Failed to create rate',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateRate = async (id: string, updates: Partial<CompanyRate>) => {
    try {
      const { data, error } = await supabase
        .from('company_rates_prod')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          customers_prod (
            id,
            company
          )
        `)
        .single();

      if (error) throw error;
      
      setRates(prev => prev.map(rate => 
        rate.id === id ? data : rate
      ));
      toast({
        title: 'Success',
        description: 'Rate updated successfully',
      });
      return data;
    } catch (err) {
      console.error('Error updating rate:', err);
      toast({
        title: 'Error',
        description: 'Failed to update rate',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteRate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('company_rates_prod')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRates(prev => prev.filter(rate => rate.id !== id));
      toast({
        title: 'Success',
        description: 'Rate deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting rate:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete rate',
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return {
    rates,
    loading,
    error,
    fetchRates,
    createRate,
    updateRate,
    deleteRate,
  };
};