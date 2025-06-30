
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AddNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateId: string;
  candidateName: string;
  onAddNote: (candidateId: string, note: string) => void;
}

const AddNoteDialog = ({ 
  open, 
  onOpenChange, 
  candidateId, 
  candidateName, 
  onAddNote 
}: AddNoteDialogProps) => {
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (note.trim()) {
      onAddNote(candidateId, note);
      setNote('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Note for {candidateName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              placeholder="Enter your note here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!note.trim()}>
              Add Note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteDialog;
