
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import ContactsTable from './contacts/ContactsTable';
import { DataTablePagination } from '@/components/ui/data-table-pagination';

const ContactManagement = () => {
  const { contacts, loading, pagination, searchTerm, goToPage, search } = useContacts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Contact Management</h2>
          <p className="text-muted-foreground">Manage individual contacts within companies ({contacts.length} total)</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTablePagination
            pagination={pagination}
            onPageChange={goToPage}
            onSearch={search}
            searchTerm={searchTerm}
            searchPlaceholder="Search contacts..."
            loading={loading}
          />
          {loading ? (
            <div className="p-8 text-center">Loading contacts...</div>
          ) : (
            <ContactsTable
              contacts={contacts}
              onView={(contact) => {
                // TODO: Implement view functionality
                console.log('View contact:', contact);
              }}
              onEdit={(contact) => {
                // TODO: Implement edit functionality
                console.log('Edit contact:', contact);
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactManagement;
