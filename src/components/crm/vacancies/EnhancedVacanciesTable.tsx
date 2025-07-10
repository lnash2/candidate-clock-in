import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Eye, Edit, Building, MapPin, Calendar, Users, Briefcase } from 'lucide-react';
import { Vacancy } from './types';
import { ColumnConfig } from './ColumnVisibilityManager';
import { getVacancyStatusColor } from './constants';

interface EnhancedVacanciesTableProps {
  vacancies: Vacancy[];
  columns: ColumnConfig[];
  onView?: (vacancy: Vacancy) => void;
  onEdit?: (vacancy: Vacancy) => void;
  onDelete?: (vacancyId: number) => void;
}

type SortField = keyof Vacancy;
type SortDirection = 'asc' | 'desc';

export const EnhancedVacanciesTable: React.FC<EnhancedVacanciesTableProps> = ({
  vacancies,
  columns,
  onView,
  onEdit,
  onDelete
}) => {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const visibleColumns = columns.filter(col => col.visible);

  // Sort vacancies
  const sortedVacancies = useMemo(() => {
    return [...vacancies].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle null values
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      // Convert to string for comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [vacancies, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className={field === 'title' ? 'sticky left-0 bg-background z-10 border-r' : ''}>
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

  const renderCellContent = (vacancy: Vacancy, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return <span className="font-mono text-sm">{vacancy.id}</span>;
      
      case 'title':
        return <span className="font-medium min-w-[200px] block">{vacancy.title}</span>;
      
      case 'company_name':
        return vacancy.company_name ? (
          <div className="flex items-center space-x-1">
            <Building className="h-3 w-3 text-muted-foreground" />
            <span>{vacancy.company_name}</span>
          </div>
        ) : '-';
      
      case 'company_rate_id':
        return <span className="font-mono text-sm">{vacancy.company_rate_id}</span>;
      
      case 'contact_name':
        return vacancy.contact_name ? (
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span>{vacancy.contact_name}</span>
          </div>
        ) : '-';
      
      case 'address':
        return vacancy.address ? (
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="truncate max-w-[150px]" title={vacancy.address}>
              {vacancy.address}
            </span>
          </div>
        ) : '-';
      
      case 'postcode':
        return vacancy.postcode ? (
          <span className="font-mono text-sm">{vacancy.postcode}</span>
        ) : '-';
      
      case 'recruiter_name':
        return vacancy.recruiter_name || '-';
      
      case 'resourcer_name':
        return vacancy.resourcer_name || '-';
      
      case 'organization_id':
        return vacancy.organization_id ? (
          <span className="font-mono text-sm">{vacancy.organization_id}</span>
        ) : '-';
      
      case 'status_name':
        return vacancy.status_name ? (
          <Badge className={getVacancyStatusColor(vacancy.status_name)}>
            {vacancy.status_name}
          </Badge>
        ) : '-';
      
      case 'industry_names':
        return vacancy.industry_names && vacancy.industry_names.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {vacancy.industry_names.slice(0, 2).map((industry, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {industry}
              </Badge>
            ))}
            {vacancy.industry_names.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{vacancy.industry_names.length - 2}
              </Badge>
            )}
          </div>
        ) : '-';
      
      case 'job_category_names':
        return vacancy.job_category_names && vacancy.job_category_names.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {vacancy.job_category_names.slice(0, 2).map((category, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                <Briefcase className="h-3 w-3 mr-1" />
                {category}
              </Badge>
            ))}
            {vacancy.job_category_names.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{vacancy.job_category_names.length - 2}
              </Badge>
            )}
          </div>
        ) : '-';
      
      case 'job_posted_at':
        return vacancy.job_posted_at ? (
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{new Date(vacancy.job_posted_at).toLocaleDateString()}</span>
          </div>
        ) : '-';
      
      case 'created_at':
        return (
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{new Date(vacancy.created_at).toLocaleDateString()}</span>
          </div>
        );
      
      default:
        const value = vacancy[columnKey as keyof Vacancy];
        return value !== null && value !== undefined ? String(value) : '-';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <SortableHeader key={column.key} field={column.key as SortField}>
                  {column.label}
                </SortableHeader>
              ))}
              <TableHead className="sticky right-0 bg-background z-10 border-l">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedVacancies.map((vacancy) => (
              <TableRow key={vacancy.id} className="hover:bg-muted/50">
                {visibleColumns.map((column) => (
                  <TableCell 
                    key={column.key}
                    className={column.key === 'title' ? 'sticky left-0 bg-background z-10 border-r' : ''}
                  >
                    {renderCellContent(vacancy, column.key)}
                  </TableCell>
                ))}
                <TableCell className="sticky right-0 bg-background z-10 border-l">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView?.(vacancy)}
                      title="View Details"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(vacancy)}
                      title="Edit Vacancy"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {sortedVacancies.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No vacancies found matching the current filters.
        </div>
      )}
    </div>
  );
};