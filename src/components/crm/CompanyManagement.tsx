
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2, Users, Phone, MapPin, Calendar, TrendingUp, Activity } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { useBookings } from '@/hooks/useBookings';
import { DataTable } from '@/components/ui/data-table';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { MetricCard } from '@/components/ui/metric-card';
import { PageLoading } from '@/components/ui/loading';

interface CompanyManagementProps {
  onCompanySelect?: (companyId: string) => void;
}

const CompanyManagement = ({ onCompanySelect }: CompanyManagementProps) => {
  const { 
    companies, 
    loading: companiesLoading, 
    searchTerm, 
    search,
    pagination,
    goToPage,
    changePageSize
  } = useCompanies();
  const { bookings, loading: bookingsLoading } = useBookings();
  
  // Calculate comprehensive stats using pagination.total instead of companies.length
  const totalCompanies = pagination.total;
  const activeCompanies = companies.filter(c => c.company_status_id).length;
  const companiesWithBookings = companies.filter(c => 
    bookings.some(b => b.company_id === c.id)
  ).length;
  
  const totalBookings = bookings.length;
  const recentCompanies = companies.filter(c => {
    const createdDate = new Date(c.created_at * 1000);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate > thirtyDaysAgo;
  }).length;

  // Define table columns
  const columns = [
    {
      key: 'name',
      label: 'Company Name',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">ID: {row.id}</div>
          </div>
        </div>
      )
    },
    {
      key: 'phone_number',
      label: 'Contact',
      render: (value: string) => value ? (
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">No phone</span>
      )
    },
    {
      key: 'website',
      label: 'Website',
      render: (value: string) => value ? (
        <a 
          href={value.startsWith('http') ? value : `https://${value}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm"
        >
          {value}
        </a>
      ) : (
        <span className="text-muted-foreground">No website</span>
      )
    },
    {
      key: 'company_status_id',
      label: 'Status',
      render: (value: number) => (
        <Badge variant={value ? 'default' : 'secondary'} className="status-badge">
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{new Date(value * 1000).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'totalContacts',
      label: 'Contacts',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{value || 0}</span>
        </div>
      )
    }
  ];

  if (companiesLoading || bookingsLoading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Company Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your client companies and business relationships
          </p>
        </div>
        <Button className="flex items-center space-x-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Companies"
          value={totalCompanies}
          description="All registered companies"
          icon={Building2}
          trend={{ value: 12, isPositive: true, label: "this month" }}
        />
        <MetricCard
          title="Active Companies"
          value={activeCompanies}
          description="Companies with active status"
          icon={Activity}
          variant="success"
        />
        <MetricCard
          title="With Bookings"
          value={companiesWithBookings}
          description="Companies that have bookings"
          icon={TrendingUp}
          variant="info"
        />
        <MetricCard
          title="New This Month"
          value={recentCompanies}
          description="Recently added companies"
          icon={Calendar}
          variant="warning"
        />
      </div>

      {/* Data Table */}
      <DataTable
        title="Company Directory"
        description={`Showing ${(pagination.page - 1) * pagination.pageSize + 1} - ${Math.min(pagination.page * pagination.pageSize, pagination.total)} of ${pagination.total.toLocaleString()} companies`}
        columns={columns}
        data={companies}
        searchTerm={searchTerm}
        onSearchChange={search}
        loading={companiesLoading}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Import
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        }
      />

      {/* Add Pagination Controls */}
      <DataTablePagination
        pagination={pagination}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        onSearch={search}
        searchTerm={searchTerm}
        searchPlaceholder="Search companies..."
        loading={companiesLoading}
      />
    </div>
  );
};

export default CompanyManagement;
