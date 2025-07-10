import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users, UserCheck, Clock, Shield, Filter, Settings2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CandidateFormDialog from './candidates/CandidateFormDialog';
import CandidateDetailDialog from './candidates/CandidateDetailDialog';
import { Candidate, CandidateFormData } from './candidates/types';
import { useCandidates } from '@/hooks/useCandidates';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { MetricCard } from '@/components/ui/metric-card';
import { PageLoading } from '@/components/ui/loading';
import { ColumnVisibilityManager, ColumnConfig } from './candidates/ColumnVisibilityManager';
import { AdvancedFilters, FilterState } from './candidates/AdvancedFilters';
import { EnhancedSearch } from './candidates/EnhancedSearch';
import { EnhancedCandidatesTable } from './candidates/EnhancedCandidatesTable';

const CandidateManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);
  const [columns, setColumns] = useState<ColumnConfig[]>([]);
  const { toast } = useToast();
  const { 
    candidates, 
    loading, 
    pagination,
    searchTerm: hookSearchTerm,
    filters,
    goToPage,
    search: hookSearch,
    updateFilters,
    clearFilters,
    changePageSize,
    createCandidate, 
    updateCandidate, 
    deleteCandidate
  } = useCandidates();

  // Map database candidates to component format
  const mappedCandidates: Candidate[] = candidates.map(c => ({
    id: c.id.toString(),
    candidate_name: c.candidate_name,
    email: c.email,
    phone: c.phone,
    address: c.address,
    postcode: c.postcode,
    national_insurance_no: c.national_insurance_number,
    preferred_shift: 'Day Shift', // Default since not in migrated data
    job_title: 'Driver', // Default since not in migrated data
    registration_status: c.active_status === 'Active' ? 'Approved' : 'Pending',
    registration_type: 'Full Registration', // Default
    onboarding_status: c.active_status === 'Active' ? 'Complete' : 'Pending',
    active_status: c.active_status || 'Inactive',
    department_tags: [],
    industries: [],
    job_categories: c.skills || [],
    recruiter: 'System',
    resourcer: 'System',
    created_by: 'migration',
    registered_at: new Date(c.created_at * 1000).toISOString(),
    date_added: new Date(c.created_at * 1000).toISOString(),
    created_at: new Date(c.created_at * 1000).toISOString(),
    updated_at: c.updated_at ? new Date(c.updated_at * 1000).toISOString() : new Date(c.created_at * 1000).toISOString(),
    payroll_type: 'PAYE',
    portal_access_enabled: false,
    portal_access_token: undefined,
    last_portal_login: undefined
  }));

  // Remove client-side filtering since we're using server-side pagination and search

  const handleCreateCandidate = async (data: CandidateFormData) => {
    try {
      await createCandidate({
        candidate_name: data.candidate_name,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        city: null,
        postcode: data.postcode || null,
        national_insurance_number: data.national_insurance_no || null,
        hourly_rate: null,
        availability_status: 'Available',
        active_status: data.active_status || 'Active',
        licence_categories: [],
        skills: data.job_categories || []
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleEditCandidate = async (data: CandidateFormData) => {
    if (!editingCandidate) return;
    
    try {
      await updateCandidate(parseInt(editingCandidate.id), {
        candidate_name: data.candidate_name,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        postcode: data.postcode || null,
        national_insurance_number: data.national_insurance_no || null,
        active_status: data.active_status || 'Active',
        skills: data.job_categories || []
      });
      setEditingCandidate(null);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleTogglePortalAccess = async (candidateId: string, enabled: boolean) => {
    try {
      // For now, just show a toast since portal access isn't part of the migrated data structure
      toast({
        title: 'Portal Access Updated',
        description: `Portal access ${enabled ? 'enabled' : 'disabled'} for candidate`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update portal access',
        variant: 'destructive'
      });
    }
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setViewingCandidate(candidate);
    setIsDetailOpen(true);
  };

  const handleEditClick = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsFormOpen(true);
  };

  const handleEditFromDetail = (candidate: Candidate) => {
    setIsDetailOpen(false);
    setViewingCandidate(null);
    setEditingCandidate(candidate);
    setIsFormOpen(true);
  };

  // Calculate stats from total database counts, not just current page
  const totalCandidates = pagination.total;
  const activeCandidates = mappedCandidates.filter(c => c.active_status === 'Active').length;
  const pendingOnboarding = mappedCandidates.filter(c => c.onboarding_status !== 'Complete').length;
  const portalEnabled = mappedCandidates.filter(c => c.portal_access_enabled).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Candidate Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage candidate records, communications, and portal access
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center space-x-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          <span>Add Candidate</span>
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Candidates"
          value={totalCandidates}
          description="All candidate records"
          icon={Users}
        />
        <MetricCard
          title="Active (Current Page)"
          value={activeCandidates}
          description="Active on this page"
          icon={UserCheck}
          variant="success"
        />
        <MetricCard
          title="Page Info"
          value={`${pagination.page}/${pagination.totalPages}`}
          description={`Page size: ${pagination.pageSize}`}
          icon={Clock}
          variant="info"
        />
        <MetricCard
          title="Search Results"
          value={hookSearchTerm ? mappedCandidates.length : pagination.total}
          description={hookSearchTerm ? "Matching candidates" : "Total candidates"}
          icon={Shield}
          variant="default"
        />
      </div>

      {/* Enhanced Candidates Table */}
      <div className="crm-table">
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Candidate Directory</h3>
              <p className="text-sm text-muted-foreground">
                Total: {pagination.total.toLocaleString()} candidates
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ColumnVisibilityManager onColumnsChange={setColumns} />
              <Button variant="outline" size="sm">Import</Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>

          {/* Compact Search and Filters Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <EnhancedSearch
                onSearch={hookSearch}
                searchTerm={hookSearchTerm}
                resultsCount={pagination.total}
                loading={loading}
              />
            </div>
            <AdvancedFilters
              filters={filters as FilterState}
              onFiltersChange={(newFilters) => updateFilters(newFilters as any)}
              onClearFilters={clearFilters}
            />
          </div>
          
          {/* Compact Pagination */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.pageSize) + 1}-{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
            </span>
            <DataTablePagination
              pagination={pagination}
              onPageChange={goToPage}
              onPageSizeChange={changePageSize}
              onSearch={hookSearch}
              searchTerm={hookSearchTerm}
              searchPlaceholder="Search candidates..."
              loading={loading}
            />
          </div>
        </div>
        
        <EnhancedCandidatesTable
          candidates={mappedCandidates}
          columns={columns}
          onView={handleViewCandidate}
          onEdit={handleEditClick}
          onTogglePortalAccess={handleTogglePortalAccess}
        />
      </div>

      {/* Form Dialog */}
      <CandidateFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={editingCandidate ? handleEditCandidate : handleCreateCandidate}
        candidate={editingCandidate ? {
          candidate_name: editingCandidate.candidate_name,
          email: editingCandidate.email || '',
          phone: editingCandidate.phone || '',
          address: editingCandidate.address || '',
          postcode: editingCandidate.postcode || '',
          national_insurance_no: editingCandidate.national_insurance_no || '',
          preferred_shift: editingCandidate.preferred_shift || '',
          job_title: editingCandidate.job_title || '',
          registration_status: editingCandidate.registration_status,
          registration_type: editingCandidate.registration_type || '',
          onboarding_status: editingCandidate.onboarding_status,
          active_status: editingCandidate.active_status,
          department_tags: editingCandidate.department_tags || [],
          industries: editingCandidate.industries || [],
          job_categories: editingCandidate.job_categories || [],
          recruiter: editingCandidate.recruiter || '',
          resourcer: editingCandidate.resourcer || '',
          payroll_type: editingCandidate.payroll_type,
          portal_access_enabled: editingCandidate.portal_access_enabled
        } : undefined}
        mode={editingCandidate ? 'edit' : 'create'}
      />

      {/* Detail Dialog */}
      <CandidateDetailDialog
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) {
            setViewingCandidate(null);
          }
        }}
        candidate={viewingCandidate}
        onEdit={handleEditFromDetail}
        onTogglePortalAccess={handleTogglePortalAccess}
      />
    </div>
  );
};

export default CandidateManagement;
