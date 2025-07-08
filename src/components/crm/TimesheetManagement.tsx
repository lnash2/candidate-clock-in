import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Clock, Calendar } from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TimesheetEntry {
  candidateId: number;
  candidateName: string;
  date: string;
  startTime: Date | null;
  endTime: Date | null;
  totalHours: number;
  isActive: boolean;
  status: 'not_started' | 'in_progress' | 'completed';
}

const TimesheetManagement = () => {
  const { bookings, loading: bookingsLoading } = useBookings();
  const { toast } = useToast();
  
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntry[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [candidates, setCandidates] = useState<any[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);

  // Generate dates for the current week
  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedWeek);

  // Fetch candidates that are referenced in approved bookings
  useEffect(() => {
    const fetchRequiredCandidates = async () => {
      if (bookingsLoading || !bookings.length) return;
      
      setCandidatesLoading(true);
      
      // Get unique candidate IDs from approved bookings
      const approvedBookings = bookings.filter(b => b.booking_status === 'approved');
      const candidateIds = [...new Set(approvedBookings.map(b => b.candidate_id).filter(Boolean))];
      
      console.log('Need to fetch candidates for IDs:', candidateIds);
      
      if (candidateIds.length === 0) {
        setCandidates([]);
        setCandidatesLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('candidates')
          .select('id, name')
          .in('id', candidateIds);
          
        if (error) {
          console.error('Error fetching candidates:', error);
          setCandidates([]);
        } else {
          console.log('Fetched candidates:', data);
          setCandidates(data || []);
        }
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setCandidates([]);
      } finally {
        setCandidatesLoading(false);
      }
    };
    
    fetchRequiredCandidates();
  }, [bookings, bookingsLoading]);

  useEffect(() => {
    if (!bookingsLoading && !candidatesLoading) {
      console.log('Processing bookings for timesheet:', bookings.length);
      console.log('Selected week dates:', weekDates.map(d => d.toISOString().split('T')[0]));
      
      // Get the start and end of the selected week as Unix timestamps
      const weekStart = Math.floor(weekDates[0].getTime() / 1000);
      const weekEnd = Math.floor(weekDates[6].getTime() / 1000) + (24 * 60 * 60) - 1; // End of last day
      
      console.log('Week range (Unix):', weekStart, 'to', weekEnd);
      console.log('Week range (dates):', new Date(weekStart * 1000), 'to', new Date(weekEnd * 1000));

      // Get approved bookings that overlap with the selected week
      const activeBookings = bookings.filter(booking => {
        const isApproved = booking.booking_status === 'approved';
        
        if (!isApproved) {
          return false;
        }

        // Check if booking date range overlaps with selected week
        const bookingStart = booking.from_date; // Unix timestamp
        const bookingEnd = booking.to_date; // Unix timestamp
        
        const hasOverlap = bookingStart <= weekEnd && bookingEnd >= weekStart;
        
        console.log(`Booking ${booking.id}:`, {
          status: booking.booking_status,
          fromDate: new Date(bookingStart * 1000),
          toDate: new Date(bookingEnd * 1000),
          hasOverlap,
          candidateName: booking.candidates?.name || 'Unknown'
        });
        
        return hasOverlap;
      });

      console.log('Filtered active bookings:', activeBookings.length);
      console.log('Available candidates:', candidates.length);
      console.log('Sample candidates:', candidates.slice(0, 3).map(c => ({ id: c.id, name: c.name })));

      // Create timesheet entries for each candidate for each day of the week
      const entries: TimesheetEntry[] = [];
      
      activeBookings.forEach(booking => {
        console.log('Processing booking:', booking.id, 'candidate_id:', booking.candidate_id, 'candidate_name from booking:', booking.candidates?.name);
        const candidate = candidates.find(c => c.id === booking.candidate_id);
        console.log('Found candidate:', candidate ? { id: candidate.id, name: candidate.name } : 'NOT FOUND');
        if (candidate) {
          weekDates.forEach(date => {
            const dateStr = date.toISOString().split('T')[0];
            const dayTimestamp = Math.floor(date.getTime() / 1000);
            
            // Only create entry if this specific day falls within the booking period
            if (dayTimestamp >= booking.from_date && dayTimestamp <= booking.to_date) {
              entries.push({
                candidateId: candidate.id,
                candidateName: candidate.name || booking.candidates?.name || 'Unknown',
                date: dateStr,
                startTime: null,
                endTime: null,
                totalHours: 0,
                isActive: false,
                status: 'not_started'
              });
            }
          });
        }
      });

      console.log('Generated timesheet entries:', entries.length);
      setTimesheetEntries(entries);
    }
  }, [bookings, candidates, bookingsLoading, candidatesLoading, selectedWeek]);

  const handleStartTimer = (candidateId: number, date: string) => {
    setTimesheetEntries(prev => prev.map(entry => 
      entry.candidateId === candidateId && entry.date === date
        ? {
            ...entry,
            startTime: new Date(),
            isActive: true,
            status: 'in_progress'
          }
        : entry
    ));

    toast({
      title: "Timer Started",
      description: "Time tracking has begun for this candidate.",
    });
  };

  const handleStopTimer = (candidateId: number, date: string) => {
    setTimesheetEntries(prev => prev.map(entry => {
      if (entry.candidateId === candidateId && entry.date === date && entry.startTime) {
        const endTime = new Date();
        const totalHours = (endTime.getTime() - entry.startTime.getTime()) / (1000 * 60 * 60);
        
        return {
          ...entry,
          endTime,
          totalHours: Math.round(totalHours * 100) / 100,
          isActive: false,
          status: 'completed'
        };
      }
      return entry;
    }));

    toast({
      title: "Timer Stopped",
      description: "Time has been recorded successfully.",
    });
  };

  const getEntry = (candidateId: number, date: string) => {
    return timesheetEntries.find(entry => 
      entry.candidateId === candidateId && entry.date === date
    );
  };

  const getUniqueActiveCandidates = () => {
    const activeCandidateIds = new Set(timesheetEntries.map(entry => entry.candidateId));
    return Array.from(activeCandidateIds).map(candidateId => {
      const entry = timesheetEntries.find(e => e.candidateId === candidateId);
      return {
        id: candidateId,
        name: entry?.candidateName || 'Unknown'
      };
    });
  };

  const getStatusBadge = (status: TimesheetEntry['status']) => {
    switch (status) {
      case 'not_started':
        return <Badge variant="secondary">Not Started</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-green-500">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const activeCandidates = getUniqueActiveCandidates();

  if (bookingsLoading || candidatesLoading) {
    return (
      <div className="h-full bg-white pl-5 pr-6 py-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
            <p>Loading timesheet data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white pl-5 pr-6 py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timesheet Management</h1>
          <p className="text-gray-600">Track working hours for active bookings</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
          >
            Previous Week
          </Button>
          <span className="font-medium">
            Week of {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
          </span>
          <Button
            variant="outline"
            onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
          >
            Next Week
          </Button>
        </div>
      </div>

      {activeCandidates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Approved Bookings</h3>
            <p className="text-gray-600">There are no approved bookings to track time for this week.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Weekly Timesheet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Candidate</th>
                    {weekDates.map(date => (
                      <th key={date.toISOString()} className="text-center p-3 font-medium min-w-[140px]">
                        <div className="flex flex-col">
                          <span className="text-sm">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <span className="text-xs text-gray-500">{date.getDate()}/{date.getMonth() + 1}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeCandidates.map(candidate => (
                    <tr key={candidate.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">
                        {candidate.name}
                      </td>
                      {weekDates.map(date => {
                        const dateStr = date.toISOString().split('T')[0];
                        const entry = getEntry(candidate.id, dateStr);
                        
                        return (
                          <td key={dateStr} className="p-3 text-center">
                            <div className="flex flex-col items-center gap-2">
                              {entry?.status === 'not_started' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStartTimer(candidate.id, dateStr)}
                                  className="w-full"
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Start
                                </Button>
                              )}
                              
                              {entry?.status === 'in_progress' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleStopTimer(candidate.id, dateStr)}
                                  className="w-full"
                                >
                                  <Square className="h-4 w-4 mr-1" />
                                  Stop
                                </Button>
                              )}
                              
                              {entry?.status === 'completed' && (
                                <div className="text-center">
                                  <div className="text-sm font-medium">
                                    {entry.totalHours}h
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStartTimer(candidate.id, dateStr)}
                                    className="w-full mt-1"
                                  >
                                    Restart
                                  </Button>
                                </div>
                              )}
                              
                              {entry && (
                                <div className="text-xs">
                                  {getStatusBadge(entry.status)}
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {activeCandidates.length}
              </div>
              <div className="text-sm text-gray-600">Approved Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {timesheetEntries.filter(e => e.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {timesheetEntries.filter(e => e.status === 'in_progress').length}
              </div>
              <div className="text-sm text-gray-600">Active Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {timesheetEntries.reduce((total, entry) => total + entry.totalHours, 0).toFixed(1)}h
              </div>
              <div className="text-sm text-gray-600">Total Hours</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimesheetManagement;