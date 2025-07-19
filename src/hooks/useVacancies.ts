
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
  recruiter_name?: string;
  resourcer_name?: string;
  industry_names?: string[];
  job_category_names?: string[];
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
    pageSize: 200,
    total: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status_id: 'all',
    company_id: 'all',
    assigned_contact_id: 'all',
    recruiter_id: 'all',
    resourcer_id: 'all',
    industry_id: 'all',
    job_category_id: 'all',
    organization_id: 'all',
    postcode: ''
  });
  const { toast } = useToast();

  const fetchVacancies = async (page?: number, search?: string, currentFilters?: any) => {
    try {
      setLoading(true);
      const currentPage = page || pagination.page;
      const currentSearch = search !== undefined ? search : searchTerm;
      const appliedFilters = currentFilters || filters;
      
      // Calculate range for pagination
      const from = (currentPage - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      
      // First, fetch vacancies with proper pagination
      let vacanciesQuery = supabase
        .from('vacancies')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      // Add search functionality - search across multiple fields
      if (currentSearch) {
        vacanciesQuery = vacanciesQuery.or(`title.ilike.%${currentSearch}%,description.ilike.%${currentSearch}%`);
      }

      // Add filters
      if (appliedFilters.status_id && appliedFilters.status_id !== 'all') {
        vacanciesQuery = vacanciesQuery.eq('vacancy_status_id', appliedFilters.status_id);
      }
      if (appliedFilters.company_id && appliedFilters.company_id !== 'all') {
        vacanciesQuery = vacanciesQuery.eq('company_id', appliedFilters.company_id);
      }
      if (appliedFilters.assigned_contact_id && appliedFilters.assigned_contact_id !== 'all') {
        vacanciesQuery = vacanciesQuery.eq('assigned_contact_id', appliedFilters.assigned_contact_id);
      }
      if (appliedFilters.recruiter_id && appliedFilters.recruiter_id !== 'all') {
        vacanciesQuery = vacanciesQuery.eq('recruiter_id', appliedFilters.recruiter_id);
      }
      if (appliedFilters.resourcer_id && appliedFilters.resourcer_id !== 'all') {
        vacanciesQuery = vacanciesQuery.eq('resourcer_id', appliedFilters.resourcer_id);
      }
      if (appliedFilters.organization_id && appliedFilters.organization_id !== 'all') {
        vacanciesQuery = vacanciesQuery.eq('organization_id', appliedFilters.organization_id);
      }

      const { data: vacanciesData, error: vacanciesError, count } = await vacanciesQuery;

      if (vacanciesError) throw vacanciesError;

      // Fetch related data separately for efficient joining
      const [companiesData, contactsData, statusesData, addressesData, industriesData, jobCategoriesData] = await Promise.all([
        supabase.from('companies').select('id, name'),
        supabase.from('contacts').select('id, name'),
        supabase.from('vacancy_statuses').select('id, name, color'),
        supabase.from('addresses').select('id, formatted_address, city, postal_code'),
        supabase.from('industry_types').select('id, name'),
        supabase.from('job_categories').select('id, name')
      ]);

      // Create lookup maps for efficient joining
      const companiesMap = new Map(companiesData.data?.map(c => [c.id, c]) || []);
      const contactsMap = new Map(contactsData.data?.map(c => [c.id, c]) || []);
      const statusesMap = new Map(statusesData.data?.map(s => [s.id, s]) || []);
      const addressesMap = new Map(addressesData.data?.map(a => [a.id, a]) || []);
      const industriesMap = new Map(industriesData.data?.map(i => [i.id, i]) || []);
      const jobCategoriesMap = new Map(jobCategoriesData.data?.map(j => [j.id, j]) || []);

      // Transform data to flatten joined relationships using the lookup maps
      const enrichedVacancies = (vacanciesData || []).map((vacancy: any) => {
        const company = companiesMap.get(vacancy.company_id);
        const contact = contactsMap.get(vacancy.assigned_contact_id);
        const status = statusesMap.get(vacancy.vacancy_status_id);
        const address = addressesMap.get(vacancy.address_id);

        // Map industry IDs to names
        const industryNames = (vacancy.industry_ids || [])
          .map((id: number) => industriesMap.get(id)?.name)
          .filter(Boolean);

        // Map job category IDs to names
        const jobCategoryNames = (vacancy.job_category_ids || [])
          .map((id: number) => jobCategoriesMap.get(id)?.name)
          .filter(Boolean);

        return {
          ...vacancy,
          company_name: company?.name || 'No Company',
          contact_name: contact?.name || 'Unassigned',
          status_name: status?.name || 'No Status',
          status_color: status?.color || '#gray',
          address: address?.formatted_address || 'No Address',
          city: address?.city || '',
          postcode: address?.postal_code || '',
          recruiter_name: vacancy.recruiter_id ? `User ${vacancy.recruiter_id}` : 'Unassigned',
          resourcer_name: vacancy.resourcer_id ? `User ${vacancy.resourcer_id}` : 'Unassigned',
          industry_names: industryNames,
          job_category_names: jobCategoryNames
        };
      });

      // Apply additional text-based filters
      let filteredVacancies = enrichedVacancies;
      
      if (appliedFilters.postcode) {
        filteredVacancies = filteredVacancies.filter(v => 
          v.postcode?.toLowerCase().includes(appliedFilters.postcode.toLowerCase())
        );
      }

      // Apply additional search to company and contact names if search term is present
      if (currentSearch) {
        const searchLower = currentSearch.toLowerCase();
        filteredVacancies = filteredVacancies.filter(v => 
          v.title?.toLowerCase().includes(searchLower) ||
          v.description?.toLowerCase().includes(searchLower) ||
          v.company_name?.toLowerCase().includes(searchLower) ||
          v.contact_name?.toLowerCase().includes(searchLower) ||
          v.address?.toLowerCase().includes(searchLower) ||
          v.postcode?.toLowerCase().includes(searchLower)
        );
      }
      
      setVacancies(filteredVacancies);
      setPagination(prev => ({
        ...prev,
        page: currentPage,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
      
      console.log(`✅ VACANCIES: Fetched ${filteredVacancies.length} vacancies (page ${currentPage}/${Math.ceil((count || 0) / pagination.pageSize)}) out of ${count || 0} total`);
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

  const changePageSize = (newPageSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize: newPageSize,
      page: 1
    }));
    fetchVacancies(1);
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
  }, [pagination.pageSize]);

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
    changePageSize,
    search,
    applyFilters,
  };
};
