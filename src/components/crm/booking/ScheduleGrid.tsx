import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Moon, Sun, Plus, StickyNote, User, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import CandidateInfoPopover from './CandidateInfoPopover';
import AddNoteDialog from './AddNoteDialog';
import BookingActionsMenu from './BookingActionsMenu';
import AvailabilityDialog from './AvailabilityDialog';

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
  available?: boolean;
}

interface ScheduleGridProps {
  bookings: BookingEvent[];
  onBookingClick: (booking: BookingEvent) => void;
  onCreateBooking?: () => void;
}

type SortOrder = 'asc' | 'desc' | null;

const ScheduleGrid = ({ bookings, onBookingClick, onCreateBooking }: ScheduleGridProps) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [candidateAvailability, setCandidateAvailability] = useState<{[key: string]: {[key: string]: boolean}}>({});

  // Enhanced mock candidates data with contact information
  const candidatesData: Candidate[] = [
    { 
      id: 'cand-001', 
      name: 'John Smith', 
      driverClass: 'C1 Class 1',
      phone: '+44 7903 456789',
      email: 'john.smith@email.com',
      location: 'London, UK',
      jobCategories: ['HGV Driver', 'C+E Driver'],
      available: true
    },
    { 
      id: 'cand-002', 
      name: 'Mike Thompson', 
      driverClass: 'C1 Class 1',
      phone: '+44 7912 654321',
      email: 'mike.thompson@email.com',
      location: 'Manchester, UK',
      jobCategories: ['HGV Driver', 'Warehouse Operative'],
      available: true
    },
    { 
      id: 'cand-003', 
      name: 'Sarah Wilson', 
      driverClass: 'C1 Class 2',
      phone: '+44 7845 789012',
      email: 'sarah.wilson@email.com',
      location: 'Birmingham, UK',
      jobCategories: ['C1 Driver', 'Production Operative'],
      available: false
    },
    { 
      id: 'cand-004', 
      name: 'David Brown', 
      driverClass: 'C1 Class 1',
      phone: '+44 7756 345678',
      email: 'david.brown@email.com',
      location: 'Leeds, UK',
      jobCategories: ['HGV Driver', 'Refuse Loader'],
      available: true
    },
    { 
      id: 'cand-005', 
      name: 'Emma Davis', 
      driverClass: 'C1 Class 2',
      phone: '+44 7689 012345',
      email: 'emma.davis@email.com',
      location: 'Liverpool, UK',
      jobCategories: ['C1 Driver', 'Warehouse Operative'],
      available: true
    },
  ];

  // Sort candidates based on current sort order
  const candidates = React.useMemo(() => {
    if (!sortOrder) return candidatesData;
    
    return [...candidatesData].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [sortOrder]);

  const handleSort = () => {
    if (sortOrder === null) {
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder(null);
    }
  };

  const getSortIcon = () => {
    if (sortOrder === 'asc') return <ChevronUp className="w-3 h-3 ml-1" />;
    if (sortOrder === 'desc') return <ChevronDown className="w-3 h-3 ml-1" />;
    return <ArrowUpDown className="w-3 h-3 ml-1" />;
  };

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

  const getAvailabilityColor = (isAvailable: boolean) => {
    return isAvailable 
      ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
      : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100';
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

  const handleOpenCandidateRecord = (candidateId: string) => {
    console.log('Opening candidate record:', candidateId);
    // This would typically navigate to the candidate detail page or open a dialog
    // For now, we'll just log it - in a real implementation, this would integrate with your routing
  };

  const handleAddCandidateNote = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setNoteDialogOpen(true);
  };

  const handleAddNote = (candidateId: string, note: string) => {
    console.log('Adding note for candidate:', candidateId, note);
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

  const handleAvailabilityChange = (candidateId: string, date: Date, available: boolean) => {
    const dateString = format(date, 'yyyy-MM-dd');
    setCandidateAvailability(prev => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        [dateString]: available
      }
    }));
    console.log('Candidate availability changed:', candidateId, dateString, available);
  };

  const handleOpenAvailabilityDialog = (candidate: Candidate, date: Date) => {
    setSelectedCandidate(candidate);
    setSelectedDate(date);
    setAvailabilityDialogOpen(true);
  };

  const handleSaveAvailability = (candidateId: string, startDate: Date, endDate: Date, available: boolean) => {
    const currentDate = new Date(startDate);
    const updates = { ...candidateAvailability };
    
    if (!updates[candidateId]) {
      updates[candidateId] = {};
    }
    
    while (currentDate <= endDate) {
      const dateString = format(currentDate, 'yyyy-MM-dd');
      updates[candidateId][dateString] = available;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setCandidateAvailability(updates);
    console.log('Availability updated for candidate:', candidateId, 'from', startDate, 'to', endDate, 'available:', available);
  };

  const getCandidateAvailability = (candidateId: string, date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return candidateAvailability[candidateId]?.[dateString] ?? true;
  };

  const handleAvailabilityClick = (candidate: Candidate, date: Date) => {
    // Check if there's already a booking
    const booking = getBookingForCandidateAndDate(candidate.id, date);
    if (booking) {
      onBookingClick(booking);
    } else {
      handleOpenAvailabilityDialog(candidate, date);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with Add Booking Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Schedule Grid</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}>
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
            <div className="min-w-[1400px]">
              {/* Header row with dates */}
              <div className="flex bg-gray-50 border-b border-gray-200">
                <div className="w-[350px] p-3 font-semibold text-sm bg-gray-100 border-r border-gray-200 sticky left-0 z-10">
                  <div className="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors" onClick={handleSort}>
                    <User className="w-4 h-4 mr-2 text-gray-600" />
                    <span>Candidate Details</span>
                    {getSortIcon()}
                  </div>
                </div>
                {weekDays.map((date) => (
                  <div
                    key={date.toISOString()}
                    className={`flex-1 p-3 text-center text-sm font-medium min-w-[120px] border-r border-gray-200 last:border-r-0 ${
                      isSameDay(date, new Date()) ? 'bg-blue-50 text-blue-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold">{format(date, 'EEE')}</div>
                    <div className="text-xs text-gray-600 mt-1">{format(date, 'dd MMM')}</div>
                  </div>
                ))}
              </div>

              {/* Candidate rows */}
              {candidates.map((candidate, index) => (
                <div key={candidate.id} className={`flex border-b border-gray-200 h-12 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  {/* Candidate details */}
                  <div className="w-[350px] bg-white border-r border-gray-200 sticky left-0 z-10 flex items-center justify-between h-12 px-3">
                    <CandidateInfoPopover candidate={candidate} onOpenRecord={handleOpenCandidateRecord}>
                      <div className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded flex-1 min-w-0 transition-colors flex items-center space-x-3">
                        <div className="font-medium text-sm text-blue-600 hover:text-blue-800 truncate min-w-0">
                          {candidate.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {candidate.phone}
                        </div>
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200 flex-shrink-0">
                          {candidate.driverClass}
                        </Badge>
                      </div>
                    </CandidateInfoPopover>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddCandidateNote(candidate)}
                      className="h-6 w-6 p-0 ml-2 flex-shrink-0 hover:bg-gray-100"
                    >
                      <StickyNote className="w-3 h-3 text-gray-500" />
                    </Button>
                  </div>
                  
                  {/* Date columns */}
                  {weekDays.map((date) => {
                    const booking = getBookingForCandidateAndDate(candidate.id, date);
                    const isAvailable = getCandidateAvailability(candidate.id, date);
                    
                    return (
                      <div
                        key={`${candidate.id}-${date.toISOString()}`}
                        className="flex-1 bg-white h-12 flex items-center justify-center px-2 border-r border-gray-200 last:border-r-0"
                      >
                        {booking ? (
                          <div
                            className={`px-2 py-1 rounded text-xs w-full h-8 flex items-center justify-between cursor-pointer transition-colors ${getStatusColor(booking.status, booking.bookingType)}`}
                            onClick={() => onBookingClick(booking)}
                          >
                            <span className="font-medium truncate flex-1 text-xs">{booking.customer}</span>
                            <div className="flex items-center space-x-1 flex-shrink-0 ml-1">
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
                        ) : (
                          <div
                            className={`px-2 py-1 rounded text-xs w-full h-8 flex items-center justify-center cursor-pointer transition-colors ${getAvailabilityColor(isAvailable)}`}
                            onClick={() => handleAvailabilityClick(candidate, date)}
                          >
                            <span className="font-medium text-xs">
                              {isAvailable ? 'Available' : 'Unavailable'}
                            </span>
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

      {/* Dialogs */}
      <AddNoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        candidateId={selectedCandidate?.id || ''}
        candidateName={selectedCandidate?.name || ''}
        onAddNote={handleAddNote}
      />

      <AvailabilityDialog
        open={availabilityDialogOpen}
        onOpenChange={setAvailabilityDialogOpen}
        candidateId={selectedCandidate?.id || ''}
        candidateName={selectedCandidate?.name || ''}
        initialDate={selectedDate || new Date()}
        onSaveAvailability={handleSaveAvailability}
      />
    </div>
  );
};

export default ScheduleGrid;
