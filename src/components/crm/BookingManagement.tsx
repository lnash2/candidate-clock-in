import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, MapPin, User, Clock, TrendingUp, Activity, Truck, Users } from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';
import { DataTable } from '@/components/ui/data-table';
import { MetricCard } from '@/components/ui/metric-card';
import { PageLoading } from '@/components/ui/loading';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import RefactoredBookingForm from './booking/RefactoredBookingForm';

const BookingManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { bookings, loading, createBooking } = useBookings();

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

  // Define table columns for the modern table
  const columns = [
    {
      key: 'id',
      label: 'Booking ID',
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">#{value}</div>
            <div className="text-xs text-muted-foreground">Booking</div>
          </div>
        </div>
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
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants = {
          open: 'default',
          assigned: 'secondary',
          completed: 'default',
          cancelled: 'destructive'
        } as const;
        
        const colors = {
          open: 'bg-warning/10 text-warning border-warning/20',
          assigned: 'bg-info/10 text-info border-info/20',
          completed: 'bg-success/10 text-success border-success/20',
          cancelled: 'bg-error/10 text-error border-error/20'
        } as const;

        return (
          <Badge className={`status-badge ${colors[value as keyof typeof colors] || colors.open}`}>
            {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Open'}
          </Badge>
        );
      }
    },
    {
      key: 'pickup_location',
      label: 'Pickup Location',
      render: (value: string) => value ? (
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">Not specified</span>
      )
    },
    {
      key: 'dropoff_location',
      label: 'Dropoff Location',
      render: (value: string) => value ? (
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">Not specified</span>
      )
    },
    {
      key: 'is_night_shift',
      label: 'Type',
      render: (value: boolean) => (
        <Badge variant={value ? 'secondary' : 'outline'} className="status-badge">
          {value ? 'Night Shift' : 'Day Shift'}
        </Badge>
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
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
    </div>
  );
};

export default BookingManagement;