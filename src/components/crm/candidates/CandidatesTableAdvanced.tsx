import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, ArrowUpDown, Eye, Edit, Phone, Mail, ToggleLeft } from 'lucide-react';
import { Candidate } from './types';

interface CandidatesTableAdvancedProps {
  candidates: Candidate[];
  onView?: (candidate: Candidate) => void;
  onEdit?: (candidate: Candidate) => void;
  onTogglePortalAccess?: (candidateId: string, enabled: boolean) => void;
}

type SortField = keyof Candidate;
type SortDirection = 'asc' | 'desc';

const CandidatesTableAdvanced = ({ candidates, onView, onEdit, onTogglePortalAccess }: CandidatesTableAdvancedProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('candidate_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [onboardingFilter, setOnboardingFilter] = useState<string>('all');

  // Filter and search
  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = searchTerm === '' || 
        candidate.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (candidate.email && candidate.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (candidate.phone && candidate.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (candidate.address && candidate.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (candidate.postcode && candidate.postcode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (candidate.national_insurance_no && candidate.national_insurance_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (candidate.job_title && candidate.job_title.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || candidate.active_status === statusFilter;
      const matchesOnboarding = onboardingFilter === 'all' || candidate.onboarding_status === onboardingFilter;
      
      return matchesSearch && matchesStatus && matchesOnboarding;
    });
  }, [candidates, searchTerm, statusFilter, onboardingFilter]);

  // Sort
  const sortedCandidates = useMemo(() => {
    return [...filteredCandidates].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle null values
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      // Convert to string for comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [filteredCandidates, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedCandidates.length / pageSize);
  const paginatedCandidates = sortedCandidates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize));
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOnboardingColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 font-medium"
        onClick={() => handleSort(field)}
      >
        {children}
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search candidates, emails, phones, addresses, NI numbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={onboardingFilter} onValueChange={setOnboardingFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Onboarding" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Onboarding</SelectItem>
            <SelectItem value="Complete">Complete</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="200">200</SelectItem>
            <SelectItem value="300">300</SelectItem>
            <SelectItem value="400">400</SelectItem>
            <SelectItem value="500">500</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Info */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedCandidates.length} of {filteredCandidates.length} candidates
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="candidate_name">Name</SortableHeader>
              <SortableHeader field="email">Email</SortableHeader>
              <SortableHeader field="phone">Phone</SortableHeader>
              <SortableHeader field="address">Address</SortableHeader>
              <SortableHeader field="postcode">Postcode</SortableHeader>
              <SortableHeader field="national_insurance_no">NI Number</SortableHeader>
              <SortableHeader field="job_title">Job Title</SortableHeader>
              <SortableHeader field="preferred_shift">Shift</SortableHeader>
              <SortableHeader field="active_status">Status</SortableHeader>
              <SortableHeader field="onboarding_status">Onboarding</SortableHeader>
              <SortableHeader field="registration_status">Registration</SortableHeader>
              <SortableHeader field="payroll_type">Payroll</SortableHeader>
              <SortableHeader field="recruiter">Recruiter</SortableHeader>
              <SortableHeader field="resourcer">Resourcer</SortableHeader>
              <SortableHeader field="portal_access_enabled">Portal</SortableHeader>
              <SortableHeader field="created_at">Created</SortableHeader>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCandidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell className="font-medium">{candidate.candidate_name}</TableCell>
                <TableCell>{candidate.email || '-'}</TableCell>
                <TableCell>{candidate.phone || '-'}</TableCell>
                <TableCell>{candidate.address || '-'}</TableCell>
                <TableCell>{candidate.postcode || '-'}</TableCell>
                <TableCell>{candidate.national_insurance_no || '-'}</TableCell>
                <TableCell>{candidate.job_title || '-'}</TableCell>
                <TableCell>{candidate.preferred_shift || '-'}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(candidate.active_status)}>
                    {candidate.active_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getOnboardingColor(candidate.onboarding_status)}>
                    {candidate.onboarding_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {candidate.registration_status}
                  </Badge>
                </TableCell>
                <TableCell>{candidate.payroll_type}</TableCell>
                <TableCell>{candidate.recruiter || '-'}</TableCell>
                <TableCell>{candidate.resourcer || '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTogglePortalAccess?.(candidate.id, !candidate.portal_access_enabled)}
                  >
                    <ToggleLeft className={`h-3 w-3 ${candidate.portal_access_enabled ? 'text-green-600' : 'text-gray-400'}`} />
                  </Button>
                </TableCell>
                <TableCell>{new Date(candidate.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView?.(candidate)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(candidate)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    {candidate.phone && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`tel:${candidate.phone}`)}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                    )}
                    {candidate.email && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`mailto:${candidate.email}`)}
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default CandidatesTableAdvanced;