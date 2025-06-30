
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Eye, Moon, Sun } from 'lucide-react';

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

interface BookingCardProps {
  booking: Booking;
  onViewDetails: (bookingId: number) => void;
}

const BookingCard = ({ booking, onViewDetails }: BookingCardProps) => {
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

  return (
    <Card className="hover:shadow-md transition-shadow">
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
          <Button variant="outline" size="sm" className="flex items-center space-x-1" onClick={() => onViewDetails(booking.id)}>
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
  );
};

export default BookingCard;
