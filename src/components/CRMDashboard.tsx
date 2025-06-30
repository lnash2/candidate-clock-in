
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, MessageSquare, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import CompanyManagement from './crm/CompanyManagement';
import ContactManagement from './crm/ContactManagement';
import CommunicationTracking from './crm/CommunicationTracking';
import RateManagement from './crm/RateManagement';
import BookingManagement from './crm/BookingManagement';
import CRMOverview from './crm/CRMOverview';

const CRMDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center space-x-2">
          <Building2 className="w-6 h-6" />
          <span>CRM Dashboard</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Companies</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Communications</span>
            </TabsTrigger>
            <TabsTrigger value="rates" className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Rates</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Bookings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <CRMOverview />
          </TabsContent>

          <TabsContent value="companies" className="mt-6">
            <CompanyManagement />
          </TabsContent>

          <TabsContent value="contacts" className="mt-6">
            <ContactManagement />
          </TabsContent>

          <TabsContent value="communications" className="mt-6">
            <CommunicationTracking />
          </TabsContent>

          <TabsContent value="rates" className="mt-6">
            <RateManagement />
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <BookingManagement />
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  );
};

export default CRMDashboard;
