
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Moon, Sun, Plus, StickyNote, User } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import CandidateInfoPopover from './CandidateInfoPopover';
import AddNoteDialog from './AddNoteDialog';
import BookingActionsMenu from './BookingActionsMenu';

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
  phone?: string;
  email?: string;
  location?: string;
  jobCategories?: string[];
}

interface ScheduleGridProps {
  bookings: BookingEvent[];
  onBookingClick: (booking: BookingEvent) => void;
  onCreateBooking?: () => void;
}

const ScheduleGrid = ({ bookings, onBookingClick, onCreateBooking }: ScheduleGridProps) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Enhanced mock candidates data with contact information
  const candidates: Candidate[] = [
    { 
      id: 'cand-001', 
      name: 'John Smith', 
      driverClass: 'C1 Class 1',
      phone: '+44 7903 456789',
      email: 'john.smith@email.com',
      location: 'London, UK',
      jobCategories: ['HGV Driver', 'C+E Driver']
    },
    { 
      id: 'cand-002', 
      name: 'Mike Thompson', 
      driverClass: 'C1 Class 1',
      phone: '+44 7912 654321',
      email: 'mike.thompson@email.com',
      location: 'Manchester, UK',
      jobCategories: ['HGV Driver', 'Warehouse Operative']
    },
    { 
      id: 'cand-003', 
      name: 'Sarah Wilson', 
      driverClass: 'C1 Class 2',
      phone: '+44 7845 789012',
      email: 'sarah.wilson@email.com',
      location: 'Birmingham, UK',
      jobCategories: ['C1 Driver', 'Production Operative']
    },
    { 
      id: 'cand-004', 
      name: 'David Brown', 
      driverClass: 'C1 Class 1',
      phone: '+44 7756 345678',
      email: 'david.brown@email.com',
      location: 'Leeds, UK',
      jobCategories: ['HGV Driver', 'Refuse Loader']
    },
    { 
      id: 'cand-005', 
      name: 'Emma Davis', 
      driverClass: 'C1 Class 2',
      phone: '+44 7689 012345',
      email: 'emma.davis@email.com',
      location: 'Liverpool, UK',
      jobCategories: ['C1 Driver', 'Warehouse Operative']
    },
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

  const handleAddCandidateNote = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setNoteDialogOpen(true);
  };

  const handleAddNote = (candidateId: string, note: string) => {
    console.log('Adding note for candidate:', candidateId, note);
    // This would typically call an API to save the note
  };

  const handleEditBooking = (bookingId: number) => {
    console.log('Edit booking:', bookingId);
  };

  const handleDeleteBooking = (bookingId: number) => {
    console.log('Delete booking:', bookingId);
  };

  const handleAssignCandidate = (bookingId: number) => {
    console.log('Assign candidate to booking:', bookingId);
  };

  const handleAddBookingNote = (bookingId: number) => {
    console.log('Add note to booking:', bookingId);
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Booking Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Schedule Grid</h2>
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
        </div>
        <Button onClick={onCreateBooking} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Booking
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Header row with dates */}
              <div className="grid grid-cols-8 gap-px bg-gray-200">
                <div className="p-4 font-semibold text-sm bg-gray-50 border-r">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Candidate</span>
                  </div>
                </div>
                {weekDays.map((date) => (
                  <div
                    key={date.toISOString()}
                    className={`p-4 text-center text-sm font-medium ${
                      isSameDay(date, new Date()) ? 'bg-blue-50 text-blue-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold">{format(date, 'EEE')}</div>
                    <div className="text-xs text-gray-600">{format(date, 'dd MMM')}</div>
                  </div>
                ))}
              </div>

              {/* Candidate rows */}
              {candidates.map((candidate) => (
                <div key={candidate.id} className="grid grid-cols-8 gap-px bg-gray-200 border-b">
                  <div className="p-3 bg-white border-r flex items-center justify-between">
                    <CandidateInfoPopover candidate={candidate}>
                      <div className="cursor-pointer hover:bg-gray-50 p-2 rounded flex-1">
                        <div className="font-medium text-sm">{candidate.name}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {candidate.driverClass}
                        </Badge>
                        {candidate.jobCategories && (
                          <div className="mt-1">
                            {candidate.jobCategories.slice(0, 2).map((category, index) => (
                              <Badge key={index} variant="secondary" className="text-xs mr-1">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CandidateInfoPopover>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddCandidateNote(candidate)}
                      className="h-6 w-6 p-0 ml-2"
                    >
                      <StickyNote className="w-3 h-3" />
                    </Button>
                  </div>
                  {weekDays.map((date) => {
                    const booking = getBookingForCandidateAndDate(candidate.id, date);
                    return (
                      <div
                        key={`${candidate.id}-${date.toISOString()}`}
                        className="p-2 min-h-[100px] bg-white hover:bg-gray-50 relative"
                      >
                        {booking ? (
                          <div
                            className={`p-2 rounded cursor-pointer text-xs h-full ${getStatusColor(booking.status, booking.bookingType)} relative`}
                            onClick={() => onBookingClick(booking)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium truncate">{booking.customer}</span>
                              <div className="flex items-center space-x-1">
                                {booking.isNightShift ? (
                                  <Moon className="w-3 h-3" />
                                ) : (
                                  <Sun className="w-3 h-3" />
                                )}
                                <BookingActionsMenu
                                  bookingId={booking.id}
                                  isOpen={booking.bookingType === 'open'}
                                  onEdit={handleEditBooking}
                                  onDelete={handleDeleteBooking}
                                  onAssignCandidate={handleAssignCandidate}
                                  onAddNote={handleAddBookingNote}
                                />
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 truncate mb-1">
                              {booking.pickupLocation}
                            </div>
                            <Badge 
                              variant={booking.bookingType === 'open' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {booking.bookingType === 'open' ? 'Open' : 'Assigned'}
                            </Badge>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-400 text-xs border-2 border-dashed border-gray-200 rounded">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={onCreateBooking}
                              className="text-xs text-gray-500 hover:text-gray-700 h-auto p-2"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </Button>
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

      {/* Add Note Dialog */}
      <AddNoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        candidateId={selectedCandidate?.id || ''}
        candidateName={selectedCandidate?.name || ''}
        onAddNote={handleAddNote}
      />
    </div>
  );
};

export default ScheduleGrid;
