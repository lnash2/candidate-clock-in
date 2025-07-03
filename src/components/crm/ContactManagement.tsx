import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, User, Mail, Phone, Building2, Calendar, Users, UserCheck, Clock } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import { DataTable } from '@/components/ui/data-table';
import { MetricCard } from '@/components/ui/metric-card';
import { PageLoading } from '@/components/ui/loading';

const ContactManagement = () => {
  const { contacts, loading, searchTerm, search } = useContacts();

  // Calculate stats
  const totalContacts = contacts.length;
  const activeContacts = contacts.filter(c => c.is_active).length;
  const primaryContacts = contacts.filter(c => c.is_primary_contact).length;
  const recentContacts = contacts.filter(c => {
    const createdDate = new Date(c.created_at * 1000);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return createdDate > sevenDaysAgo;
  }).length;

  // Define table columns
  const columns = [
    {
      key: 'contact_name',
      label: 'Contact Name',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">{value || 'Unknown Contact'}</div>
            <div className="text-xs text-muted-foreground">{row.job_title || 'No title'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contact_email',
      label: 'Email',
      render: (value: string) => value ? (
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <a href={`mailto:${value}`} className="text-primary hover:underline text-sm">
            {value}
          </a>
        </div>
      ) : (
        <span className="text-muted-foreground">No email</span>
      )
    },
    {
      key: 'contact_phone',
      label: 'Phone',
      render: (value: string) => value ? (
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <a href={`tel:${value}`} className="text-sm">
            {value}
          </a>
        </div>
      ) : (
        <span className="text-muted-foreground">No phone</span>
      )
    },
    {
      key: 'company',
      label: 'Company',
      render: (value: string) => value && value !== 'Unknown Company' ? (
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{value}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">No company</span>
      )
    },
    {
      key: 'is_primary_contact',
      label: 'Type',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'} className="status-badge">
          {value ? 'Primary' : 'Secondary'}
        </Badge>
      )
    },
    {
      key: 'created_at',
      label: 'Added',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{new Date(value * 1000).toLocaleDateString()}</span>
        </div>
      )
    }
  ];

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contact Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage individual contacts within your client companies
          </p>
        </div>
        <Button className="flex items-center space-x-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Contacts"
          value={totalContacts}
          description="All contact records"
          icon={Users}
          trend={{ value: 8, isPositive: true, label: "this week" }}
        />
        <MetricCard
          title="Active Contacts"
          value={activeContacts}
          description="Currently active contacts"
          icon={UserCheck}
          variant="success"
        />
        <MetricCard
          title="Primary Contacts"
          value={primaryContacts}
          description="Main company contacts"
          icon={User}
          variant="info"
        />
        <MetricCard
          title="Added This Week"
          value={recentContacts}
          description="Recently added contacts"
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Data Table */}
      <DataTable
        title="Contact Directory"
        description={`Showing ${contacts.length} contacts from your legacy database`}
        columns={columns}
        data={contacts}
        searchTerm={searchTerm}
        onSearchChange={search}
        loading={loading}
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
    </div>
  );
};

export default ContactManagement;