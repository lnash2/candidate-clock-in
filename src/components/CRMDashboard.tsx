
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppSidebar from './AppSidebar';
import CompanyManagement from './crm/CompanyManagement';
import ContactManagement from './crm/ContactManagement';
import CandidateManagement from './crm/CandidateManagement';
import CommunicationTracking from './crm/CommunicationTracking';
import RateManagement from './crm/RateManagement';
import BookingManagement from './crm/BookingManagement';
import CRMOverview from './crm/CRMOverview';
import CompanyDetail from './crm/CompanyDetail';
import { useSidebar } from '@/components/ui/sidebar';

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
      <div className="min-h-screen flex w-full">
        <AppSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <SidebarInset>
          <HeaderWithToggle 
            selectedCompanyId={selectedCompanyId}
            activeSection={activeSection}
          />
          <div className="flex flex-1 flex-col">
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

const HeaderWithToggle = ({ selectedCompanyId, activeSection }: { selectedCompanyId: number | null, activeSection: string }) => {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b px-3 bg-white">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
        title={isCollapsed ? "Show navigation" : "Hide navigation"}
      >
        {isCollapsed ? (
          <Menu className="h-4 w-4" />
        ) : (
          <X className="h-4 w-4" />
        )}
      </Button>
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-semibold">
          {selectedCompanyId !== null ? 'Company Details' : 
           activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </h1>
      </div>
    </header>
  );
};

export default CRMDashboard;
