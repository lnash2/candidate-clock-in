import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, ArrowUpDown, Eye, Edit, Phone, Mail, Building2 } from 'lucide-react';

interface Contact {
  id: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  company: string;
  address: string | null;
  city: string | null;
  postcode: string | null;
  country: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

interface ContactsTableProps {
  contacts: Contact[];
  onView?: (contact: Contact) => void;
  onEdit?: (contact: Contact) => void;
}

type SortField = keyof Contact;
type SortDirection = 'asc' | 'desc';

const ContactsTable = ({ contacts, onView, onEdit }: ContactsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('contact_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter and search
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = searchTerm === '' || 
        (contact.contact_name && contact.contact_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.contact_email && contact.contact_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.contact_phone && contact.contact_phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.address && contact.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.city && contact.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.postcode && contact.postcode.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && contact.is_active) ||
        (statusFilter === 'inactive' && !contact.is_active);
      
      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchTerm, statusFilter]);

  // Sort
  const sortedContacts = useMemo(() => {
    return [...filteredContacts].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle null values
      if (aValue === null) aValue = '';
      if (bValue === null) bValue = '';

      // Convert to string for comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [filteredContacts, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedContacts.length / pageSize);
  const paginatedContacts = sortedContacts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize));
    setCurrentPage(1);
  };

  const getStatusColor = (isActive: boolean | null) => {
    if (isActive) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 font-medium"
        onClick={() => handleSort(field)}
      >
        {children}
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search contacts, companies, emails, phones, addresses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="200">200</SelectItem>
            <SelectItem value="300">300</SelectItem>
            <SelectItem value="400">400</SelectItem>
            <SelectItem value="500">500</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Info */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedContacts.length} of {filteredContacts.length} contacts
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="contact_name">Contact Name</SortableHeader>
              <SortableHeader field="contact_email">Email</SortableHeader>
              <SortableHeader field="contact_phone">Phone</SortableHeader>
              <SortableHeader field="company">Company</SortableHeader>
              <SortableHeader field="address">Address</SortableHeader>
              <SortableHeader field="city">City</SortableHeader>
              <SortableHeader field="postcode">Postcode</SortableHeader>
              <SortableHeader field="country">Country</SortableHeader>
              <SortableHeader field="is_active">Status</SortableHeader>
              <SortableHeader field="created_at">Created</SortableHeader>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.contact_name || '-'}</TableCell>
                <TableCell>{contact.contact_email || '-'}</TableCell>
                <TableCell>{contact.contact_phone || '-'}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>{contact.address || '-'}</TableCell>
                <TableCell>{contact.city || '-'}</TableCell>
                <TableCell>{contact.postcode || '-'}</TableCell>
                <TableCell>{contact.country || '-'}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(contact.is_active)}>
                    {contact.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(contact.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView?.(contact)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(contact)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    {contact.contact_phone && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`tel:${contact.contact_phone}`)}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                    )}
                    {contact.contact_email && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`mailto:${contact.contact_email}`)}
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ContactsTable;