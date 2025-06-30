
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Clock, CheckSquare, AlertCircle } from 'lucide-react';
import AdminPortal from '@/components/AdminPortal';
import CandidatePortal from '@/components/CandidatePortal';
import HiringManagerPortal from '@/components/HiringManagerPortal';

const Index = () => {
  const [activeRole, setActiveRole] = useState('admin');

  // Mock data for the overview stats
  const stats = {
    totalCandidates: 24,
    activeBookings: 18,
    pendingTimesheets: 7,
    approvedTimesheets: 45
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Timesheet Portal</h1>
              <p className="text-gray-600 mt-1">Manage candidate bookings and timesheets</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant={activeRole === 'admin' ? 'default' : 'outline'}
                onClick={() => setActiveRole('admin')}
                className="flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Admin View</span>
              </Button>
              <Button 
                variant={activeRole === 'candidate' ? 'default' : 'outline'}
                onClick={() => setActiveRole('candidate')}
                className="flex items-center space-x-2"
              >
                <Clock className="w-4 h-4" />
                <span>Candidate View</span>
              </Button>
              <Button 
                variant={activeRole === 'manager' ? 'default' : 'outline'}
                onClick={() => setActiveRole('manager')}
                className="flex items-center space-x-2"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Manager View</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Overview Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCandidates}</div>
              <p className="text-xs text-muted-foreground">Active in system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeBookings}</div>
              <p className="text-xs text-muted-foreground">Current assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Timesheets</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.pendingTimesheets}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Timesheets</CardTitle>
              <CheckSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approvedTimesheets}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content based on selected role */}
        <div className="bg-white rounded-lg shadow">
          {activeRole === 'admin' && <AdminPortal />}
          {activeRole === 'candidate' && <CandidatePortal />}
          {activeRole === 'manager' && <HiringManagerPortal />}
        </div>
      </div>
    </div>
  );
};

export default Index;
