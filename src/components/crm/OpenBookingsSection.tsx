
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, MapPin, User, Calendar, AlertTriangle } from 'lucide-react';

interface OpenBooking {
  id: number;
  customer: string;
  pickupLocation: string;
  dropoffLocation: string;
  startDate: string;
  endDate: string;
  driverClass: string;
  isNightShift: boolean;
  notes?: string;
}

interface OpenBookingsSectionProps {
  bookings: OpenBooking[];
  onAssignCandidate: (bookingId: number) => void;
  onEditBooking: (bookingId: number) => void;
}

const OpenBookingsSection = ({ bookings, onAssignCandidate, onEditBooking }: OpenBookingsSectionProps) => {
  if (bookings.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Open Bookings</span>
            <Badge variant="secondary">0</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              No open bookings requiring candidate assignment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getUrgencyLevel = (startDate: string) => {
    const today = new Date();
    const bookingDate = new Date(startDate);
    const diffTime = bookingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 1) return 'urgent';
    if (diffDays <= 3) return 'soon';
    return 'normal';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'overdue': return 'bg-red-100 border-red-200 text-red-800';
      case 'urgent': return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'soon': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <span>Open Bookings</span>
          <Badge variant="secondary">{bookings.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {bookings.map((booking) => {
            const urgency = getUrgencyLevel(booking.startDate);
            return (
              <div
                key={booking.id}
                className={`p-4 rounded-lg border-2 ${getUrgencyColor(urgency)}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{booking.customer}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <Badge variant="outline">{booking.driverClass}</Badge>
                      {booking.isNightShift && (
                        <Badge variant="outline" className="bg-purple-50">
                          Night Shift
                        </Badge>
                      )}
                      {urgency === 'urgent' && (
                        <Badge variant="destructive">Urgent</Badge>
                      )}
                      {urgency === 'overdue' && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => onAssignCandidate(booking.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <User className="w-3 h-3 mr-1" />
                      Assign
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onEditBooking(booking.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-medium text-green-700">From:</span>
                      <p className="text-muted-foreground">{booking.pickupLocation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <span className="font-medium text-red-700">To:</span>
                      <p className="text-muted-foreground">{booking.dropoffLocation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="font-medium">Date:</span>
                      <span className="ml-1 text-muted-foreground">
                        {booking.startDate} {booking.startDate !== booking.endDate && `to ${booking.endDate}`}
                      </span>
                    </div>
                  </div>
                </div>
                
                {booking.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="text-sm font-medium">Notes:</span>
                    <p className="text-sm text-muted-foreground mt-1">{booking.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenBookingsSection;
