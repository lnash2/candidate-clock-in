import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Eye, Edit, Phone, Mail, ToggleLeft, MapPin, Building, Calendar } from 'lucide-react';
import { Candidate } from './types';
import { ColumnConfig } from './ColumnVisibilityManager';

interface EnhancedCandidatesTableProps {
  candidates: Candidate[];
  columns: ColumnConfig[];
  onView?: (candidate: Candidate) => void;
  onEdit?: (candidate: Candidate) => void;
  onTogglePortalAccess?: (candidateId: string, enabled: boolean) => void;
}

type SortField = keyof Candidate;
type SortDirection = 'asc' | 'desc';

export const EnhancedCandidatesTable: React.FC<EnhancedCandidatesTableProps> = ({
  candidates,
  columns,
  onView,
  onEdit,
  onTogglePortalAccess
}) => {
  const [sortField, setSortField] = useState<SortField>('candidate_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const visibleColumns = columns.filter(col => col.visible);

  // Sort candidates
  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => {
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
  }, [candidates, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getOnboardingColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getRegistrationColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
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

  const renderCellContent = (candidate: Candidate, columnKey: string) => {
    switch (columnKey) {
      case 'candidate_name':
        return <span className="font-medium">{candidate.candidate_name}</span>;
      
      case 'email':
        return candidate.email ? (
          <div className="flex items-center space-x-1">
            <span>{candidate.email}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => window.open(`mailto:${candidate.email}`)}
            >
              <Mail className="h-3 w-3" />
            </Button>
          </div>
        ) : '-';
      
      case 'phone':
        return candidate.phone ? (
          <div className="flex items-center space-x-1">
            <span>{candidate.phone}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => window.open(`tel:${candidate.phone}`)}
            >
              <Phone className="h-3 w-3" />
            </Button>
          </div>
        ) : '-';
      
      case 'address':
        return candidate.address ? (
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="truncate max-w-[150px]" title={candidate.address}>
              {candidate.address}
            </span>
          </div>
        ) : '-';
      
      case 'active_status':
        return (
          <Badge className={getStatusColor(candidate.active_status)}>
            {candidate.active_status}
          </Badge>
        );
      
      case 'onboarding_status':
        return (
          <Badge className={getOnboardingColor(candidate.onboarding_status)}>
            {candidate.onboarding_status}
          </Badge>
        );
      
      case 'registration_status':
        return (
          <Badge className={getRegistrationColor(candidate.registration_status)}>
            {candidate.registration_status}
          </Badge>
        );
      
      case 'portal_access_enabled':
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTogglePortalAccess?.(candidate.id, !candidate.portal_access_enabled)}
            title={candidate.portal_access_enabled ? 'Portal Enabled' : 'Portal Disabled'}
          >
            <ToggleLeft className={`h-4 w-4 ${candidate.portal_access_enabled ? 'text-green-600' : 'text-gray-400'}`} />
          </Button>
        );
      
      case 'created_at':
        return (
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{new Date(candidate.created_at).toLocaleDateString()}</span>
          </div>
        );
      
      case 'job_title':
        return candidate.job_title ? (
          <div className="flex items-center space-x-1">
            <Building className="h-3 w-3 text-muted-foreground" />
            <span>{candidate.job_title}</span>
          </div>
        ) : '-';
      
      default:
        const value = candidate[columnKey as keyof Candidate];
        return value !== null && value !== undefined ? String(value) : '-';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <SortableHeader key={column.key} field={column.key as SortField}>
                  {column.label}
                </SortableHeader>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCandidates.map((candidate) => (
              <TableRow key={candidate.id} className="hover:bg-muted/50">
                {visibleColumns.map((column) => (
                  <TableCell key={column.key}>
                    {renderCellContent(candidate, column.key)}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView?.(candidate)}
                      title="View Details"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(candidate)}
                      title="Edit Candidate"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {sortedCandidates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No candidates found matching the current filters.
        </div>
      )}
    </div>
  );
};