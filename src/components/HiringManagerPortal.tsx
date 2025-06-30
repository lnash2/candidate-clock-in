import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Eye, Filter, Search, Users, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data for hiring manager's company candidates and timesheets
const mockCompanyCandidates = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    assignment: {
      project: 'Web Development',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      hourlyRate: 75
    },
    totalHours: 120,
    pendingHours: 16,
    approvedHours: 104
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    assignment: {
      project: 'Backend API',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      hourlyRate: 80
    },
    totalHours: 64,
    pendingHours: 8,
    approvedHours: 56
  }
];

const mockPendingTimesheets = [
  {
    id: 1,
    candidateId: 1,
    candidateName: 'John Smith',
    date: '2024-01-02',
    hours: 7.5,
    description: 'Fixed bugs in payment integration and updated user interface components',
    project: 'Web Development',
    submittedAt: '2024-01-03T10:30:00Z',
    status: 'pending'
  },
  {
    id: 2,
    candidateId: 1,
    candidateName: 'John Smith',
    date: '2024-01-03',
    hours: 8,
    description: 'Implemented new dashboard features and conducted code review',
    project: 'Web Development',
    submittedAt: '2024-01-04T09:15:00Z',
    status: 'pending'
  },
  {
    id: 3,
    candidateId: 2,
    candidateName: 'Sarah Johnson',
    date: '2024-01-03',
    hours: 8,
    description: 'Developed REST API endpoints for user management system',
    project: 'Backend API',
    submittedAt: '2024-01-04T11:00:00Z',
    status: 'pending'
  }
];

const HiringManagerPortal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingTimesheets, setPendingTimesheets] = useState(mockPendingTimesheets);
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
      '2024-01-01': { project: 'Web Development', status: 'active', hours: 8 },
      '2024-01-02': { project: 'Web Development', status: 'active', hours: 7.5 },
      '2024-01-03': { project: 'Web Development', status: 'pending', hours: 8 },
    },
    2: {
      '2024-01-01': { project: 'Backend API', status: 'active', hours: 8 },
      '2024-01-02': { project: 'Backend API', status: 'active', hours: 8 },
      '2024-01-04': { project: 'Backend API', status: 'pending', hours: 6 },
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTimesheetAction = (timesheetId: number, action: 'approve' | 'reject') => {
    setPendingTimesheets(prev => 
      prev.map(timesheet => 
        timesheet.id === timesheetId 
          ? { ...timesheet, status: action === 'approve' ? 'approved' : 'rejected' }
          : timesheet
      )
    );

    toast({
      title: `Timesheet ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `The timesheet has been ${action}d successfully.`,
      variant: action === 'approve' ? 'default' : 'destructive'
    });
  };

  const filteredCandidates = mockCompanyCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.assignment.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPendingTimesheets = pendingTimesheets.filter(timesheet =>
    timesheet.status === 'pending' &&
    (timesheet.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     timesheet.project.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Hiring Manager Portal - Team Overview</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Team Overview</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="approvals" className="relative">
              Pending Approvals
              {filteredPendingTimesheets.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs px-1 py-0">
                  {filteredPendingTimesheets.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Calendar View Tab */}
          <TabsContent value="calendar" className="space-y-6">
            {/* Search and Date Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
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
                  <div className="font-semibold">Candidate</div>
                  {dateRange.map(date => (
                    <div key={date} className="font-semibold text-center">
                      {new Date(date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  ))}
                </div>

                {/* Candidate Rows */}
                <div className="space-y-3">
                  {filteredCandidates.map(candidate => (
                    <div key={candidate.id} className="grid grid-cols-8 gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      {/* Candidate Info */}
                      <div className="flex flex-col">
                        <div className="font-medium text-sm">{candidate.name}</div>
                        <div className="text-xs text-gray-500">{candidate.email}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {candidate.assignment.project}
                        </div>
                      </div>

                      {/* Date Columns */}
                      {dateRange.map(date => {
                        const booking = mockBookings[candidate.id]?.[date];
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
          </TabsContent>

          {/* Team Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Search */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search candidates or projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Candidates Overview */}
            <div className="grid gap-4">
              {filteredCandidates.map(candidate => (
                <Card key={candidate.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{candidate.name}</h3>
                        <p className="text-gray-600">{candidate.email}</p>
                        <p className="text-sm text-gray-500">{candidate.assignment.project}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          ${candidate.assignment.hourlyRate}/hour
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(candidate.assignment.startDate).toLocaleDateString()} - 
                          {new Date(candidate.assignment.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <Card className="bg-blue-50">
                        <CardContent className="p-3 text-center">
                          <div className="text-xl font-bold text-blue-600">
                            {candidate.totalHours}
                          </div>
                          <div className="text-xs text-blue-700">Total Hours</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-yellow-50">
                        <CardContent className="p-3 text-center">
                          <div className="text-xl font-bold text-yellow-600">
                            {candidate.pendingHours}
                          </div>
                          <div className="text-xs text-yellow-700">Pending Hours</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-green-50">
                        <CardContent className="p-3 text-center">
                          <div className="text-xl font-bold text-green-600">
                            {candidate.approvedHours}
                          </div>
                          <div className="text-xs text-green-700">Approved Hours</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      <strong>Total Cost:</strong> ${(candidate.approvedHours * candidate.assignment.hourlyRate).toLocaleString()}
                      {candidate.pendingHours > 0 && (
                        <span className="ml-2 text-yellow-600">
                          (+${(candidate.pendingHours * candidate.assignment.hourlyRate).toLocaleString()} pending)
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pending Approvals Tab */}
          <TabsContent value="approvals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Timesheets Awaiting Approval</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredPendingTimesheets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <p>All timesheets have been reviewed!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPendingTimesheets.map(timesheet => (
                      <Card key={timesheet.id} className="border-l-4 border-l-yellow-400">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="font-semibold">{timesheet.candidateName}</span>
                                <Badge className={getStatusColor(timesheet.status)}>
                                  {timesheet.status}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                  {new Date(timesheet.date).toLocaleDateString()}
                                </span>
                                <span className="text-sm font-medium">
                                  {timesheet.hours} hours
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                {timesheet.project}
                              </div>
                              <div className="text-sm">
                                {timesheet.description}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              Submitted: {new Date(timesheet.submittedAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex space-x-2 pt-3 border-t">
                            <Button
                              size="sm"
                              onClick={() => handleTimesheetAction(timesheet.id, 'approve')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleTimesheetAction(timesheet.id, 'reject')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {mockCompanyCandidates.reduce((sum, c) => sum + c.totalHours, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Hours This Month</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${mockCompanyCandidates.reduce((sum, c) => sum + (c.approvedHours * c.assignment.hourlyRate), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Approved Costs</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    ${mockCompanyCandidates.reduce((sum, c) => sum + (c.pendingHours * c.assignment.hourlyRate), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Pending Costs</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {mockCompanyCandidates.length}
                  </div>
                  <div className="text-sm text-gray-600">Active Contractors</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCompanyCandidates.map(candidate => (
                    <div key={candidate.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{candidate.assignment.project}</div>
                        <div className="text-sm text-gray-600">{candidate.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${(candidate.approvedHours * candidate.assignment.hourlyRate).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {candidate.approvedHours} hrs approved
                        </div>
                      </div>
                    </div>
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

export default HiringManagerPortal;
