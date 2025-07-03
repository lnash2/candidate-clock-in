
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Candidate {
  id: string;
  candidate_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postcode: string | null;
  national_insurance_number: string | null;
  hourly_rate: number | null;
  availability_status: string | null;
  active_status: string | null;
  licence_categories: string[] | null;
  skills: string[] | null;
  created_at: string;
  updated_at: string;
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
    pageSize: 100,
    total: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchCandidates = async (page?: number, search?: string) => {
    try {
      setLoading(true);
      const currentPage = page || pagination.page;
      const currentSearch = search !== undefined ? search : searchTerm;
      
      let query = supabase
        .from('candidates_prod')
        .select('*', { count: 'exact' })
        .order('candidate_name', { ascending: true })
        .range(
          (currentPage - 1) * pagination.pageSize,
          currentPage * pagination.pageSize - 1
        );

      // Add search functionality
      if (currentSearch) {
        query = query.or(`candidate_name.ilike.%${currentSearch}%,email.ilike.%${currentSearch}%,phone.ilike.%${currentSearch}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      setCandidates(data || []);
      setPagination(prev => ({
        ...prev,
        page: currentPage,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
      
      console.log(`Fetched ${data?.length || 0} candidates out of ${count || 0} total`);
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

  const createCandidate = async (candidateData: Omit<Candidate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('candidates_prod')
        .insert([candidateData])
        .select()
        .single();

      if (error) throw error;
      
      setCandidates(prev => [...prev, data]);
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

  const updateCandidate = async (id: string, updates: Partial<Candidate>) => {
    try {
      const { data, error } = await supabase
        .from('candidates_prod')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCandidates(prev => prev.map(candidate => 
        candidate.id === id ? data : candidate
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

  const deleteCandidate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('candidates_prod')
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
  };
};
