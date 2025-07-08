import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, MapPin, User, Clock, TrendingUp, Activity, Eye, Edit, Building, Phone, Mail } from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';
import { DataTable } from '@/components/ui/data-table';
import { MetricCard } from '@/components/ui/metric-card';
import { PageLoading } from '@/components/ui/loading';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RefactoredBookingForm from './booking/RefactoredBookingForm';

const BookingManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { bookings, loading, createBooking, updateBooking } = useBookings();

  // Calculate comprehensive stats
  const totalBookings = bookings.length;
  const openBookings = bookings.filter(b => b.status === 'open').length;
  const assignedBookings = bookings.filter(b => b.status === 'assigned').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  
  const recentBookings = bookings.filter(b => {
    const createdDate = new Date(b.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return createdDate > sevenDaysAgo;
  }).length;

  // Helper functions for view/edit
  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  const handleEditBooking = (booking: any) => {
    setSelectedBooking(booking);
    setIsEditDialogOpen(true);
  };

  const handleUpdateBooking = async (bookingData: any) => {
    try {
      await updateBooking(selectedBooking.id, bookingData);
      setIsEditDialogOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  // Enhanced table columns with all relevant information
  const columns = [
    {
      key: 'id',
      label: 'Booking',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">#{value}</div>
            <div className="text-xs text-muted-foreground">
              {row.booking_status || row.status || 'Open'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'candidate_name',
      label: 'Candidate',
      render: (value: string, row: any) => value ? (
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-100 rounded-full">
            <User className="w-3 h-3 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-sm">{value}</div>
            <div className="text-xs text-muted-foreground">
              {row.candidate_email || 'No email'}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-gray-100 rounded-full">
            <User className="w-3 h-3 text-gray-400" />
          </div>
          <span className="text-sm text-muted-foreground">Unassigned</span>
        </div>
      )
    },
    {
      key: 'company_name',
      label: 'Company',
      render: (value: string, row: any) => value ? (
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-green-100 rounded-full">
            <Building className="w-3 h-3 text-green-600" />
          </div>
          <div>
            <div className="font-medium text-sm">{value}</div>
            <div className="text-xs text-muted-foreground">
              {row.contact_name || 'No contact'}
            </div>
          </div>
        </div>
      ) : (
        <span className="text-muted-foreground">No company</span>
      )
    },
    {
      key: 'start_date',
      label: 'Date Range',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">{new Date(value).toLocaleDateString()}</div>
            <div className="text-xs text-muted-foreground">
              to {new Date(row.end_date).toLocaleDateString()}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'booking_address',
      label: 'Location',
      render: (value: string, row: any) => {
        const address = value || row.pickup_location || row.dropoff_location;
        return address ? (
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{address}</div>
              <div className="text-xs text-muted-foreground">
                {row.booking_city && `${row.booking_city}`}
              </div>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">No location</span>
        );
      }
    },
    {
      key: 'is_night',
      label: 'Shift Type',
      render: (value: boolean) => (
        <Badge variant={value ? 'secondary' : 'outline'} className="status-badge">
          <Clock className="w-3 h-3 mr-1" />
          {value ? 'Night' : 'Day'}
        </Badge>
      )
    },
    {
      key: 'pay_rate',
      label: 'Rates',
      render: (value: number, row: any) => (
        <div className="text-sm">
          <div className="font-medium">£{value || 0}/hr</div>
          <div className="text-xs text-muted-foreground">
            Charge: £{row.charge_rate || 0}/hr
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewBooking(row)}
            className="h-8 w-8 p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditBooking(row)}
            className="h-8 w-8 p-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  const handleCreateBooking = async (bookingData: any) => {
    try {
      await createBooking({
        candidate_id: bookingData.candidate_id,
        customer_id: bookingData.customer_id,
        vehicle_id: bookingData.vehicle_id,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
        pickup_location: bookingData.pickup_location,
        dropoff_location: bookingData.dropoff_location,
        driver_class: bookingData.driver_class,
        booking_type: 'assigned',
        status: bookingData.booking_status || 'pending',
        is_night_shift: bookingData.booking_type === 'night_shift',
        estimated_duration: bookingData.estimated_duration || 0,
        route_distance: bookingData.route_distance || 0,
        notes: bookingData.notes
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Booking Management</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage all transportation bookings and assignments
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              <span>Create Booking</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[95vh]">
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[80vh]">
              <RefactoredBookingForm
                onSubmit={handleCreateBooking}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Bookings"
          value={totalBookings}
          description="All booking records"
          icon={Calendar}
          trend={{ value: 15, isPositive: true, label: "this week" }}
        />
        <MetricCard
          title="Open Bookings"
          value={openBookings}
          description="Available for assignment"
          icon={Clock}
          variant="warning"
        />
        <MetricCard
          title="Assigned Bookings"
          value={assignedBookings}
          description="Currently assigned"
          icon={User}
          variant="info"
        />
        <MetricCard
          title="Completed"
          value={completedBookings}
          description="Successfully completed"
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* Data Table */}
      <DataTable
        title="Booking Directory"
        description={`Showing ${bookings.length} bookings from your legacy database`}
        columns={columns}
        data={bookings}
        loading={loading}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        }
      />

      {/* View Booking Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information for Booking #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            {selectedBooking && (
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Booking ID</label>
                      <div className="text-sm font-medium">#{selectedBooking.id}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div className="text-sm">
                        <Badge className={`status-badge ${
                          selectedBooking.booking_status === 'approved' ? 'bg-success/10 text-success border-success/20' :
                          selectedBooking.booking_status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' :
                          'bg-info/10 text-info border-info/20'
                        }`}>
                          {selectedBooking.booking_status || selectedBooking.status || 'Open'}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                      <div className="text-sm">{new Date(selectedBooking.start_date).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">End Date</label>
                      <div className="text-sm">{new Date(selectedBooking.end_date).toLocaleDateString()}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* People Involved */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">People & Company</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Candidate</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="p-1.5 bg-blue-100 rounded-full">
                            <User className="w-3 h-3 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{selectedBooking.candidate_name || 'Unassigned'}</div>
                            <div className="text-xs text-muted-foreground">{selectedBooking.candidate_email || ''}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Company</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="p-1.5 bg-green-100 rounded-full">
                            <Building className="w-3 h-3 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{selectedBooking.company_name || 'No company'}</div>
                            <div className="text-xs text-muted-foreground">{selectedBooking.company_phone || ''}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedBooking.contact_name && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="p-1.5 bg-purple-100 rounded-full">
                            <Phone className="w-3 h-3 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{selectedBooking.contact_name}</div>
                            <div className="text-xs text-muted-foreground">
                              {selectedBooking.contact_email} • {selectedBooking.contact_phone}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Location & Timing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Location & Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Location</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm">{selectedBooking.booking_address || selectedBooking.pickup_location || 'No location specified'}</div>
                          {selectedBooking.booking_city && (
                            <div className="text-xs text-muted-foreground">{selectedBooking.booking_city}, {selectedBooking.booking_postcode}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Shift Type</label>
                        <div className="mt-1">
                          <Badge variant={selectedBooking.is_night ? 'secondary' : 'outline'} className="status-badge">
                            <Clock className="w-3 h-3 mr-1" />
                            {selectedBooking.is_night ? 'Night Shift' : 'Day Shift'}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Day Type</label>
                        <div className="text-sm mt-1">{selectedBooking.day_type || 'Weekday'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rate Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Pay Rate</label>
                      <div className="text-lg font-semibold text-green-600">£{selectedBooking.pay_rate || 0}/hr</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Charge Rate</label>
                      <div className="text-lg font-semibold text-blue-600">£{selectedBooking.charge_rate || 0}/hr</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Margin</label>
                      <div className="text-lg font-semibold text-purple-600">
                        £{((selectedBooking.charge_rate || 0) - (selectedBooking.pay_rate || 0)).toFixed(2)}/hr
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                {selectedBooking.note && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm bg-muted p-3 rounded-md">{selectedBooking.note}</div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>
              Update information for Booking #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            {selectedBooking && (
              <RefactoredBookingForm
                initialData={selectedBooking}
                onSubmit={handleUpdateBooking}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingManagement;