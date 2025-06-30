import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Search, Filter, Eye, MapPin, Clock, Plus, Moon, Sun, Grid, List } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingForm from './BookingForm';
import OpenBookingsSection from './OpenBookingsSection';
import BookingCalendar from './BookingCalendar';

const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2024-01-01');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState('list');

  // Updated mock booking data with new fields
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
      candidateId: 'cand-001'
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
      candidateId: null
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
      candidateId: 'cand-002'
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
      candidateId: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'open': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-muted-foreground">Track and manage all transportation bookings</p>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="outline">Total: {stats.total}</Badge>
            <Badge variant="outline" className="bg-orange-50">Open: {stats.open}</Badge>
            <Badge variant="outline" className="bg-blue-50">Assigned: {stats.assigned}</Badge>
            {stats.urgent > 0 && (
              <Badge variant="destructive">Urgent: {stats.urgent}</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center border rounded-lg">
            <Button
              variant={activeView === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('list')}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
            <Button
              variant={activeView === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('calendar')}
            >
              <Grid className="w-4 h-4 mr-1" />
              Calendar
            </Button>
          </div>
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

      {/* Open Bookings Section - Always visible */}
      <OpenBookingsSection
        bookings={openBookings}
        onAssignCandidate={handleAssignCandidate}
        onEditBooking={handleEditBooking}
      />

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search bookings..."
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

      {/* Main Content - List or Calendar View */}
      {activeView === 'calendar' ? (
        <BookingCalendar
          bookings={filteredBookings}
          onDateSelect={handleDateSelect}
          onBookingClick={handleBookingClick}
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold">{booking.customer}</h3>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      {booking.isNightShift ? (
                        <>
                          <Moon className="w-3 h-3" />
                          <span>Night Shift</span>
                        </>
                      ) : (
                        <>
                          <Sun className="w-3 h-3" />
                          <span>Day Shift</span>
                        </>
                      )}
                    </Badge>
                    <Badge variant="secondary">{booking.driverClass}</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>View Details</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium text-green-700">Pickup:</span>
                        <p className="text-sm text-muted-foreground">{booking.pickupLocation}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium text-red-700">Dropoff:</span>
                        <p className="text-sm text-muted-foreground">{booking.dropoffLocation}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <div className="text-sm">
                        <span className="font-medium">Duration:</span>
                        <span className="ml-1 text-muted-foreground">{booking.estimatedDuration} hours</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium">Date:</span>
                      <span className="ml-1 text-muted-foreground">
                        {booking.startDate} {booking.startDate !== booking.endDate && `to ${booking.endDate}`}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium">Vehicle:</span>
                      <span className="ml-1 text-muted-foreground">{booking.vehicle}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium">Driver:</span>
                      <span className="ml-1 text-muted-foreground">{booking.driver}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium">Distance:</span>
                      <span className="ml-1 text-muted-foreground">{booking.routeDistance} miles</span>
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-sm font-medium">Notes:</span>
                    <p className="text-sm text-muted-foreground mt-1">{booking.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
