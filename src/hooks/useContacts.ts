import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Contact {
  id: number;
  created_by_user_id: number;
  name: string | null;
  forename: string | null;
  surname: string | null;
  business_user_id: number | null;
  recruiter_id: number | null;
  company_id: number | null;
  address_id: number | null;
  job_title: string | null;
  direct_dial_phone: string | null;
  work_phone: string | null;
  personal_mobile: string | null;
  work_email: string | null;
  personal_email: string | null;
  industry_ids: number[] | null;
  organization_id: number | null;
  import_id: number | null;
  created_at: number;
  updated_at: number | null;
  // Legacy field mappings for compatibility
  customer_id: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_position: string | null;
  is_primary_contact: boolean | null;
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
        .from('contacts')
        .select(`
          *,
          companies!inner(
            name,
            website,
            phone_number
          ),
          addresses (
            formatted_address,
            postal_code,
            city,
            country
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(50000);

      // Add search functionality
      if (currentSearch) {
        query = query.or(`name.ilike.%${currentSearch}%,work_email.ilike.%${currentSearch}%,companies.name.ilike.%${currentSearch}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      // Transform data to include company info at top level
      const transformedContacts = data?.map(contact => ({
        ...contact,
        customer_id: contact.company_id?.toString() || '',
        contact_name: contact.name,
        contact_email: contact.work_email || contact.personal_email,
        contact_phone: contact.work_phone || contact.personal_mobile || contact.direct_dial_phone,
        contact_position: contact.job_title,
        is_primary_contact: false, // Would need additional logic
        company: contact.companies?.name || '',
        address: contact.addresses?.formatted_address,
        city: contact.addresses?.city,
        postcode: contact.addresses?.postal_code,
        country: contact.addresses?.country,
        is_active: true, // Simplified mapping
        created_at: contact.created_at,
        updated_at: contact.updated_at || contact.created_at
      })) || [];
      
      setContacts(transformedContacts);
      setPagination(prev => ({
        ...prev,
        page: currentPage,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
      
      console.log(`✅ CONTACTS: Fetched ${transformedContacts.length} contacts out of ${count || 0} total`);
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
        .from('contacts')
        .insert({
          name: contactData.contact_name,
          work_email: contactData.contact_email,
          work_phone: contactData.contact_phone,
          job_title: contactData.contact_position,
          company_id: parseInt(contactData.customer_id),
          created_by_user_id: 1, // Default value - should be actual user
          created_at: Math.floor(Date.now() / 1000)
        })
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

  const updateContact = async (id: number, updates: any) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({
          name: updates.contact_name || undefined,
          work_email: updates.contact_email || undefined,
          work_phone: updates.contact_phone || undefined,
          job_title: updates.contact_position || undefined,
          company_id: updates.customer_id ? parseInt(updates.customer_id) : undefined,
          updated_at: Math.floor(Date.now() / 1000)
        })
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

  const deleteContact = async (id: number) => {
    try {
      const { error } = await supabase
        .from('contacts')
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