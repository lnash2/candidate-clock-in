
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import NoteTypeFormDialog from './settings/NoteTypeFormDialog';

interface NoteType {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

const Settings = () => {
  const [noteTypes, setNoteTypes] = useState<NoteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNoteType, setEditingNoteType] = useState<NoteType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchNoteTypes();
  }, []);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNoteType = () => {
    setEditingNoteType(null);
    setDialogOpen(true);
  };

  const handleEditNoteType = (noteType: NoteType) => {
    setEditingNoteType(noteType);
    setDialogOpen(true);
  };

  const handleDeleteNoteType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('note_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNoteTypes(noteTypes.filter(type => type.id !== id));
      toast({
        title: 'Success',
        description: 'Note type deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting note type:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete note type',
        variant: 'destructive',
      });
    }
  };

  const handleSaveNoteType = async (name: string, color: string) => {
    try {
      if (editingNoteType) {
        // Update existing note type
        const { data, error } = await supabase
          .from('note_types')
          .update({ name, color })
          .eq('id', editingNoteType.id)
          .select()
          .single();

        if (error) throw error;

        setNoteTypes(noteTypes.map(type => 
          type.id === editingNoteType.id ? data : type
        ));
        toast({
          title: 'Success',
          description: 'Note type updated successfully',
        });
      } else {
        // Create new note type
        const { data, error } = await supabase
          .from('note_types')
          .insert([{ name, color }])
          .select()
          .single();

        if (error) throw error;

        setNoteTypes([...noteTypes, data]);
        toast({
          title: 'Success',
          description: 'Note type created successfully',
        });
      }
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving note type:', error);
      toast({
        title: 'Error',
        description: 'Failed to save note type',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="h-full bg-white pl-5 pr-6 py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Manage system configuration</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Note Types</CardTitle>
            <Button onClick={handleAddNoteType} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Note Type</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="space-y-3">
              {noteTypes.map((noteType) => (
                <div key={noteType.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: noteType.color }}
                    />
                    <span className="font-medium">{noteType.name}</span>
                    <Badge variant="outline" style={{ borderColor: noteType.color, color: noteType.color }}>
                      {noteType.color}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditNoteType(noteType)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNoteType(noteType.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              {noteTypes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No note types configured yet. Add one to get started.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <NoteTypeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveNoteType}
        noteType={editingNoteType}
      />
    </div>
  );
};

export default Settings;
