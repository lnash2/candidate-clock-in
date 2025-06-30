
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Phone, Mail, Building2, Calendar, FileText, Users, DollarSign } from 'lucide-react';
import CompanyRates from './CompanyRates';

interface CompanyDetailProps {
  companyId: number;
  onBack: () => void;
}

const CompanyDetail = ({ companyId, onBack }: CompanyDetailProps) => {
  // Mock data - in real implementation, this would come from Supabase
  const company = {
    id: 1,
    company: 'Cheltenham Racecourse',
    contactName: 'Sarah Johnson',
    email: 'sarah@cheltenham.co.uk',
    phone: '+44 1242 513014',
    totalBookings: 24,
    totalRevenue: 12500,
    status: 'active',
    lastContact: '2024-01-15',
    address: '123 Racecourse Road, Cheltenham, GL50 4SH',
    paymentTerms: '30 days',
    creditLimit: 50000
  };

  const bookingHistory = [
    {
      id: 1,
      date: '2024-01-15',
      pickup: 'Cheltenham',
      dropoff: 'Newmarket',
      status: 'completed',
      amount: 850
    },
    {
      id: 2,
      date: '2024-01-10',
      pickup: 'Windsor',
      dropoff: 'Cheltenham',
      status: 'completed',
      amount: 750
    }
  ];

  const notes = [
    {
      id: 1,
      date: '2024-01-15',
      content: 'Discussed upcoming racing season requirements. Client happy with service.',
      author: 'Admin User'
    },
    {
      id: 2,
      date: '2024-01-10',
      content: 'Payment received on time. Good relationship maintained.',
      author: 'Admin User'
    }
  ];

  const contacts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Operations Manager',
      email: 'sarah@cheltenham.co.uk',
      phone: '+44 1242 513014',
      isPrimary: true
    },
    {
      id: 2,
      name: 'Mike Thompson',
      role: 'Finance Director',
      email: 'mike@cheltenham.co.uk',
      phone: '+44 1242 513015',
      isPrimary: false
    }
  ];

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Companies</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </Button>
        </div>
      </div>

      {/* Company Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">{company.company}</CardTitle>
                <p className="text-muted-foreground">Primary Contact: {company.contactName}</p>
              </div>
            </div>
            <Badge className={getStatusColor(company.status)}>
              {company.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Contact Information</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3" />
                  <span>{company.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3" />
                  <span>{company.phone}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Building2 className="w-3 h-3 mt-0.5" />
                  <span>{company.address}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Business Details</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div><span className="font-medium">Payment Terms:</span> {company.paymentTerms}</div>
                <div><span className="font-medium">Credit Limit:</span> £{company.creditLimit.toLocaleString()}</div>
                <div><span className="font-medium">Last Contact:</span> {company.lastContact}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Summary</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div><span className="font-medium">Total Bookings:</span> {company.totalBookings}</div>
                <div><span className="font-medium">Total Revenue:</span> £{company.totalRevenue.toLocaleString()}</div>
                <div><span className="font-medium">Active Since:</span> Jan 2023</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Notes</span>
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Contacts</span>
          </TabsTrigger>
          <TabsTrigger value="rates" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Rates</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Financial</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookingHistory.map(booking => (
                  <div key={booking.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{booking.pickup} → {booking.dropoff}</div>
                      <div className="text-sm text-muted-foreground">{booking.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">£{booking.amount}</div>
                      <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Notes & Comments</CardTitle>
                <Button>Add Note</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notes.map(note => (
                  <div key={note.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{note.author}</span>
                      <span className="text-sm text-muted-foreground">{note.date}</span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Linked Contacts</CardTitle>
                <Button>Add Contact</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contacts.map(contact => (
                  <div key={contact.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium flex items-center space-x-2">
                          <span>{contact.name}</span>
                          {contact.isPrimary && <Badge variant="secondary">Primary</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">{contact.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates" className="mt-4">
          <CompanyRates companyId={companyId} />
        </TabsContent>

        <TabsContent value="financial" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Payment History</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Last Payment:</span>
                      <span>£850 (Jan 15, 2024)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Payment Time:</span>
                      <span>28 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Outstanding Balance:</span>
                      <span className="font-medium">£0</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Credit Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Credit Limit:</span>
                      <span>£{company.creditLimit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Credit:</span>
                      <span className="text-green-600">£{company.creditLimit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Terms:</span>
                      <span>{company.paymentTerms}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDetail;
