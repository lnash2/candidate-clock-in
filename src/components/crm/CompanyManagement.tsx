
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { useBookings } from '@/hooks/useBookings';
import CompaniesTableNew from './companies/CompaniesTableNew';
import { DataTablePagination } from '@/components/ui/data-table-pagination';

interface CompanyManagementProps {
  onCompanySelect?: (companyId: string) => void;
}

const CompanyManagement = ({ onCompanySelect }: CompanyManagementProps) => {
  const { companies, loading: companiesLoading, pagination, searchTerm, goToPage, search } = useCompanies();
  const { bookings, loading: bookingsLoading } = useBookings();
  
  // Calculate stats for each company
  const companiesWithStats = companies.map(company => {
    const companyBookings = bookings.filter(b => b.company_id === company.id);
    const totalBookings = companyBookings.length;
    const lastBookingDate = companyBookings.length > 0 
      ? Math.max(...companyBookings.map(b => new Date(b.created_at * 1000).getTime()))
      : null;
    
    return {
      id: company.id.toString(),
      company: company.name,
      contactName: 'No contact', // Would need to join with contacts
      email: 'No email',
      phone: company.phone_number || 'No phone',
      address: company.address?.formatted_address,
      city: company.address?.city,
      postcode: company.address?.postal_code,
      country: company.address?.country,
      totalBookings,
      status: company.company_status_id ? 'active' : 'inactive',
      lastContact: lastBookingDate 
        ? new Date(lastBookingDate).toISOString().split('T')[0]
        : 'Never',
      created_at: new Date(company.created_at * 1000).toISOString(),
      updated_at: company.updated_at ? new Date(company.updated_at * 1000).toISOString() : new Date(company.created_at * 1000).toISOString()
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Company Management</h2>
          <p className="text-muted-foreground">Manage your client companies and relationships ({companiesWithStats.length} total)</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <CompaniesTableNew
            companies={companies}
            onView={(company) => onCompanySelect?.(company.id.toString())}
            onEdit={(company) => {
              console.log('Edit company:', company);
            }}
            onDelete={(company) => {
              console.log('Delete company:', company);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyManagement;
