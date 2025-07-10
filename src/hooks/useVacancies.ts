import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Vacancy {
  id: number;
  title: string;
  description: string | null;
  company_id: number | null;
  assigned_contact_id: number | null;
  address_id: number | null;
  recruiter_id: number | null;
  resourcer_id: number | null;
  vacancy_status_id: number | null;
  job_posted_at: number | null;
  company_rate_id: number | null;
  industry_ids: number[] | null;
  job_category_ids: number[] | null;
  organization_id: number | null;
  created_by_user_id: number;
  created_at: number;
  updated_at: number | null;
  // Joined data
  company_name?: string;
  contact_name?: string;
  status_name?: string;
  status_color?: string;
  address?: string;
  city?: string;
  postcode?: string;
}

export interface VacancyStatus {
  id: number;
  name: string;
  color: string | null;
  is_default: boolean;
  is_available: boolean;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const useVacancies = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [statuses, setStatuses] = useState<VacancyStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 50000,
    total: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status_id: '',
    company_id: '',
    assigned_contact_id: ''
  });
  const { toast } = useToast();

  const fetchVacancies = async (page?: number, search?: string, currentFilters?: any) => {
    try {
      setLoading(true);
      const currentPage = page || pagination.page;
      const currentSearch = search !== undefined ? search : searchTerm;
      const appliedFilters = currentFilters || filters;
      
      let query = supabase
        .from('vacancies')
        .select(`
          *,
          companies(name),
          contacts(name),
          vacancy_statuses(name, color),
          addresses(formatted_address, city, postal_code)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(50000);

      // Add search functionality
      if (currentSearch) {
        query = query.or(`title.ilike.%${currentSearch}%,description.ilike.%${currentSearch}%`);
      }

      // Add filters
      if (appliedFilters.status_id) {
        query = query.eq('vacancy_status_id', appliedFilters.status_id);
      }
      if (appliedFilters.company_id) {
        query = query.eq('company_id', appliedFilters.company_id);
      }
      if (appliedFilters.assigned_contact_id) {
        query = query.eq('assigned_contact_id', appliedFilters.assigned_contact_id);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      // Transform data to flatten joined relationships
      const enrichedVacancies = (data || []).map((vacancy: any) => ({
        ...vacancy,
        company_name: vacancy.companies?.[0]?.name || 'No Company',
        contact_name: vacancy.contacts?.[0]?.name || 'Unassigned',
        status_name: vacancy.vacancy_statuses?.[0]?.name || 'No Status',
        status_color: vacancy.vacancy_statuses?.[0]?.color || '#gray',
        address: vacancy.addresses?.[0]?.formatted_address || 'No Address',
        city: vacancy.addresses?.[0]?.city || '',
        postcode: vacancy.addresses?.[0]?.postal_code || ''
      }));
      
      setVacancies(enrichedVacancies);
      setPagination(prev => ({
        ...prev,
        page: currentPage,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
      
      console.log(`✅ VACANCIES: Fetched ${enrichedVacancies.length} vacancies out of ${count || 0} total`);
    } catch (err) {
      console.error('Error fetching vacancies:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('vacancy_statuses')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setStatuses(data || []);
    } catch (err) {
      console.error('Error fetching vacancy statuses:', err);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchVacancies(page);
    }
  };

  const search = (term: string) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchVacancies(1, term);
  };

  const applyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchVacancies(1, searchTerm, newFilters);
  };

  const createVacancy = async (vacancyData: Omit<Vacancy, 'id' | 'created_at' | 'updated_at' | 'company_name' | 'contact_name' | 'status_name' | 'status_color' | 'address' | 'city' | 'postcode'>) => {
    try {
      const { data, error } = await supabase
        .from('vacancies')
        .insert([{
          ...vacancyData,
          created_at: Math.floor(Date.now() / 1000)
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchVacancies(); // Refresh the list
      toast({
        title: 'Success',
        description: 'Vacancy created successfully',
      });
      return data;
    } catch (err) {
      console.error('Error creating vacancy:', err);
      toast({
        title: 'Error',
        description: 'Failed to create vacancy',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateVacancy = async (id: number, updates: Partial<Vacancy>) => {
    try {
      const { data, error } = await supabase
        .from('vacancies')
        .update({ ...updates, updated_at: Math.floor(Date.now() / 1000) })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchVacancies(); // Refresh the list
      toast({
        title: 'Success',
        description: 'Vacancy updated successfully',
      });
      return data;
    } catch (err) {
      console.error('Error updating vacancy:', err);
      toast({
        title: 'Error',
        description: 'Failed to update vacancy',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteVacancy = async (id: number) => {
    try {
      const { error } = await supabase
        .from('vacancies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchVacancies(); // Refresh the list
      toast({
        title: 'Success',
        description: 'Vacancy deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting vacancy:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete vacancy',
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchVacancies();
    fetchStatuses();
  }, []);

  return {
    vacancies,
    statuses,
    loading,
    error,
    pagination,
    searchTerm,
    filters,
    fetchVacancies,
    createVacancy,
    updateVacancy,
    deleteVacancy,
    goToPage,
    search,
    applyFilters,
  };
};