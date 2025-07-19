
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Company {
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
  // Joined data
  address?: {
    formatted_address: string | null;
    postal_code: string | null;
    city: string | null;
    country: string | null;
  };
  totalContacts?: number;
  totalNotes?: number;
  lastNote?: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 200,
    total: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchCompanies = async (page?: number, search?: string) => {
    try {
      setLoading(true);
      const currentPage = page || pagination.page;
      const currentSearch = search !== undefined ? search : searchTerm;
      
      // Calculate range for pagination
      const from = (currentPage - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      
      let query = supabase
        .from('companies_with_details')
        .select('*', { count: 'exact' })
        .order('name', { ascending: true })
        .range(from, to);

      // Add search functionality
      if (currentSearch) {
        query = query.or(`name.ilike.%${currentSearch}%,phone_number.ilike.%${currentSearch}%,website.ilike.%${currentSearch}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      // Transform data from the view (already includes address and counts)
      const enrichedCompanies = (data || []).map(company => ({
        ...company,
        address: {
          formatted_address: company.company_address,
          postal_code: company.company_postcode,
          city: company.company_city,
          country: null
        },
        totalContacts: company.contact_count || 0,
        totalNotes: 0, // Can be enhanced later with proper notes counting
        lastNote: '-'
      }));
      
      setCompanies(enrichedCompanies);
      setPagination(prev => ({
        ...prev,
        page: currentPage,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
      
      console.log(`✅ COMPANIES: Fetched ${enrichedCompanies.length} companies (page ${currentPage}/${Math.ceil((count || 0) / pagination.pageSize)}) out of ${count || 0} total`);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchCompanies(page);
    }
  };

  const changePageSize = (newPageSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize: newPageSize,
      page: 1
    }));
    fetchCompanies(1);
  };

  const search = (term: string) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCompanies(1, term);
  };

  const createCompany = async (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at' | 'address' | 'totalContacts' | 'totalNotes' | 'lastNote'>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchCompanies(); // Refresh the list
      toast({
        title: 'Success',
        description: 'Company created successfully',
      });
      return data;
    } catch (err) {
      console.error('Error creating company:', err);
      toast({
        title: 'Error',
        description: 'Failed to create company',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateCompany = async (id: number, updates: Partial<Company>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update({ ...updates, updated_at: Math.floor(Date.now() / 1000) })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchCompanies(); // Refresh the list
      toast({
        title: 'Success',
        description: 'Company updated successfully',
      });
      return data;
    } catch (err) {
      console.error('Error updating company:', err);
      toast({
        title: 'Error',
        description: 'Failed to update company',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteCompany = async (id: number) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchCompanies(); // Refresh the list
      toast({
        title: 'Success',
        description: 'Company deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting company:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete company',
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [pagination.pageSize]);

  return {
    companies,
    loading,
    error,
    pagination,
    searchTerm,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    goToPage,
    changePageSize,
    search,
  };
};
