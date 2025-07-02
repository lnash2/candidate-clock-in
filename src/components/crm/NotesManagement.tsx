import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MessageSquare, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LegacyNote {
  id: number;
  content: string;
  created_at: number;
  candidate_id?: number;
  company_id?: number;
  note_type?: string;
}

const NotesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState<LegacyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotes, setSelectedNotes] = useState<LegacyNote[]>([]);

  useEffect(() => {
    fetchLegacyNotes();
  }, []);

  const fetchLegacyNotes = async () => {
    try {
      setLoading(true);
      
      // Fetch a sample of legacy notes (limit to avoid overwhelming the UI)
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setNotes(data || []);
      setSelectedNotes(data?.slice(0, 20) || []); // Show first 20 for display
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotes = selectedNotes.filter(note =>
    note.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEntityBadge = (note: LegacyNote) => {
    if (note.candidate_id) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Candidate</Badge>;
    }
    if (note.company_id) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Company</Badge>;
    }
    return <Badge variant="outline">General</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Communication History</h2>
          <p className="text-muted-foreground">
            Historical notes and communications from legacy system ({notes.length.toLocaleString()} total records)
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Note</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Legacy records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidate Notes</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {notes.filter(n => n.candidate_id).length.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Driver communications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company Notes</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {notes.filter(n => n.company_id).length.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Client communications</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading historical notes...</div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-4">
              Showing {filteredNotes.length} of {selectedNotes.length} recent notes
            </div>
            {filteredNotes.map(note => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      {getEntityBadge(note)}
                      <span className="text-sm text-muted-foreground">
                        {formatDate(note.created_at)}
                      </span>
                      {note.note_type && (
                        <Badge variant="outline" className="text-xs">
                          {note.note_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm leading-relaxed">
                    {note.content ? (
                      note.content.length > 300 
                        ? `${note.content.substring(0, 300)}...`
                        : note.content
                    ) : (
                      <span className="text-muted-foreground italic">No content</span>
                    )}
                  </div>
                  
                  <div className="mt-3 text-xs text-muted-foreground">
                    {note.candidate_id && `Candidate ID: ${note.candidate_id}`}
                    {note.company_id && `Company ID: ${note.company_id}`}
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default NotesManagement;