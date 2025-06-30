

import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import CompanyManagement from './crm/CompanyManagement';
import ContactManagement from './crm/ContactManagement';
import CandidateManagement from './crm/CandidateManagement';
import CommunicationTracking from './crm/CommunicationTracking';
import RateManagement from './crm/RateManagement';
import BookingManagement from './crm/BookingManagement';
import CRMOverview from './crm/CRMOverview';
import CompanyDetail from './crm/CompanyDetail';

const CRMDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  const handleCompanySelect = (companyId: number) => {
    setSelectedCompanyId(companyId);
  };

  const handleBackToCompanies = () => {
    setSelectedCompanyId(null);
    setActiveSection('companies');
  };

  const renderContent = () => {
    // If a company is selected, show company detail view
    if (selectedCompanyId !== null) {
      return (
        <CompanyDetail
          companyId={selectedCompanyId}
          onBack={handleBackToCompanies}
        />
      );
    }

    // Otherwise show the main section content
    switch (activeSection) {
      case 'overview':
        return <CRMOverview />;
      case 'companies':
        return <CompanyManagement onCompanySelect={handleCompanySelect} />;
      case 'contacts':
        return <ContactManagement />;
      case 'candidates':
        return <CandidateManagement />;
      case 'communications':
        return <CommunicationTracking />;
      case 'rates':
        return <RateManagement />;
      case 'bookings':
        return <BookingManagement />;
      default:
        return <CRMOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <AppSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="flex h-12 shrink-0 items-center gap-3 border-b bg-white">
            <div className="flex items-center space-x-2 px-6">
              <h1 className="text-lg font-semibold">
                {selectedCompanyId !== null ? 'Company Details' : 
                 activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h1>
            </div>
          </header>
          <div className="flex-1 overflow-hidden">
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CRMDashboard;

