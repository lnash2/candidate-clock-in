
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Search, Filter, Eye } from 'lucide-react';

// Mock data for candidates and their bookings
const mockCandidates = [
  { id: 1, name: 'John Smith', email: 'john.smith@email.com', skills: ['React', 'TypeScript'] },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', skills: ['Python', 'Django'] },
  { id: 3, name: 'Mike Chen', email: 'mike.chen@email.com', skills: ['Java', 'Spring'] },
  { id: 4, name: 'Emily Davis', email: 'emily.d@email.com', skills: ['Angular', 'Node.js'] },
  { id: 5, name: 'Alex Turner', email: 'alex.t@email.com', skills: ['Vue.js', 'PHP'] },
];

const mockBookings = {
  1: {
    '2024-01-01': { client: 'TechCorp', project: 'Web Development', status: 'active', hours: 8 },
    '2024-01-02': { client: 'TechCorp', project: 'Web Development', status: 'active', hours: 7.5 },
    '2024-01-03': { client: 'TechCorp', project: 'Web Development', status: 'pending', hours: 8 },
  },
  2: {
    '2024-01-01': { client: 'DataFlow Inc', project: 'Backend API', status: 'active', hours: 8 },
    '2024-01-02': { client: 'DataFlow Inc', project: 'Backend API', status: 'active', hours: 8 },
    '2024-01-04': { client: 'StartupXYZ', project: 'MVP Development', status: 'pending', hours: 6 },
  },
  3: {
    '2024-01-02': { client: 'Enterprise Corp', project: 'System Integration', status: 'approved', hours: 8 },
    '2024-01-03': { client: 'Enterprise Corp', project: 'System Integration', status: 'active', hours: 8 },
  },
  4: {
    '2024-01-01': { client: 'Creative Agency', project: 'Frontend Redesign', status: 'active', hours: 7 },
    '2024-01-03': { client: 'Creative Agency', project: 'Frontend Redesign', status: 'pending', hours: 8 },
    '2024-01-04': { client: 'Creative Agency', project: 'Frontend Redesign', status: 'active', hours: 6.5 },
  },
  5: {
    '2024-01-02': { client: 'WebSolutions', project: 'E-commerce Platform', status: 'approved', hours: 8 },
    '2024-01-04': { client: 'WebSolutions', project: 'E-commerce Platform', status: 'active', hours: 7.5 },
  },
};

const AdminPortal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2024-01-01');

  // Generate date range for the grid (next 7 days from selected date)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCandidates = mockCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center space-x-2">
          <Eye className="w-5 h-5" />
          <span>Admin Portal - Live Candidate Bookings</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

        {/* Candidate Booking Grid */}
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
                    <div className="flex flex-wrap gap-1 mt-1">
                      {candidate.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs px-1 py-0">
                          {skill}
                        </Badge>
                      ))}
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
                            <div className="text-xs text-gray-600">
                              {booking.client}
                            </div>
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

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(mockBookings).reduce((acc, candidateBookings) => 
                  acc + Object.values(candidateBookings).filter(b => b.status === 'active').length, 0
                )}
              </div>
              <div className="text-sm text-blue-700">Active Assignments</div>
            </CardContent>
          </Card>
          
          <Card className="bg-yellow-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {Object.values(mockBookings).reduce((acc, candidateBookings) => 
                  acc + Object.values(candidateBookings).filter(b => b.status === 'pending').length, 0
                )}
              </div>
              <div className="text-sm text-yellow-700">Pending Approvals</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(mockBookings).reduce((acc, candidateBookings) => 
                  acc + Object.values(candidateBookings).reduce((sum, booking) => sum + booking.hours, 0), 0
                )}
              </div>
              <div className="text-sm text-green-700">Total Hours This Week</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </div>
  );
};

export default AdminPortal;
