import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import RefactoredBookingForm from './booking/RefactoredBookingForm';
import BookingStats from './booking/BookingStats';
import ViewToggle from './booking/ViewToggle';
import SearchFilters from './booking/SearchFilters';
import BookingsList from './booking/BookingsList';
import ScheduleGrid from './booking/ScheduleGrid';
import OpenBookingsSection from './OpenBookingsSection';
import { useBookings } from '@/hooks/useBookings';
import { PageLoading } from '@/components/ui/loading';

const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2024-01-01');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState('list');
  
  const { bookings, loading, createBooking } = useBookings();

  // Transform bookings for display
  const transformedBookings = bookings.map(booking => ({
    id: parseInt(booking.id),
    customer: booking.customers?.company || 'Unknown Customer',
    pickupLocation: booking.pickup_location || '',
    dropoffLocation: booking.dropoff_location || '',
    startDate: booking.start_date,
    endDate: booking.end_date,
    status: booking.status || 'pending',
    estimatedDuration: booking.estimated_duration || 0,
    routeDistance: booking.route_distance || 0,
    vehicle: booking.vehicles ? `${booking.vehicles.model} - ${booking.vehicles.truck_registration}` : null,
    driver: booking.candidates?.candidate_name || null,
    notes: booking.notes || '',
    isNightShift: booking.is_night_shift || false,
    driverClass: booking.driver_class || '',
    bookingType: booking.booking_type === 'assigned' ? 'assigned' as const : 'open' as const,
    candidate_id: booking.candidate_id
  }));

  const openBookings = transformedBookings.filter(booking => booking.bookingType === 'open');
  const assignedBookings = transformedBookings.filter(booking => booking.bookingType === 'assigned');

  const filteredBookings = transformedBookings.filter(booking =>
    booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.dropoffLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleAssignCandidate = (bookingId: number) => {
    console.log('Assigning candidate to booking:', bookingId);
  };

  const handleEditBooking = (bookingId: number) => {
    console.log('Editing booking:', bookingId);
  };

  const handleDateSelect = (date: Date) => {
    console.log('Selected date:', date);
  };

  const handleBookingClick = (booking: any) => {
    console.log('Clicked booking:', booking);
  };

  const handleViewDetails = (bookingId: number) => {
    console.log('View details for booking:', bookingId);
  };

  const stats = {
    total: transformedBookings.length,
    open: openBookings.length,
    assigned: assignedBookings.length,
    urgent: openBookings.filter(b => {
      const days = Math.ceil((new Date(b.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return days <= 1;
    }).length
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b bg-white shrink-0">
        <div>
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-muted-foreground">Track and manage all transportation bookings</p>
          <BookingStats {...stats} />
        </div>
        <div className="flex items-center space-x-2">
          <ViewToggle activeView={activeView} onViewChange={setActiveView} />
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Booking
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
      </div>

      {/* Open Bookings Section */}
      <div className="p-4 border-b bg-gray-50 shrink-0">
        <OpenBookingsSection
          bookings={openBookings}
          onAssignCandidate={handleAssignCandidate}
          onEditBooking={handleEditBooking}
        />
      </div>

      {/* Search and Filter Controls - Only show in list view */}
      {activeView === 'list' && (
        <div className="p-4 border-b bg-white shrink-0">
          <SearchFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      )}

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {activeView === 'calendar' ? (
              <ScheduleGrid
                bookings={filteredBookings}
                onBookingClick={handleBookingClick}
                onCreateBooking={() => setIsCreateDialogOpen(true)}
              />
            ) : (
              <BookingsList
                bookings={filteredBookings}
                onViewDetails={handleViewDetails}
              />
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default BookingManagement;
