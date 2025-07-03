import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Note {
  id: string;
  content: string;
  note_type: string;
  candidate_id?: string;
  customer_id?: string;
  contact_id?: string;
  booking_id?: string;
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
      
      let query = supabase
        .from('notes_prod')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by entity type and ID if provided
      if (entityType && entityId) {
        switch (entityType) {
          case 'candidate':
            query = query.eq('candidate_id', entityId);
            break;
          case 'customer':
            query = query.eq('customer_id', entityId);
            break;
          case 'contact':
            query = query.eq('contact_id', entityId);
            break;
          case 'booking':
            query = query.eq('booking_id', entityId);
            break;
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('notes_prod')
        .insert(noteData)
        .select()
        .single();

      if (error) throw error;

      await fetchNotes(); // Refresh the list
      toast({
        title: 'Success',
        description: 'Note created successfully',
      });
      return data;
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
      const { error } = await supabase
        .from('notes_prod')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchNotes(); // Refresh the list
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
      const { error } = await supabase
        .from('notes_prod')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchNotes(); // Refresh the list
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