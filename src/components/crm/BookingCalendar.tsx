
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Moon, Sun, MapPin } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';

interface BookingEvent {
  id: number;
  customer: string;
  pickupLocation: string;
  dropoffLocation: string;
  startDate: string;
  endDate: string;
  status: string;
  isNightShift: boolean;
  driverClass: string;
  bookingType: 'open' | 'assigned';
  driver?: string;
}

interface BookingCalendarProps {
  bookings: BookingEvent[];
  onDateSelect: (date: Date) => void;
  onBookingClick: (booking: BookingEvent) => void;
}

const BookingCalendar = ({ bookings, onDateSelect, onBookingClick }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => {
      const startDate = parseISO(booking.startDate);
      const endDate = parseISO(booking.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  const getStatusColor = (status: string, bookingType: string) => {
    if (bookingType === 'open') return 'bg-orange-100 text-orange-800 border-orange-300';
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onDateSelect(date);
    }
  };

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  const modifiers = {
    hasBookings: (date: Date) => getBookingsForDate(date).length > 0,
    hasOpenBookings: (date: Date) => getBookingsForDate(date).some(b => b.bookingType === 'open'),
  };

  const modifiersStyles = {
    hasBookings: {
      backgroundColor: '#dbeafe',
      borderRadius: '4px',
    },
    hasOpenBookings: {
      backgroundColor: '#fed7aa',
      borderRadius: '4px',
      fontWeight: 'bold',
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Calendar</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-[120px] text-center">
                  {format(currentMonth, 'MMMM yyyy')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border"
            />
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-200 rounded"></div>
                <span>Has Bookings</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-200 rounded font-bold"></div>
                <span>Open Bookings</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, 'EEEE, MMMM do') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateBookings.length === 0 ? (
              <p className="text-muted-foreground text-sm">No bookings for this date.</p>
            ) : (
              <div className="space-y-3">
                {selectedDateBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(booking.status, booking.bookingType)}`}
                    onClick={() => onBookingClick(booking)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{booking.customer}</h4>
                      {booking.isNightShift ? (
                        <Moon className="w-4 h-4" />
                      ) : (
                        <Sun className="w-4 h-4" />
                      )}
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-green-500" />
                        <span className="truncate">{booking.pickupLocation}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        <span className="truncate">{booking.dropoffLocation}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">
                        {booking.driverClass}
                      </Badge>
                      <Badge 
                        variant={booking.bookingType === 'open' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {booking.bookingType === 'open' ? 'Open' : 'Assigned'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingCalendar;
