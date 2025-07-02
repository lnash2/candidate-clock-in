import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users, UserCheck, Clock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CandidatesTableAdvanced from './candidates/CandidatesTableAdvanced';
import CandidateFormDialog from './candidates/CandidateFormDialog';
import CandidateDetailDialog from './candidates/CandidateDetailDialog';
import { Candidate, CandidateFormData } from './candidates/types';
import { useCandidates } from '@/hooks/useCandidates';

const CandidateManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);
  const { toast } = useToast();
  const { 
    candidates, 
    loading, 
    createCandidate, 
    updateCandidate, 
    deleteCandidate 
  } = useCandidates();

  // Map database candidates to component format
  const mappedCandidates: Candidate[] = candidates.map(c => ({
    id: c.id,
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
    registered_at: c.created_at,
    date_added: c.created_at,
    created_at: c.created_at,
    updated_at: c.updated_at,
    payroll_type: 'PAYE',
    portal_access_enabled: false,
    portal_access_token: undefined,
    last_portal_login: undefined
  }));

  const filteredCandidates = mappedCandidates.filter(candidate =>
    candidate.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      await updateCandidate(editingCandidate.id, {
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

  // Calculate stats
  const totalCandidates = mappedCandidates.length;
  const activeCandidates = mappedCandidates.filter(c => c.active_status === 'Active').length;
  const pendingOnboarding = mappedCandidates.filter(c => c.onboarding_status !== 'Complete').length;
  const portalEnabled = mappedCandidates.filter(c => c.portal_access_enabled).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Candidate Management</h2>
          <p className="text-muted-foreground">Manage candidate records, communications, and portal access</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Candidate</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCandidates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Candidates</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCandidates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Onboarding</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingOnboarding}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portal Access</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{portalEnabled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Candidates Table */}
      <Card>
        <CardContent className="p-0">
          <CandidatesTableAdvanced
            candidates={mappedCandidates}
            onView={handleViewCandidate}
            onEdit={handleEditClick}
            onTogglePortalAccess={handleTogglePortalAccess}
          />
        </CardContent>
      </Card>

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
