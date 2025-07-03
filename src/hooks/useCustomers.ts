
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Customer {
  id: number;
  name: string;
  created_by_user_id: number;
  primary_agency_id: number | null;
  company_status_id: number | null;
  advised_credit_rating: string | null;
  credit_limit: string | null;
  website: string | null;
  phone_number: string | null;
  vat_number: string | null;
  payroll_type_ids: number[] | null;
  industry_ids: number[] | null;
  address_id: number | null;
  organization_id: number | null;
  description: string | null;
  owner_id: number | null;
  import_id: number | null;
  previous_company_status_id: number | null;
  created_at: number;
  updated_at: number | null;
  // Legacy field mappings for compatibility
  company: string; // maps to name
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  city: string | null;
  postcode: string | null;
  country: string | null;
  is_active: boolean | null;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 50000, // Set high to accommodate all records
    total: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchCustomers = async (page?: number, search?: string) => {
    try {
      setLoading(true);
      const currentPage = page || pagination.page;
      const currentSearch = search !== undefined ? search : searchTerm;
      
      let query = supabase
        .from('companies')
        .select('*', { count: 'exact' })
        .order('name', { ascending: true })
        .limit(50000);

      // Add search functionality
      if (currentSearch) {
        query = query.or(`name.ilike.%${currentSearch}%,phone_number.ilike.%${currentSearch}%,website.ilike.%${currentSearch}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      // Transform legacy data to match expected interface
      const transformedData = (data || []).map(company => ({
        ...company,
        company: company.name, // Map name to company for compatibility
        contact_name: null, // Would need to join with contacts table
        contact_email: null,
        contact_phone: company.phone_number,
        address: null, // Will be populated if we add address lookup
        city: null,
        postcode: null,
        country: null,
        is_active: company.company_status_id ? true : false, // Simplified mapping
        created_at: company.created_at,
        updated_at: company.updated_at || company.created_at
      }));
      
      setCustomers(transformedData);
      setPagination(prev => ({
        ...prev,
        page: currentPage,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
      
      console.log(`✅ CUSTOMERS: Fetched ${data?.length || 0} customers out of ${count || 0} total`);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchCustomers(page);
    }
  };

  const search = (term: string) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCustomers(1, term);
  };

  const createCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{
          name: customerData.company,
          phone_number: customerData.contact_phone,
          website: customerData.address, // Temporary mapping
          created_by_user_id: 1, // Default value - should be actual user
          created_at: Math.floor(Date.now() / 1000)
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Transform the new customer
      const transformedCustomer = {
        ...data,
        company: data.name,
        contact_name: null,
        contact_email: null,
        contact_phone: data.phone_number,
        address: null,
        city: null,
        postcode: null,
        country: null,
        is_active: data.company_status_id ? true : false,
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at
      };
      setCustomers(prev => [...prev, transformedCustomer]);
      toast({
        title: 'Success',
        description: 'Customer created successfully',
      });
      return data;
    } catch (err) {
      console.error('Error creating customer:', err);
      toast({
        title: 'Error',
        description: 'Failed to create customer',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateCustomer = async (id: number, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update({
          name: updates.company || undefined,
          phone_number: updates.contact_phone || undefined,
          updated_at: Math.floor(Date.now() / 1000)
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Transform the updated customer
      const transformedCustomer = {
        ...data,
        company: data.name,
        contact_name: null,
        contact_email: null,
        contact_phone: data.phone_number,
        address: null,
        city: null,
        postcode: null,
        country: null,
        is_active: data.company_status_id ? true : false,
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at
      };
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? transformedCustomer : customer
      ));
      toast({
        title: 'Success',
        description: 'Customer updated successfully',
      });
      return data;
    } catch (err) {
      console.error('Error updating customer:', err);
      toast({
        title: 'Error',
        description: 'Failed to update customer',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteCustomer = async (id: number) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      toast({
        title: 'Success',
        description: 'Customer deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting customer:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete customer',
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    pagination,
    searchTerm,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    goToPage,
    search,
  };
};
