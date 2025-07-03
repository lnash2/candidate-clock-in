
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useBookings } from '@/hooks/useBookings';
import CompaniesTableNew from './companies/CompaniesTableNew';
import { DataTablePagination } from '@/components/ui/data-table-pagination';

interface CompanyManagementProps {
  onCompanySelect?: (companyId: string) => void;
}

const CompanyManagement = ({ onCompanySelect }: CompanyManagementProps) => {
  const { customers, loading: customersLoading, pagination, searchTerm, goToPage, search } = useCustomers();
  const { bookings, loading: bookingsLoading } = useBookings();
  
  // Calculate stats for each customer
  const companiesWithStats = customers.map(customer => {
    const customerBookings = bookings.filter(b => b.customer_id === customer.id);
    const totalBookings = customerBookings.length;
    const lastBookingDate = customerBookings.length > 0 
      ? Math.max(...customerBookings.map(b => new Date(b.created_at).getTime()))
      : null;
    
    return {
      id: customer.id,
      company: customer.company,
      contactName: customer.contact_name || 'No contact',
      email: customer.contact_email || 'No email',
      phone: customer.contact_phone || 'No phone',
      address: customer.address,
      city: customer.city,
      postcode: customer.postcode,
      country: customer.country,
      totalBookings,
      status: customer.is_active ? 'active' : 'inactive',
      lastContact: lastBookingDate 
        ? new Date(lastBookingDate).toISOString().split('T')[0]
        : 'Never',
      created_at: customer.created_at,
      updated_at: customer.updated_at
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
            companies={customers}
            onView={(company) => onCompanySelect?.(company.id)}
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
