
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import BookingCard from './BookingCard';

interface Booking {
  id: number;
  customer: string;
  pickupLocation: string;
  dropoffLocation: string;
  startDate: string;
  endDate: string;
  status: string;
  estimatedDuration: number;
  routeDistance: number;
  vehicle: string | null;
  driver: string | null;
  notes?: string;
  isNightShift: boolean;
  driverClass: string;
  bookingType: 'assigned' | 'open';
}

interface BookingsListProps {
  bookings: Booking[];
  onViewDetails: (bookingId: number) => void;
}

const BookingsList = ({ bookings, onViewDetails }: BookingsListProps) => {
  if (bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No bookings found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map(booking => (
        <BookingCard 
          key={booking.id} 
          booking={booking} 
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default BookingsList;
