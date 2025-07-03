
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Candidate {
  id: number;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  created_by_user_id: number;
  candidate_status_id: number | null;
  address_id: number | null;
  job_category_ids: number[] | null;
  industry_ids: number[] | null;
  ni_number: string | null;
  organization_id: number | null;
  import_id: number | null;
  booking_status: string | null;
  job_title: string | null;
  current_salary: number | null;
  expected_salary: number | null;
  notice_period_id: number | null;
  preferred_shift_ids: number[] | null;
  active_status: string | null;
  created_at: number;
  updated_at: number | null;
  // Legacy field mappings for compatibility
  candidate_name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  postcode: string | null;
  national_insurance_number: string | null;
  hourly_rate: number | null;
  availability_status: string | null;
  licence_categories: string[] | null;
  skills: string[] | null;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 200, // Default page size
    total: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchCandidates = async (page?: number, search?: string, pageSize?: number) => {
    try {
      setLoading(true);
      const currentPage = page || pagination.page;
      const currentSearch = search !== undefined ? search : searchTerm;
      const currentPageSize = pageSize || pagination.pageSize;
      
      let query = supabase
        .from('candidates')
        .select('*', { count: 'exact' })
        .order('name', { ascending: true })
        .range((currentPage - 1) * currentPageSize, currentPage * currentPageSize - 1);

      // Add search functionality
      if (currentSearch) {
        query = query.or(`name.ilike.%${currentSearch}%,email.ilike.%${currentSearch}%,phone_number.ilike.%${currentSearch}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      // Transform legacy data to match expected interface
      const transformedData = (data || []).map(candidate => ({
        ...candidate,
        candidate_name: candidate.name || 'Unknown',
        phone: candidate.phone_number,
        address: null,
        city: null,
        postcode: null,
        national_insurance_number: candidate.ni_number,
        hourly_rate: candidate.current_salary,
        availability_status: candidate.active_status,
        licence_categories: null, // Would need additional mapping
        skills: null, // Would need additional mapping
        created_at: candidate.created_at,
        updated_at: candidate.updated_at || candidate.created_at
      }));
      
      setCandidates(transformedData);
      setPagination(prev => ({
        ...prev,
        page: currentPage,
        pageSize: currentPageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / currentPageSize)
      }));
      
      console.log(`✅ CANDIDATES: Fetched ${data?.length || 0} candidates out of ${count || 0} total`);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchCandidates(page);
    }
  };

  const search = (term: string) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCandidates(1, term);
  };

  const changePageSize = (newPageSize: number) => {
    setPagination(prev => ({ ...prev, page: 1, pageSize: newPageSize }));
    fetchCandidates(1, searchTerm, newPageSize);
  };

  const createCandidate = async (candidateData: any) => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .insert([{
          name: candidateData.candidate_name,
          email: candidateData.email,
          phone_number: candidateData.phone,
          ni_number: candidateData.national_insurance_number,
          current_salary: candidateData.hourly_rate,
          active_status: candidateData.active_status,
          created_by_user_id: 1, // Default value - should be actual user
          created_at: Math.floor(Date.now() / 1000)
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Transform the new candidate like we do in fetchCandidates
      const transformedCandidate = {
        ...data,
        candidate_name: data.name || 'Unknown',
        phone: data.phone_number,
        address: null,
        city: null,
        postcode: null,
        national_insurance_number: data.ni_number,
        hourly_rate: data.current_salary,
        availability_status: data.active_status,
        licence_categories: null,
        skills: null,
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at
      };
      setCandidates(prev => [...prev, transformedCandidate]);
      toast({
        title: 'Success',
        description: 'Candidate created successfully',
      });
      return data;
    } catch (err) {
      console.error('Error creating candidate:', err);
      toast({
        title: 'Error',
        description: 'Failed to create candidate',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateCandidate = async (id: number, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .update({
          name: updates.candidate_name || undefined,
          email: updates.email || undefined,
          phone_number: updates.phone || undefined,
          ni_number: updates.national_insurance_number || undefined,
          current_salary: updates.hourly_rate || undefined,
          active_status: updates.active_status || undefined,
          updated_at: Math.floor(Date.now() / 1000)
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Transform the updated candidate
      const transformedCandidate = {
        ...data,
        candidate_name: data.name || 'Unknown',
        phone: data.phone_number,
        address: null,
        city: null,
        postcode: null,
        national_insurance_number: data.ni_number,
        hourly_rate: data.current_salary,
        availability_status: data.active_status,
        licence_categories: null,
        skills: null,
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at
      };
      setCandidates(prev => prev.map(candidate => 
        candidate.id === id ? transformedCandidate : candidate
      ));
      toast({
        title: 'Success',
        description: 'Candidate updated successfully',
      });
      return data;
    } catch (err) {
      console.error('Error updating candidate:', err);
      toast({
        title: 'Error',
        description: 'Failed to update candidate',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteCandidate = async (id: number) => {
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCandidates(prev => prev.filter(candidate => candidate.id !== id));
      toast({
        title: 'Success',
        description: 'Candidate deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting candidate:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete candidate',
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return {
    candidates,
    loading,
    error,
    pagination,
    searchTerm,
    fetchCandidates,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    goToPage,
    search,
    changePageSize,
  };
};
