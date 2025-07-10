import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { PageLoading } from '@/components/ui/loading';
import { useVacancies } from '@/hooks/useVacancies';
import { EnhancedVacanciesTable } from './vacancies/EnhancedVacanciesTable';
import { ColumnVisibilityManager, ColumnConfig } from './vacancies/ColumnVisibilityManager';
import { AdvancedFilters, FilterState } from './vacancies/AdvancedFilters';
import { EnhancedSearch } from './vacancies/EnhancedSearch';
import VacancyFormDialog from './vacancies/VacancyFormDialog';
import { Plus, Briefcase, Building, UserCheck, Clock } from 'lucide-react';

const VacancyManagement = () => {
  const {
    vacancies,
    loading,
    searchTerm,
    search,
    applyFilters,
    filters
  } = useVacancies();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [columns, setColumns] = useState<ColumnConfig[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState<any>(null);

  const handleView = (vacancy: any) => {
    setSelectedVacancy(vacancy);
    setIsDialogOpen(true);
  };

  const handleEdit = (vacancy: any) => {
    setSelectedVacancy(vacancy);
    setIsDialogOpen(true);
  };

  const clearSearch = () => {
    search('');
  };

  const clearFilters = () => {
    applyFilters({
      status_id: 'all',
      company_id: 'all',
      assigned_contact_id: 'all',
      recruiter_id: 'all',
      resourcer_id: 'all',
      industry_id: 'all',
      job_category_id: 'all',
      organization_id: 'all',
      postcode: ''
    });
  };

  if (loading) {
    return <PageLoading />;
  }

  // Calculate metrics
  const totalVacancies = vacancies.length;
  const openVacancies = vacancies.filter(v => 
    v.status_name?.toLowerCase().includes('open') || 
    v.status_name?.toLowerCase().includes('active')
  ).length;
  const assignedVacancies = vacancies.filter(v => v.assigned_contact_id).length;
  const recentVacancies = vacancies.filter(v => {
    const weekAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);
    return v.created_at > weekAgo;
  }).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vacancy Management</h1>
          <p className="text-muted-foreground">
            Manage job vacancies and recruitment opportunities
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Vacancy
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Vacancies"
          value={totalVacancies.toString()}
          icon={Briefcase}
          trend={{ value: 0, isPositive: true, label: "from last month" }}
        />
        <MetricCard
          title="Open Vacancies"
          value={openVacancies.toString()}
          icon={Building}
          trend={{ value: 0, isPositive: true, label: "from last month" }}
        />
        <MetricCard
          title="Assigned Vacancies"
          value={assignedVacancies.toString()}
          icon={UserCheck}
          trend={{ value: 0, isPositive: true, label: "from last month" }}
        />
        <MetricCard
          title="Recent Vacancies"
          value={recentVacancies.toString()}
          icon={Clock}
          trend={{ value: 0, isPositive: true, label: "this week" }}
        />
      </div>

      {/* Enhanced Vacancies Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Vacancies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex-1">
                <EnhancedSearch
                  searchTerm={searchTerm}
                  onSearch={search}
                  onClearSearch={clearSearch}
                />
              </div>
              <div className="flex gap-2">
                <AdvancedFilters
                  filters={filters as FilterState}
                  onFiltersChange={applyFilters}
                  onClearFilters={clearFilters}
                />
                <ColumnVisibilityManager onColumnsChange={setColumns} />
              </div>
            </div>

            {/* Enhanced Table */}
            <EnhancedVacanciesTable
              vacancies={vacancies}
              columns={columns}
              onView={handleView}
              onEdit={handleEdit}
            />
          </div>
        </CardContent>
      </Card>

      <VacancyFormDialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedVacancy(null);
        }}
        vacancy={selectedVacancy}
      />
    </div>
  );
};

export default VacancyManagement;