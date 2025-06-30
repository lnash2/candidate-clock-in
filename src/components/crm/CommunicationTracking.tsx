
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Phone, Mail, MessageSquare, Calendar } from 'lucide-react';

const CommunicationTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data - this would integrate with your notes and email_logs tables
  const communications = [
    {
      id: 1,
      type: 'call',
      subject: 'Initial consultation call',
      company: 'Cheltenham Racecourse',
      contact: 'Sarah Johnson',
      date: '2024-01-15',
      time: '14:30',
      duration: '45 mins',
      status: 'completed',
      notes: 'Discussed upcoming spring season requirements. Need to follow up with detailed quote.'
    },
    {
      id: 2,
      type: 'email',
      subject: 'Quote for March events',
      company: 'Newmarket Training Centre',
      contact: 'Mike Thompson',
      date: '2024-01-14',
      time: '10:15',
      status: 'sent',
      notes: 'Sent detailed quote for March training camp transport. Awaiting response.'
    },
    {
      id: 3,
      type: 'meeting',
      subject: 'Site visit and requirements review',
      company: 'Royal Windsor Stables',
      contact: 'Emma Davis',
      date: '2024-01-12',
      time: '11:00',
      duration: '2 hours',
      status: 'completed',
      notes: 'On-site meeting to assess transport requirements. Very positive feedback.'
    },
    {
      id: 4,
      type: 'follow-up',
      subject: 'Follow up on quote',
      company: 'Cheltenham Racecourse',
      contact: 'Sarah Johnson',
      date: '2024-01-20',
      time: '09:00',
      status: 'scheduled',
      notes: 'Scheduled follow-up call to discuss quote and finalize booking details.'
    }
  ];

  const filteredCommunications = communications.filter(comm =>
    comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comm.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comm.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <MessageSquare className="w-4 h-4" />;
      case 'follow-up': return <Calendar className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-800';
      case 'email': return 'bg-green-100 text-green-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      case 'follow-up': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full bg-white pl-5 pr-6 py-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Communication Tracking</h2>
          <p className="text-muted-foreground">Track all interactions with clients and prospects</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Log Communication</span>
        </Button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search communications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredCommunications.map(comm => (
          <Card key={comm.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(comm.type)}
                      <Badge className={getTypeColor(comm.type)}>
                        {comm.type}
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(comm.status)}>
                      {comm.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{comm.subject}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                    <div>
                      <div className="mb-1">
                        <span className="font-medium">Company:</span> {comm.company}
                      </div>
                      <div className="mb-1">
                        <span className="font-medium">Contact:</span> {comm.contact}
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-1">
                        <span className="font-medium">Date:</span> {comm.date} at {comm.time}
                      </div>
                      {comm.duration && (
                        <div>
                          <span className="font-medium">Duration:</span> {comm.duration}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Notes:</span>
                    <p className="mt-1 text-muted-foreground">{comm.notes}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunicationTracking;
