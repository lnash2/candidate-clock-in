
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface BookingStatsProps {
  total: number;
  open: number;
  assigned: number;
  urgent: number;
}

const BookingStats = ({ total, open, assigned, urgent }: BookingStatsProps) => {
  return (
    <div className="flex items-center space-x-4 mt-2">
      <Badge variant="outline">Total: {total}</Badge>
      <Badge variant="outline" className="bg-orange-50">Open: {open}</Badge>
      <Badge variant="outline" className="bg-blue-50">Assigned: {assigned}</Badge>
      {urgent > 0 && (
        <Badge variant="destructive">Urgent: {urgent}</Badge>
      )}
    </div>
  );
};

export default BookingStats;
