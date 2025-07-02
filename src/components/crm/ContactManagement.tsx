
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import ContactsTable from './contacts/ContactsTable';

const ContactManagement = () => {
  const { customers } = useCustomers();

  // Transform customers into contacts format for the table
  const contacts = customers.map(customer => ({
    id: customer.id,
    contact_name: customer.contact_name,
    contact_email: customer.contact_email,
    contact_phone: customer.contact_phone,
    company: customer.company,
    address: customer.address,
    city: customer.city,
    postcode: customer.postcode,
    country: customer.country,
    is_active: customer.is_active,
    created_at: customer.created_at,
    updated_at: customer.updated_at
  }));

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
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactManagement;
