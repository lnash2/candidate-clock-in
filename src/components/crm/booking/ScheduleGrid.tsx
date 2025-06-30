
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';

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
  candidate_id?: string;
}

interface Candidate {
  id: string;
  name: string;
  driverClass: string;
}

interface ScheduleGridProps {
  bookings: BookingEvent[];
  onBookingClick: (booking: BookingEvent) => void;
}

const ScheduleGrid = ({ bookings, onBookingClick }: ScheduleGridProps) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Mock candidates data - in real app this would come from props or API
  const candidates: Candidate[] = [
    { id: 'cand-001', name: 'John Smith', driverClass: 'Class 1' },
    { id: 'cand-002', name: 'Mike Thompson', driverClass: 'Class 1' },
    { id: 'cand-003', name: 'Sarah Wilson', driverClass: 'Class 2' },
    { id: 'cand-004', name: 'David Brown', driverClass: 'Class 1' },
    { id: 'cand-005', name: 'Emma Davis', driverClass: 'Class 2' },
  ];

  // Generate 7 days starting from currentWeekStart
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getBookingForCandidateAndDate = (candidateId: string, date: Date) => {
    return bookings.find(booking => {
      const startDate = parseISO(booking.startDate);
      const endDate = parseISO(booking.endDate);
      return (
        booking.candidate_id === candidateId &&
        date >= startDate &&
        date <= endDate
      );
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

  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Schedule Grid</span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[200px] text-center">
              {format(currentWeekStart, 'MMM dd')} - {format(addDays(currentWeekStart, 6), 'MMM dd, yyyy')}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header row with dates */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="p-3 font-semibold text-sm bg-gray-50 rounded">
                Candidate
              </div>
              {weekDays.map((date) => (
                <div
                  key={date.toISOString()}
                  className={`p-3 text-center text-sm font-medium rounded ${
                    isSameDay(date, new Date()) ? 'bg-blue-50 text-blue-700' : 'bg-gray-50'
                  }`}
                >
                  <div>{format(date, 'EEE')}</div>
                  <div className="text-xs">{format(date, 'MMM dd')}</div>
                </div>
              ))}
            </div>

            {/* Candidate rows */}
            {candidates.map((candidate) => (
              <div key={candidate.id} className="grid grid-cols-8 gap-1 mb-2">
                <div className="p-3 bg-gray-50 rounded flex flex-col">
                  <span className="font-medium text-sm">{candidate.name}</span>
                  <Badge variant="outline" className="text-xs mt-1 w-fit">
                    {candidate.driverClass}
                  </Badge>
                </div>
                {weekDays.map((date) => {
                  const booking = getBookingForCandidateAndDate(candidate.id, date);
                  return (
                    <div
                      key={`${candidate.id}-${date.toISOString()}`}
                      className="p-2 min-h-[80px] border border-gray-200 rounded hover:bg-gray-50"
                    >
                      {booking ? (
                        <div
                          className={`p-2 rounded cursor-pointer text-xs ${getStatusColor(booking.status, booking.bookingType)}`}
                          onClick={() => onBookingClick(booking)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium truncate">{booking.customer}</span>
                            {booking.isNightShift ? (
                              <Moon className="w-3 h-3" />
                            ) : (
                              <Sun className="w-3 h-3" />
                            )}
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {booking.pickupLocation}
                          </div>
                          <Badge 
                            variant={booking.bookingType === 'open' ? 'destructive' : 'secondary'}
                            className="text-xs mt-1"
                          >
                            {booking.bookingType === 'open' ? 'Open' : 'Assigned'}
                          </Badge>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                          Available
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleGrid;
