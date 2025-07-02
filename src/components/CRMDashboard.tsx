
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
        return <div className="p-6">Database setup removed - use terminal migration instead</div>;
      case 'migration':
        return <div className="p-6">Migration tools removed - use terminal migration instead</div>;
      default:
        return <CRMOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gray-50">
        <AppSidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
        />
        <SidebarInset className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            {renderActiveView()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CRMDashboard;
