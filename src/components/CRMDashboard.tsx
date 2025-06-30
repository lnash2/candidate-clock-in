
import React, { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import CRMOverview from '@/components/crm/CRMOverview';
import CompanyManagement from '@/components/crm/CompanyManagement';
import ContactManagement from '@/components/crm/ContactManagement';
import CandidateManagement from '@/components/crm/CandidateManagement';
import BookingManagement from '@/components/crm/BookingManagement';
import CommunicationTracking from '@/components/crm/CommunicationTracking';
import RateManagement from '@/components/crm/RateManagement';
import Settings from '@/components/crm/Settings';
import DatabaseSetup from '@/components/setup/DatabaseSetup';

const CRMDashboard = () => {
  const [activeView, setActiveView] = useState('overview');

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <CRMOverview />;
      case 'companies':
        return <CompanyManagement />;
      case 'contacts':
        return <ContactManagement />;
      case 'candidates':
        return <CandidateManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'communications':
        return <CommunicationTracking />;
      case 'rates':
        return <RateManagement />;
      case 'settings':
        return <Settings />;
      case 'setup':
        return (
          <div className="flex items-center justify-center min-h-screen p-8">
            <DatabaseSetup />
          </div>
        );
      default:
        return <CRMOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
        />
        <SidebarInset className="flex-1">
          <main className="h-full overflow-auto">
            {renderActiveView()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CRMDashboard;
