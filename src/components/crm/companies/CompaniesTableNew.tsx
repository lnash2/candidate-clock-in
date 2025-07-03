import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { Customer } from '@/hooks/useCustomers';

interface CompaniesTableNewProps {
  companies: Customer[];
  onView?: (company: Customer) => void;
  onEdit?: (company: Customer) => void;
  onDelete?: (company: Customer) => void;
}

const CompaniesTableNew = ({ companies, onView, onEdit, onDelete }: CompaniesTableNewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter companies
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch = searchTerm === '' || 
        company.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.contact_name && company.contact_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.contact_email && company.contact_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.postcode && company.postcode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.city && company.city.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && company.is_active) ||
        (statusFilter === 'prospect' && !company.is_active);
      
      return matchesSearch && matchesStatus;
    });
  }, [companies, searchTerm, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Generate unique company data for table rows
  const uniqueCompanies = useMemo(() => {
    const companyMap = new Map();
    
    companies.forEach(company => {
      if (!companyMap.has(company.company)) {
        // Count contacts for this company
        const companyContacts = companies.filter(c => c.company === company.company);
        const totalContacts = companyContacts.length;
        
        companyMap.set(company.company, {
          ...company,
          totalContacts,
          // Use first available contact info
          primary_contact: companyContacts.find(c => c.contact_name)?.contact_name || 'No contact',
          primary_email: companyContacts.find(c => c.contact_email)?.contact_email || '',
          primary_phone: companyContacts.find(c => c.contact_phone)?.contact_phone || '',
        });
      }
    });
    
    return Array.from(companyMap.values());
  }, [companies]);

  // Apply filters to unique companies
  const filteredUniqueCompanies = useMemo(() => {
    return uniqueCompanies.filter(company => {
      const matchesSearch = searchTerm === '' || 
        company.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.primary_contact && company.primary_contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.primary_email && company.primary_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.postcode && company.postcode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.city && company.city.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && company.is_active) ||
        (statusFilter === 'prospect' && !company.is_active);
      
      return matchesSearch && matchesStatus;
    });
  }, [uniqueCompanies, searchTerm, statusFilter]);

  const paginatedUniqueCompanies = filteredUniqueCompanies.slice(startIndex, endIndex);

  const getStatusBadge = (isActive: boolean | null) => {
    if (isActive) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
    }
    return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Prospect</Badge>;
  };

  const getIndustryBadges = () => {
    // For now, showing placeholder badges - this would come from actual industry data
    return (
      <div className="flex gap-1 flex-wrap">
        <Badge variant="outline" className="text-xs">Driving & Logistics</Badge>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Companies</h1>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New Company
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm">
          Show/Hide Columns
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="w-48">Company Name</TableHead>
              <TableHead className="w-32">Postcode</TableHead>
              <TableHead className="w-24">Contacts</TableHead>
              <TableHead className="w-32">Organization</TableHead>
              <TableHead className="w-40">Industries</TableHead>
              <TableHead className="w-32">Created By</TableHead>
              <TableHead className="w-32">Total Notes</TableHead>
              <TableHead className="w-32">Last Note</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUniqueCompanies.map((company, index) => (
              <TableRow key={company.id} className="hover:bg-gray-50">
                <TableCell className="text-sm text-gray-600">
                  {(startIndex + index + 1).toString().padStart(5, '0')}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => onView?.(company)}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
                  >
                    {company.company}
                  </button>
                </TableCell>
                <TableCell className="text-sm">{company.postcode || '-'}</TableCell>
                <TableCell className="text-center">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                    {company.totalContacts}
                  </span>
                </TableCell>
                <TableCell className="text-sm">Swift Recruit</TableCell>
                <TableCell>
                  {getIndustryBadges()}
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
                <TableCell className="text-center">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">0</span>
                </TableCell>
                <TableCell className="text-sm text-gray-600">-</TableCell>
                <TableCell>
                  {getStatusBadge(company.is_active)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(company)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(company)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} - {Math.min(endIndex, filteredUniqueCompanies.length)} of {filteredUniqueCompanies.length}
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(10, totalPages) }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}
          {totalPages > 10 && (
            <>
              <span className="text-gray-400">...</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                className="w-8 h-8 p-0"
              >
                {totalPages}
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" disabled={currentPage >= totalPages}>
            →
          </Button>
        </div>
        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-600">/ page</span>
      </div>
    </div>
  );
};

export default CompaniesTableNew;