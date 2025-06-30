
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, UserPlus, MessageSquare } from 'lucide-react';

interface BookingActionsMenuProps {
  bookingId: number;
  isOpen: boolean;
  onEdit: (bookingId: number) => void;
  onDelete: (bookingId: number) => void;
  onAssignCandidate: (bookingId: number) => void;
  onAddNote: (bookingId: number) => void;
}

const BookingActionsMenu = ({
  bookingId,
  isOpen,
  onEdit,
  onDelete,
  onAssignCandidate,
  onAddNote
}: BookingActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white border shadow-md z-50">
        <DropdownMenuItem onClick={() => onEdit(bookingId)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Booking
        </DropdownMenuItem>
        {isOpen && (
          <DropdownMenuItem onClick={() => onAssignCandidate(bookingId)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Assign Candidate
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onAddNote(bookingId)}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Add Note
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(bookingId)} className="text-red-600">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Booking
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookingActionsMenu;
