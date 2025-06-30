
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, FileText, MessageSquare, Edit, ToggleLeft, ToggleRight } from 'lucide-react';
import { Candidate, CandidateCommunication, CandidateDocument, CandidateNote } from './types';
import { getStatusColor } from './constants';
import { format } from 'date-fns';

interface CandidateDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate | null;
  onEdit?: (candidate: Candidate) => void;
  onTogglePortalAccess?: (candidateId: string, enabled: boolean) => void;
}

const CandidateDetailDialog = ({ 
  open, 
  onOpenChange, 
  candidate, 
  onEdit, 
  onTogglePortalAccess 
}: CandidateDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!candidate) return null;

  // Mock data for related records - in real implementation, these would come from props or API calls
  const mockCommunications: CandidateCommunication[] = [
    {
      id: '1',
      candidate_id: candidate.id,
      communication_type: 'email',
      subject: 'Welcome to our agency',
      content: 'Welcome email sent to candidate after registration',
      sent_by: 'admin@company.com',
      sent_at: '2024-01-15T10:00:00Z',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      candidate_id: candidate.id,
      communication_type: 'phone',
      content: 'Initial screening call completed. Candidate shows strong interest in HGV positions.',
      sent_by: 'Sarah Johnson',
      sent_at: '2024-01-16T14:30:00Z',
      created_at: '2024-01-16T14:30:00Z'
    }
  ];

  const mockDocuments: CandidateDocument[] = [
    {
      id: '1',
      candidate_id: candidate.id,
      document_type: 'cv',
      document_name: 'John_Smith_CV.pdf',
      file_size: 245760,
      mime_type: 'application/pdf',
      upload_date: '2024-01-10T09:00:00Z',
      status: 'approved',
      uploaded_by: 'admin',
      created_at: '2024-01-10T09:00:00Z'
    },
    {
      id: '2',
      candidate_id: candidate.id,
      document_type: 'compliance',
      document_name: 'Driving_License.pdf',
      file_size: 156890,
      mime_type: 'application/pdf',
      upload_date: '2024-01-12T11:00:00Z',
      expiry_date: '2029-01-12',
      status: 'approved',
      uploaded_by: 'admin',
      created_at: '2024-01-12T11:00:00Z'
    }
  ];

  const mockNotes: CandidateNote[] = [
    {
      id: '1',
      candidate_id: candidate.id,
      content: 'Excellent communication skills. Previous experience with construction sites.',
      created_by: 'Sarah Johnson',
      created_at: '2024-01-15T16:00:00Z',
      updated_at: '2024-01-15T16:00:00Z'
    },
    {
      id: '2',
      candidate_id: candidate.id,
      content: 'Available for immediate start. Prefers day shifts but flexible.',
      created_by: 'Mike Thompson',
      created_at: '2024-01-18T10:30:00Z',
      updated_at: '2024-01-18T10:30:00Z'
    }
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{candidate.candidate_name}</DialogTitle>
            <div className="flex items-center space-x-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(candidate)}
                  className="flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="portal">Portal Access</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{candidate.email || 'N/A'}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{candidate.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{candidate.address || 'N/A'}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Postcode</p>
                    <span>{candidate.postcode || 'N/A'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">National Insurance</p>
                    <span>{candidate.national_insurance_no || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Employment Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5" />
                    <span>Employment Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Job Title</p>
                    <span>{candidate.job_title || 'N/A'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Preferred Shift</p>
                    <span>{candidate.preferred_shift || 'N/A'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Payroll Type</p>
                    <Badge variant="outline">{candidate.payroll_type}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Recruiter</p>
                    <span>{candidate.recruiter || 'N/A'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resourcer</p>
                    <span>{candidate.resourcer || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Information */}
            <Card>
              <CardHeader>
                <CardTitle>Status Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Registration Status</p>
                    <Badge className={getStatusColor(candidate.registration_status, 'registration')}>
                      {candidate.registration_status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Onboarding Status</p>
                    <Badge className={getStatusColor(candidate.onboarding_status, 'onboarding')}>
                      {candidate.onboarding_status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Active Status</p>
                    <Badge className={getStatusColor(candidate.active_status, 'active')}>
                      {candidate.active_status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Important Dates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date Added</p>
                    <span>{candidate.date_added ? format(new Date(candidate.date_added), 'MMM dd, yyyy') : 'N/A'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Registered At</p>
                    <span>{candidate.registered_at ? format(new Date(candidate.registered_at), 'MMM dd, yyyy') : 'N/A'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <span>{format(new Date(candidate.updated_at), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communications" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Communication History</h3>
              <Button size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Add Communication
              </Button>
            </div>
            <div className="space-y-4">
              {mockCommunications.map((comm) => (
                <Card key={comm.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{comm.communication_type}</Badge>
                        {comm.subject && <span className="font-medium">{comm.subject}</span>}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {comm.sent_at ? format(new Date(comm.sent_at), 'MMM dd, yyyy HH:mm') : 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm">{comm.content}</p>
                    {comm.sent_by && (
                      <p className="text-xs text-muted-foreground mt-2">By: {comm.sent_by}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Documents & Compliance</h3>
              <Button size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
            <div className="space-y-4">
              {mockDocuments.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">{doc.document_name}</span>
                          <Badge variant="outline">{doc.document_type}</Badge>
                          <Badge className={
                            doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                            doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {doc.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Size: {doc.file_size ? formatFileSize(doc.file_size) : 'N/A'}</p>
                          <p>Uploaded: {doc.upload_date ? format(new Date(doc.upload_date), 'MMM dd, yyyy') : 'N/A'}</p>
                          {doc.expiry_date && (
                            <p>Expires: {format(new Date(doc.expiry_date), 'MMM dd, yyyy')}</p>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notes</h3>
              <Button size="sm">
                Add Note
              </Button>
            </div>
            <div className="space-y-4">
              {mockNotes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        {note.created_at ? format(new Date(note.created_at), 'MMM dd, yyyy HH:mm') : 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                    {note.created_by && (
                      <p className="text-xs text-muted-foreground mt-2">By: {note.created_by}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Portal Access Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Candidate Portal Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow candidate to access their personal portal
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTogglePortalAccess?.(candidate.id, !candidate.portal_access_enabled)}
                    className="p-1"
                  >
                    {candidate.portal_access_enabled ? (
                      <ToggleRight className="w-8 h-8 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </Button>
                </div>

                {candidate.portal_access_enabled && (
                  <div className="space-y-4">
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Portal Token</p>
                        <code className="text-xs bg-muted p-2 rounded">
                          {candidate.portal_access_token || 'No token generated'}
                        </code>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                        <span className="text-sm">
                          {candidate.last_portal_login 
                            ? format(new Date(candidate.last_portal_login), 'MMM dd, yyyy HH:mm')
                            : 'Never logged in'
                          }
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Send Portal Access Email
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDetailDialog;
