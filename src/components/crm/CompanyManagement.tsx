
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Eye, Phone, Mail } from 'lucide-react';

const CompanyManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data - in real implementation, this would come from Supabase customers table
  const companies = [
    {
      id: 1,
      company: 'Cheltenham Racecourse',
      contactName: 'Sarah Johnson',
      email: 'sarah@cheltenham.co.uk',
      phone: '+44 1242 513014',
      totalBookings: 24,
      totalRevenue: 12500,
      status: 'active',
      lastContact: '2024-01-15'
    },
    {
      id: 2,
      company: 'Newmarket Training Centre',
      contactName: 'Mike Thompson',
      email: 'mike@newmarket.co.uk',
      phone: '+44 1638 667171',
      totalBookings: 18,
      totalRevenue: 9800,
      status: 'active',
      lastContact: '2024-01-12'
    },
    {
      id: 3,
      company: 'Royal Windsor Stables',
      contactName: 'Emma Davis',
      email: 'emma@windsor-stables.co.uk',
      phone: '+44 1753 860633',
      totalBookings: 15,
      totalRevenue: 7300,
      status: 'pending',
      lastContact: '2024-01-10'
    }
  ];

  const filteredCompanies = companies.filter(company =>
    company.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Company Management</h2>
          <p className="text-muted-foreground">Manage your client companies and relationships</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search companies or contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCompanies.map(company => (
          <Card key={company.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{company.company}</h3>
                    <Badge className={getStatusColor(company.status)}>
                      {company.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">Primary Contact:</span>
                        <span>{company.contactName}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Mail className="w-3 h-3" />
                        <span>{company.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3" />
                        <span>{company.phone}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-1">
                        <span className="font-medium">Total Bookings:</span> {company.totalBookings}
                      </div>
                      <div className="mb-1">
                        <span className="font-medium">Total Revenue:</span> £{company.totalRevenue.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Last Contact:</span> {company.lastContact}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompanyManagement;
