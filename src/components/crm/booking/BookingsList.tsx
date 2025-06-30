
import React from 'react';
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
