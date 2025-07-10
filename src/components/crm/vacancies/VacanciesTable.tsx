import React, { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useVacancies } from '@/hooks/useVacancies';
import VacancyFormDialog from './VacancyFormDialog';
import VacancyFilters from './VacancyFilters';
import { Edit, Trash2, Search, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

const VacanciesTable = () => {
  const { 
    vacancies, 
    statuses, 
    loading, 
    searchTerm, 
    search, 
    deleteVacancy 
  } = useVacancies();
  
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (vacancy: any) => {
    setSelectedVacancy(vacancy);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this vacancy?')) {
      try {
        await deleteVacancy(id);
      } catch (error) {
        toast.error('Failed to delete vacancy');
      }
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (vacancy: any) => (
        <div className="font-medium">{vacancy.title}</div>
      ),
    },
    {
      key: 'company_name',
      label: 'Company',
      render: (vacancy: any) => (
        <div className="text-sm">{vacancy.company_name}</div>
      ),
    },
    {
      key: 'contact_name',
      label: 'Assigned Contact',
      render: (vacancy: any) => (
        <div className="text-sm">{vacancy.contact_name}</div>
      ),
    },
    {
      key: 'status_name',
      label: 'Status',
      render: (vacancy: any) => (
        <Badge 
          variant="secondary"
          style={{ 
            backgroundColor: vacancy.status_color ? `${vacancy.status_color}20` : undefined,
            color: vacancy.status_color || undefined,
            borderColor: vacancy.status_color || undefined
          }}
        >
          {vacancy.status_name}
        </Badge>
      ),
    },
    {
      key: 'address',
      label: 'Location',
      render: (vacancy: any) => (
        <div className="text-sm">
          <div>{vacancy.address}</div>
          {vacancy.city && <div className="text-muted-foreground">{vacancy.city} {vacancy.postcode}</div>}
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (vacancy: any) => (
        <div className="text-sm text-muted-foreground">
          {new Date(vacancy.created_at * 1000).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (vacancy: any) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(vacancy)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(vacancy.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search vacancies..."
              value={searchTerm}
              onChange={(e) => search(e.target.value)}
              className="pl-9"
            />
          </div>
          <VacancyFilters />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={vacancies}
        columns={columns}
        loading={loading}
      />

      {/* Edit Dialog */}
      <VacancyFormDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedVacancy(null);
        }}
        vacancy={selectedVacancy}
      />
    </div>
  );
};

export default VacanciesTable;