
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    <div className="w-full">
      <ScrollArea className="w-full overflow-x-auto">
        <div className="min-w-[1200px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] sticky left-0 bg-white z-10 border-r">Name</TableHead>
                <TableHead className="w-[200px]">Contact</TableHead>
                <TableHead className="w-[160px]">Job Title</TableHead>
                <TableHead className="w-[120px]">Registration</TableHead>
                <TableHead className="w-[120px]">Onboarding</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px]">Payroll</TableHead>
                <TableHead className="w-[120px]">Portal Access</TableHead>
                <TableHead className="w-[180px]">Actions</TableHead>
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
                  <TableRow key={candidate.id} className="hover:bg-muted/50">
                    <TableCell className="sticky left-0 bg-white z-10 border-r">
                      <div className="space-y-1">
                        <div 
                          className="font-medium cursor-pointer hover:text-primary hover:underline text-sm"
                          onClick={() => onView(candidate)}
                        >
                          {candidate.candidate_name}
                        </div>
                        {candidate.recruiter && (
                          <div className="text-xs text-muted-foreground">
                            Recruiter: {candidate.recruiter}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {candidate.email && (
                          <div className="flex items-center space-x-2 text-xs">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{candidate.email}</span>
                          </div>
                        )}
                        {candidate.phone && (
                          <div className="flex items-center space-x-2 text-xs">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{candidate.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{candidate.job_title || 'N/A'}</div>
                        {candidate.preferred_shift && (
                          <div className="text-xs text-muted-foreground truncate">
                            {candidate.preferred_shift}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getStatusColor(candidate.registration_status, 'registration')} text-xs`}
                        variant="secondary"
                      >
                        {candidate.registration_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getStatusColor(candidate.onboarding_status, 'onboarding')} text-xs`}
                        variant="secondary"
                      >
                        {candidate.onboarding_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getStatusColor(candidate.active_status, 'active')} text-xs`}
                        variant="secondary"
                      >
                        {candidate.active_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {candidate.payroll_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onTogglePortalAccess(candidate.id, !candidate.portal_access_enabled)}
                          className="p-1 h-8 w-8"
                        >
                          {candidate.portal_access_enabled ? (
                            <ToggleRight className="w-5 h-5 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onView(candidate)}
                          className="h-7 px-2 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(candidate)}
                          className="h-7 px-2 text-xs"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CandidatesTable;
