
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users, UserCheck, Clock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CandidatesTable from './candidates/CandidatesTable';
import CandidateFormDialog from './candidates/CandidateFormDialog';
import { Candidate, CandidateFormData } from './candidates/types';

const CandidateManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const { toast } = useToast();

  // Mock data - in real implementation, this would come from Supabase
  const mockCandidates: Candidate[] = [
    {
      id: '1',
      candidate_name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+44 7123 456789',
      address: '123 High Street, London',
      postcode: 'SW1A 1AA',
      national_insurance_no: 'AB123456C',
      preferred_shift: 'Day Shift',
      job_title: 'HGV Driver',
      registration_status: 'Approved',
      registration_type: 'Full Registration',
      onboarding_status: 'Complete',
      active_status: 'Active',
      department_tags: ['Transport', 'Logistics'],
      industries: ['Construction', 'Delivery'],
      job_categories: ['Driver', 'HGV'],
      recruiter: 'Sarah Johnson',
      resourcer: 'Mike Thompson',
      created_by: 'admin',
      registered_at: '2024-01-15T10:00:00Z',
      date_added: '2024-01-10T09:00:00Z',
      created_at: '2024-01-10T09:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      payroll_type: 'PAYE',
      portal_access_enabled: true,
      portal_access_token: 'token123',
      last_portal_login: '2024-01-20T08:00:00Z'
    },
    {
      id: '2',
      candidate_name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+44 7987 654321',
      address: '456 Oak Avenue, Manchester',
      postcode: 'M1 1AA',
      job_title: 'Warehouse Operative',
      registration_status: 'Interview Scheduled',
      onboarding_status: 'Documents Required',
      active_status: 'On Hold',
      recruiter: 'Tom Brown',
      created_at: '2024-01-12T14:30:00Z',
      updated_at: '2024-01-12T14:30:00Z',
      payroll_type: 'Umbrella',
      portal_access_enabled: false
    }
  ];

  React.useEffect(() => {
    setCandidates(mockCandidates);
  }, []);

  const filteredCandidates = candidates.filter(candidate =>
    candidate.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCandidate = (data: CandidateFormData) => {
    const newCandidate: Candidate = {
      id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setCandidates([...candidates, newCandidate]);
    toast({
      title: 'Success',
      description: 'Candidate created successfully'
    });
  };

  const handleEditCandidate = (data: CandidateFormData) => {
    if (!editingCandidate) return;
    
    setCandidates(candidates.map(candidate =>
      candidate.id === editingCandidate.id
        ? { ...candidate, ...data, updated_at: new Date().toISOString() }
        : candidate
    ));
    
    setEditingCandidate(null);
    toast({
      title: 'Success',
      description: 'Candidate updated successfully'
    });
  };

  const handleTogglePortalAccess = (candidateId: string, enabled: boolean) => {
    setCandidates(candidates.map(candidate =>
      candidate.id === candidateId
        ? { 
            ...candidate, 
            portal_access_enabled: enabled,
            portal_access_token: enabled ? `token_${candidateId}_${Date.now()}` : undefined,
            updated_at: new Date().toISOString()
          }
        : candidate
    ));
    
    toast({
      title: 'Portal Access Updated',
      description: `Portal access ${enabled ? 'enabled' : 'disabled'} for candidate`
    });
  };

  const handleViewCandidate = (candidate: Candidate) => {
    // This would navigate to a detailed candidate view
    console.log('View candidate:', candidate);
  };

  const handleEditClick = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsFormOpen(true);
  };

  // Calculate stats
  const totalCandidates = candidates.length;
  const activeCandidates = candidates.filter(c => c.active_status === 'Active').length;
  const pendingOnboarding = candidates.filter(c => c.onboarding_status !== 'Complete').length;
  const portalEnabled = candidates.filter(c => c.portal_access_enabled).length;

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

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Candidates Table */}
      <Card>
        <CardContent className="p-0">
          <CandidatesTable
            candidates={filteredCandidates}
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
    </div>
  );
};

export default CandidateManagement;
