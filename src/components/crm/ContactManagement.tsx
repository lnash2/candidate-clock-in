
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Phone, Mail, Building2 } from 'lucide-react';

const ContactManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data - this would integrate with your customers table
  const contacts = [
    {
      id: 1,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@cheltenham.co.uk',
      phone: '+44 1242 513014',
      mobile: '+44 7700 900123',
      company: 'Cheltenham Racecourse',
      role: 'Operations Manager',
      lastContact: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      firstName: 'Mike',
      lastName: 'Thompson',
      email: 'mike@newmarket.co.uk',
      phone: '+44 1638 667171',
      mobile: '+44 7700 900456',
      company: 'Newmarket Training Centre',
      role: 'Head Trainer',
      lastContact: '2024-01-12',
      status: 'active'
    },
    {
      id: 3,
      firstName: 'Emma',
      lastName: 'Davis',
      email: 'emma@windsor-stables.co.uk',
      phone: '+44 1753 860633',
      mobile: '+44 7700 900789',
      company: 'Royal Windsor Stables',
      role: 'Stable Manager',
      lastContact: '2024-01-10',
      status: 'pending'
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Contact Management</h2>
          <p className="text-muted-foreground">Manage individual contacts within companies</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredContacts.map(contact => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{contact.role}</p>
                    </div>
                    <Badge className={getStatusColor(contact.status)}>
                      {contact.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground ml-13">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Building2 className="w-3 h-3" />
                        <span>{contact.company}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Mail className="w-3 h-3" />
                        <span>{contact.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3" />
                        <span>{contact.phone}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-1">
                        <span className="font-medium">Mobile:</span> {contact.mobile}
                      </div>
                      <div>
                        <span className="font-medium">Last Contact:</span> {contact.lastContact}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
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

export default ContactManagement;
