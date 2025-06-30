
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Mail, Phone, FileText, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import { Candidate } from './types';
import { getStatusColor } from './constants';

interface CandidatesTableProps {
  candidates: Candidate[];
  onView: (candidate: Candidate) => void;
  onEdit: (candidate: Candidate) => void;
  onTogglePortalAccess: (candidateId: string, enabled: boolean) => void;
}

const CandidatesTable = ({ candidates, onView, onEdit, onTogglePortalAccess }: CandidatesTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Registration</TableHead>
            <TableHead>Onboarding</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payroll</TableHead>
            <TableHead>Portal Access</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No candidates found
              </TableCell>
            </TableRow>
          ) : (
            candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{candidate.candidate_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {candidate.recruiter && `Recruiter: ${candidate.recruiter}`}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {candidate.email && (
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="w-3 h-3" />
                        <span>{candidate.email}</span>
                      </div>
                    )}
                    {candidate.phone && (
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="w-3 h-3" />
                        <span>{candidate.phone}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{candidate.job_title || 'N/A'}</div>
                    {candidate.preferred_shift && (
                      <div className="text-sm text-muted-foreground">{candidate.preferred_shift}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(candidate.registration_status, 'registration')}>
                    {candidate.registration_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(candidate.onboarding_status, 'onboarding')}>
                    {candidate.onboarding_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(candidate.active_status, 'active')}>
                    {candidate.active_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{candidate.payroll_type}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTogglePortalAccess(candidate.id, !candidate.portal_access_enabled)}
                    className="p-1"
                  >
                    {candidate.portal_access_enabled ? (
                      <ToggleRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(candidate)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(candidate)}
                      className="flex items-center space-x-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CandidatesTable;
