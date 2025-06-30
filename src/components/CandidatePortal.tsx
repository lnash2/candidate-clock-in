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
  const [selectedDate, setSelectedDate] = useState('2024-01-01');

  // Generate date range for the calendar grid
  const generateDateRange = (startDate: string, days: number) => {
    const dates = [];
    const start = new Date(startDate);
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const dateRange = generateDateRange(selectedDate, 7);

  // Mock booking data for calendar view
  const mockBookings = {
    1: {
      '2024-01-01': { client: 'TechCorp', project: 'Web Development', status: 'approved', hours: 8 },
      '2024-01-02': { client: 'TechCorp', project: 'Web Development', status: 'pending', hours: 7.5 },
      '2024-01-03': { client: 'TechCorp', project: 'Web Development', status: 'draft', hours: 8 },
    },
    2: {
      '2024-01-01': { client: 'DataFlow Inc', project: 'Backend API', status: 'approved', hours: 8 },
      '2024-01-02': { client: 'DataFlow Inc', project: 'Backend API', status: 'approved', hours: 8 },
      '2024-01-04': { client: 'DataFlow Inc', project: 'Backend API', status: 'pending', hours: 6 },
    },
  };

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="entry">Timesheet Entry</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="history">My Timesheets</TabsTrigger>
            <TabsTrigger value="assignments">My Assignments</TabsTrigger>
          </TabsList>

          {/* Calendar View Tab */}
          <TabsContent value="calendar" className="space-y-6">
            {/* Date Controls */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">My Booking Calendar</h3>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Header */}
                <div className="grid grid-cols-8 gap-2 mb-4 p-3 bg-gray-50 rounded-lg font-medium text-sm">
                  <div className="font-semibold">Assignment</div>
                  {dateRange.map(date => (
                    <div key={date} className="font-semibold text-center">
                      {new Date(date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  ))}
                </div>

                {/* Assignment Rows */}
                <div className="space-y-3">
                  {mockAssignments.map(assignment => (
                    <div key={assignment.id} className="grid grid-cols-8 gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      {/* Assignment Info */}
                      <div className="flex flex-col">
                        <div className="font-medium text-sm">{assignment.client}</div>
                        <div className="text-xs text-gray-600">{assignment.project}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          ${assignment.hourlyRate}/hr
                        </div>
                      </div>

                      {/* Date Columns */}
                      {dateRange.map(date => {
                        const booking = mockBookings[assignment.id]?.[date];
                        return (
                          <div key={date} className="text-center">
                            {booking ? (
                              <div className="space-y-1">
                                <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </Badge>
                                <div className="text-xs font-medium">
                                  {booking.hours}h
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-300 text-xs">-</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="bg-green-50">
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-green-600">
                    {Object.values(mockBookings).reduce((acc, assignmentBookings) => 
                      acc + Object.values(assignmentBookings).filter(b => b.status === 'approved').length, 0
                    )}
                  </div>
                  <div className="text-sm text-green-700">Approved Entries</div>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-50">
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-yellow-600">
                    {Object.values(mockBookings).reduce((acc, assignmentBookings) => 
                      acc + Object.values(assignmentBookings).filter(b => b.status === 'pending').length, 0
                    )}
                  </div>
                  <div className="text-sm text-yellow-700">Pending Approval</div>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50">
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-blue-600">
                    {Object.values(mockBookings).reduce((acc, assignmentBookings) => 
                      acc + Object.values(assignmentBookings).reduce((sum, booking) => sum + booking.hours, 0), 0
                    )}
                  </div>
                  <div className="text-sm text-blue-700">Total Hours This Week</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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
