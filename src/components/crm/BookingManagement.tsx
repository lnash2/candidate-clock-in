
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import BookingForm from './BookingForm';
import OpenBookingsSection from './OpenBookingsSection';
import ScheduleGrid from './booking/ScheduleGrid';
import BookingStats from './booking/BookingStats';
import ViewToggle from './booking/ViewToggle';
import SearchFilters from './booking/SearchFilters';
import BookingsList from './booking/BookingsList';

const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2024-01-01');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState('list');

  // Updated mock booking data with candidate_id field
  const bookings = [
    {
      id: 1,
      customer: 'Cheltenham Racecourse',
      pickupLocation: 'Cheltenham, GL50 4SH',
      dropoffLocation: 'Newbury Racecourse, RG14 7NZ',
      startDate: '2024-01-15',
      endDate: '2024-01-15',
      status: 'confirmed',
      estimatedDuration: 4,
      routeDistance: 45.2,
      vehicle: 'Mercedes Sprinter - ABC123',
      driver: 'John Smith',
      notes: 'Premium transport for race day. VIP service required.',
      isNightShift: false,
      driverClass: 'Class 1',
      bookingType: 'assigned' as const,
      candidate_id: 'cand-001'
    },
    {
      id: 2,
      customer: 'Newmarket Training Centre',
      pickupLocation: 'Newmarket, CB8 0XE',
      dropoffLocation: 'Doncaster Racecourse, DN2 6BB',
      startDate: '2024-01-16',
      endDate: '2024-01-16',
      status: 'open',
      estimatedDuration: 6,
      routeDistance: 120.5,
      vehicle: null,
      driver: null,
      notes: 'Training camp transport. Multiple horses. Urgent - need driver assigned.',
      isNightShift: true,
      driverClass: 'Class 2',
      bookingType: 'open' as const,
      candidate_id: null
    },
    {
      id: 3,
      customer: 'Royal Windsor Stables',
      pickupLocation: 'Windsor, SL4 3SE',
      dropoffLocation: 'Ascot Racecourse, SL5 7JX',
      startDate: '2024-01-18',
      endDate: '2024-01-19',
      status: 'in_progress',
      estimatedDuration: 2,
      routeDistance: 8.3,
      vehicle: 'Iveco Daily - GHI789',
      driver: 'Mike Thompson',
      notes: 'Short local transfer. Return journey next day.',
      isNightShift: false,
      driverClass: 'Class 1',
      bookingType: 'assigned' as const,
      candidate_id: 'cand-002'
    },
    {
      id: 4,
      customer: 'Yorkshire Equestrian Center',
      pickupLocation: 'York, YO1 9WS',
      dropoffLocation: 'Aintree Racecourse, L9 5AS',
      startDate: '2024-01-14',
      endDate: '2024-01-14',
      status: 'open',
      estimatedDuration: 3,
      routeDistance: 95.7,
      vehicle: null,
      driver: null,
      notes: 'Emergency booking - horse needs immediate transport.',
      isNightShift: false,
      driverClass: 'Class 1',
      bookingType: 'open' as const,
      candidate_id: null
    }
  ];

  // Updated mock booking data with new fields
  const openBookings = bookings.filter(booking => booking.bookingType === 'open');
  const assignedBookings = bookings.filter(booking => booking.bookingType === 'assigned');

  const filteredBookings = bookings.filter(booking =>
    booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.dropoffLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBooking = (bookingData: any) => {
    console.log('Creating booking:', bookingData);
    setIsCreateDialogOpen(false);
  };

  const handleAssignCandidate = (bookingId: number) => {
    console.log('Assigning candidate to booking:', bookingId);
    // This would open a candidate selection dialog
  };

  const handleEditBooking = (bookingId: number) => {
    console.log('Editing booking:', bookingId);
    // This would open the booking form in edit mode
  };

  const handleDateSelect = (date: Date) => {
    console.log('Selected date:', date);
  };

  const handleBookingClick = (booking: any) => {
    console.log('Clicked booking:', booking);
    // This would open booking details
  };

  const handleViewDetails = (bookingId: number) => {
    console.log('View details for booking:', bookingId);
    // This would open booking details dialog
  };

  const stats = {
    total: bookings.length,
    open: openBookings.length,
    assigned: assignedBookings.length,
    urgent: openBookings.filter(b => {
      const days = Math.ceil((new Date(b.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return days <= 1;
    }).length
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b bg-white">
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Booking</DialogTitle>
              </DialogHeader>
              <BookingForm
                customerId="sample-customer-id"
                onSubmit={handleCreateBooking}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {/* Open Bookings Section - Always visible */}
        <div className="p-4 border-b bg-gray-50">
          <OpenBookingsSection
            bookings={openBookings}
            onAssignCandidate={handleAssignCandidate}
            onEditBooking={handleEditBooking}
          />
        </div>

        {/* Search and Filter Controls - Only show in list view */}
        {activeView === 'list' && (
          <div className="p-4 border-b bg-white">
            <SearchFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
        )}

        {/* Main Content - List or Calendar View */}
        <div className="flex-1 overflow-auto p-4">
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
      </div>
    </div>
  );
};

export default BookingManagement;
