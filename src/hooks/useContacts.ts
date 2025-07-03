import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Contact {
  id: string;
  customer_id: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_position: string | null;
  is_primary_contact: boolean | null;
  created_at: string;
  updated_at: string;
  // Joined company data
  company?: string;
  address?: string;
  city?: string;
  postcode?: string;
  country?: string;
  is_active?: boolean;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
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

  const fetchContacts = async (page?: number, search?: string) => {
    try {
      setLoading(true);
      const currentPage = page || pagination.page;
      const currentSearch = search !== undefined ? search : searchTerm;
      
      let query = supabase
        .from('contacts_prod')
        .select(`
          *,
          customers_prod!inner(
            company,
            address,
            city,
            postcode,
            country,
            is_active
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      // Add search functionality
      if (currentSearch) {
        query = query.or(`contact_name.ilike.%${currentSearch}%,contact_email.ilike.%${currentSearch}%,customers_prod.company.ilike.%${currentSearch}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      // Transform data to include company info at top level
      const transformedContacts = data?.map(contact => ({
        ...contact,
        company: contact.customers_prod?.company || '',
        address: contact.customers_prod?.address,
        city: contact.customers_prod?.city,
        postcode: contact.customers_prod?.postcode,
        country: contact.customers_prod?.country,
        is_active: contact.customers_prod?.is_active,
      })) || [];
      
      setContacts(transformedContacts);
      setPagination(prev => ({
        ...prev,
        page: currentPage,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
      
      console.log(`Fetched ${transformedContacts.length} contacts out of ${count || 0} total`);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchContacts(page);
    }
  };

  const search = (term: string) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchContacts(1, term);
  };

  const createContact = async (contactData: Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'company' | 'address' | 'city' | 'postcode' | 'country' | 'is_active'>) => {
    try {
      const { data, error } = await supabase
        .from('contacts_prod')
        .insert(contactData)
        .select()
        .single();

      if (error) throw error;

      await fetchContacts(); // Refresh the list
      toast({
        title: 'Success',
        description: 'Contact created successfully',
      });
      return data;
    } catch (err) {
      console.error('Error creating contact:', err);
      toast({
        title: 'Error',
        description: 'Failed to create contact',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const { error } = await supabase
        .from('contacts_prod')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchContacts(); // Refresh the list
      toast({
        title: 'Success',
        description: 'Contact updated successfully',
      });
    } catch (err) {
      console.error('Error updating contact:', err);
      toast({
        title: 'Error',
        description: 'Failed to update contact',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts_prod')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchContacts(); // Refresh the list
      toast({
        title: 'Success',
        description: 'Contact deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting contact:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    pagination,
    searchTerm,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    goToPage,
    search,
  };
};