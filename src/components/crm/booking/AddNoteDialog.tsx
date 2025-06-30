
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NoteType {
  id: string;
  name: string;
  color: string;
}

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
  const [selectedNoteType, setSelectedNoteType] = useState<string>('');
  const [noteTypes, setNoteTypes] = useState<NoteType[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchNoteTypes();
    }
  }, [open]);

  const fetchNoteTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('note_types')
        .select('*')
        .order('name');

      if (error) throw error;
      setNoteTypes(data || []);
    } catch (error) {
      console.error('Error fetching note types:', error);
      toast({
        title: 'Error',
        description: 'Failed to load note types',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = () => {
    if (note.trim() && selectedNoteType) {
      onAddNote(candidateId, note);
      setNote('');
      setSelectedNoteType('');
      onOpenChange(false);
    }
  };

  const selectedType = noteTypes.find(type => type.id === selectedNoteType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Note for {candidateName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="noteType">Note Type</Label>
            <Select value={selectedNoteType} onValueChange={setSelectedNoteType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a note type..." />
              </SelectTrigger>
              <SelectContent>
                {noteTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: type.color }}
                      />
                      <span>{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
            <Button 
              onClick={handleSubmit} 
              disabled={!note.trim() || !selectedNoteType}
            >
              Add Note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteDialog;
