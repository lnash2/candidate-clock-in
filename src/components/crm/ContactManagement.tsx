import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
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
        <CardContent className="p-6">
          <div>
            <p className="text-lg font-semibold">Contacts from Legacy Database</p>
            <p className="text-sm text-muted-foreground">
              Successfully connected to contacts table with {contacts.length} records
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.slice(0, 6).map(contact => (
                <div key={contact.id} className="border rounded p-3">
                  <h4 className="font-medium">{contact.contact_name || 'Unknown Contact'}</h4>
                  <p className="text-sm text-muted-foreground">{contact.contact_email}</p>
                  <p className="text-sm text-muted-foreground">{contact.contact_phone}</p>
                  <p className="text-xs text-muted-foreground">{contact.company}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactManagement;