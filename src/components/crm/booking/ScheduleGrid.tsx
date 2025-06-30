import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, Moon, Sun, Plus, StickyNote, User, Pencil, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import CandidateInfoPopover from './CandidateInfoPopover';
import AddNoteDialog from './AddNoteDialog';
import BookingActionsMenu from './BookingActionsMenu';
import AvailabilityDialog from './AvailabilityDialog';
import AvailabilityStatusIndicator from './AvailabilityStatusIndicator';

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
  // Track availability per candidate per day: candidateId -> dateString -> boolean
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
    // Set availability for the date range
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
    return candidateAvailability[candidateId]?.[dateString] ?? true; // Default to available
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
            <div className="min-w-[1400px]">
              {/* Header row with dates */}
              <div className="grid grid-cols-8 gap-px bg-gray-200">
                <div className="p-3 font-semibold text-sm bg-gray-50 border-r min-w-[600px]">
                  <div className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded" onClick={handleSort}>
                    <User className="w-4 h-4 mr-2" />
                    <span>Candidate Details</span>
                    {getSortIcon()}
                  </div>
                </div>
                {weekDays.map((date) => (
                  <div
                    key={date.toISOString()}
                    className={`p-2 text-center text-xs font-medium min-w-[140px] ${
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
                  {/* Expanded candidate details with full information */}
                  <div className="p-4 bg-white border-r flex items-center justify-between min-h-[80px]">
                    <CandidateInfoPopover candidate={candidate}>
                      <div className="cursor-pointer hover:bg-gray-50 p-3 rounded flex-1 min-w-0 grid grid-cols-4 gap-4 items-center">
                        {/* Name and Driver Class */}
                        <div className="space-y-1">
                          <div className="font-semibold text-sm text-blue-600 hover:text-blue-800">
                            {candidate.name}
                          </div>
                          <Badge variant="outline" className="text-xs px-2 py-1 h-6">
                            {candidate.driverClass}
                          </Badge>
                        </div>
                        
                        {/* Contact Information */}
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="truncate">{candidate.phone}</div>
                          <div className="truncate">{candidate.email}</div>
                        </div>
                        
                        {/* Location */}
                        <div className="text-xs text-gray-500">
                          <div className="truncate">{candidate.location}</div>
                        </div>
                        
                        {/* Job Categories */}
                        <div className="text-xs">
                          {candidate.jobCategories && candidate.jobCategories.length > 0 && (
                            <div className="space-y-1">
                              {candidate.jobCategories.slice(0, 2).map((category, index) => (
                                <Badge key={index} variant="secondary" className="text-xs mr-1 mb-1">
                                  {category}
                                </Badge>
                              ))}
                              {candidate.jobCategories.length > 2 && (
                                <span className="text-gray-400">+{candidate.jobCategories.length - 2} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CandidateInfoPopover>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddCandidateNote(candidate)}
                      className="h-8 w-8 p-0 ml-3 flex-shrink-0"
                    >
                      <StickyNote className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Date columns with availability indicator and booking area */}
                  {weekDays.map((date) => {
                    const booking = getBookingForCandidateAndDate(candidate.id, date);
                    const isAvailable = getCandidateAvailability(candidate.id, date);
                    
                    return (
                      <div
                        key={`${candidate.id}-${date.toISOString()}`}
                        className="bg-white min-h-[80px] flex flex-col"
                      >
                        {/* Top section: Availability indicator and pencil */}
                        <div className="p-1 border-b border-gray-100 flex items-center justify-between h-8 bg-gray-25">
                          <AvailabilityStatusIndicator isAvailable={isAvailable} />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenAvailabilityDialog(candidate, date)}
                            className="h-5 w-5 p-0 ml-1 flex-shrink-0 hover:bg-gray-200"
                          >
                            <Pencil className="w-3 h-3 text-gray-500" />
                          </Button>
                        </div>
                        
                        {/* Bottom section: Booking area */}
                        <div className="p-1 flex-1 hover:bg-gray-50 relative">
                          {booking ? (
                            <div
                              className={`p-2 rounded cursor-pointer text-xs h-full ${getStatusColor(booking.status, booking.bookingType)} relative`}
                              onClick={() => onBookingClick(booking)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium truncate text-xs flex-1">{booking.customer}</span>
                                <div className="flex items-center space-x-0.5 flex-shrink-0">
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
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={onCreateBooking}
                                className="text-xs text-gray-400 hover:text-gray-600 h-auto p-1"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
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

      {/* Availability Dialog */}
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
