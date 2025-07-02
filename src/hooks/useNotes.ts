import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Note {
  id: string;
  content: string;
  note_type: string;
  entity_type: 'candidate' | 'customer' | 'booking';
  entity_id: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useNotes = (entityType?: string, entityId?: string) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNotes = async () => {
    try {
      setLoading(true);
      
      // For now, we'll simulate notes from legacy data
      // In future, you might want to migrate legacy notes to a dedicated notes table
      
      // Create a mock notes structure for demonstration
      const mockNotes: Note[] = [];
      
      setNotes(mockNotes);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // For now, create local notes
      const newNote: Note = {
        id: Date.now().toString(),
        ...noteData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setNotes(prev => [newNote, ...prev]);
      toast({
        title: 'Success',
        description: 'Note created successfully',
      });
      return newNote;
    } catch (err) {
      console.error('Error creating note:', err);
      toast({
        title: 'Error',
        description: 'Failed to create note',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      setNotes(prev => prev.map(note => 
        note.id === id ? { ...note, ...updates, updated_at: new Date().toISOString() } : note
      ));
      toast({
        title: 'Success',
        description: 'Note updated successfully',
      });
    } catch (err) {
      console.error('Error updating note:', err);
      toast({
        title: 'Error',
        description: 'Failed to update note',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      setNotes(prev => prev.filter(note => note.id !== id));
      toast({
        title: 'Success',
        description: 'Note deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting note:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [entityType, entityId]);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
};