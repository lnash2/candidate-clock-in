
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Save, Send, Calendar, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data for candidate's assignments
const mockAssignments = [
  {
    id: 1,
    client: 'TechCorp',
    project: 'Web Development',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'active',
    hourlyRate: 75
  },
  {
    id: 2,
    client: 'DataFlow Inc',
    project: 'Backend API',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    status: 'active',
    hourlyRate: 80
  }
];

const mockTimesheets = [
  {
    id: 1,
    assignmentId: 1,
    date: '2024-01-01',
    hours: 8,
    description: 'Implemented user authentication system',
    status: 'approved',
    submittedAt: '2024-01-02T09:00:00Z'
  },
  {
    id: 2,
    assignmentId: 1,
    date: '2024-01-02',
    hours: 7.5,
    description: 'Fixed bugs in payment integration',
    status: 'pending',
    submittedAt: '2024-01-03T10:30:00Z'
  }
];

const CandidatePortal = () => {
  const [selectedAssignment, setSelectedAssignment] = useState(mockAssignments[0]);
  const [timesheetData, setTimesheetData] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: '',
    description: ''
  });

  const handleSubmitTimesheet = (isDraft = false) => {
    if (!timesheetData.hours || !timesheetData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const action = isDraft ? 'saved as draft' : 'submitted for approval';
    toast({
      title: "Timesheet Submitted",
      description: `Your timesheet has been ${action} successfully.`,
    });

    // Reset form
    setTimesheetData({
      date: new Date().toISOString().split('T')[0],
      hours: '',
      description: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Candidate Portal - Timesheet Management</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="entry" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="entry">Timesheet Entry</TabsTrigger>
            <TabsTrigger value="history">My Timesheets</TabsTrigger>
            <TabsTrigger value="assignments">My Assignments</TabsTrigger>
          </TabsList>

          {/* Timesheet Entry Tab */}
          <TabsContent value="entry" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Submit New Timesheet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Assignment Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Select Assignment</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedAssignment.id}
                    onChange={(e) => {
                      const assignment = mockAssignments.find(a => a.id === parseInt(e.target.value));
                      if (assignment) setSelectedAssignment(assignment);
                    }}
                  >
                    {mockAssignments.map(assignment => (
                      <option key={assignment.id} value={assignment.id}>
                        {assignment.client} - {assignment.project}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Assignment Info */}
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Client:</span> {selectedAssignment.client}
                      </div>
                      <div>
                        <span className="font-medium">Project:</span> {selectedAssignment.project}
                      </div>
                      <div>
                        <span className="font-medium">Rate:</span> ${selectedAssignment.hourlyRate}/hour
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> 
                        <Badge className={`ml-2 ${getStatusColor(selectedAssignment.status)}`}>
                          {selectedAssignment.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timesheet Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <Input
                      type="date"
                      value={timesheetData.date}
                      onChange={(e) => setTimesheetData({...timesheetData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hours Worked</label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      placeholder="8.0"
                      value={timesheetData.hours}
                      onChange={(e) => setTimesheetData({...timesheetData, hours: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Work Description</label>
                  <Textarea
                    placeholder="Describe the work performed today..."
                    rows={4}
                    value={timesheetData.description}
                    onChange={(e) => setTimesheetData({...timesheetData, description: e.target.value})}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button onClick={() => handleSubmitTimesheet(true)} variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button onClick={() => handleSubmitTimesheet(false)}>
                    <Send className="w-4 h-4 mr-2" />
                    Submit for Approval
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timesheet History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">My Timesheet History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTimesheets.map(timesheet => {
                    const assignment = mockAssignments.find(a => a.id === timesheet.assignmentId);
                    return (
                      <Card key={timesheet.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium">
                                {new Date(timesheet.date).toLocaleDateString()}
                              </span>
                              <Badge className={getStatusColor(timesheet.status)}>
                                {timesheet.status}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {timesheet.hours} hours
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {assignment?.client} - {assignment?.project}
                            </div>
                            <div className="text-sm">
                              {timesheet.description}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Submitted: {new Date(timesheet.submittedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">My Current Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAssignments.map(assignment => (
                    <Card key={assignment.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h3 className="font-semibold">{assignment.client}</h3>
                          <p className="text-sm text-gray-600">{assignment.project}</p>
                        </div>
                        <div className="text-sm">
                          <div><span className="font-medium">Start:</span> {new Date(assignment.startDate).toLocaleDateString()}</div>
                          <div><span className="font-medium">End:</span> {new Date(assignment.endDate).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-medium">${assignment.hourlyRate}/hour</span>
                          </div>
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  );
};

export default CandidatePortal;
