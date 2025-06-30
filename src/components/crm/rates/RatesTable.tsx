
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CompanyRate } from './types';
import { rateCategories, getCategoryColor } from './constants';
import RateFormDialog from './RateFormDialog';

interface RatesTableProps {
  rates: Record<string, CompanyRate>;
  driverClass: string;
  onEditRate: (rate: CompanyRate) => void;
  onDeleteRate: (rateId: string) => void;
  onAddRate: (driverClass: string, category: string) => void;
  editingRate: CompanyRate | null;
  formData: any;
  onFormDataChange: (data: any) => void;
  onUpdateRate: () => void;
}

const RatesTable = ({
  rates,
  driverClass,
  onEditRate,
  onDeleteRate,
  onAddRate,
  editingRate,
  formData,
  onFormDataChange,
  onUpdateRate
}: RatesTableProps) => {
  const getIcon = (categoryValue: string) => {
    switch (categoryValue) {
      case 'nights': return Clock;
      default: return Calendar;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Charge Rate</TableHead>
          <TableHead>Pay Rate</TableHead>
          <TableHead>Margin</TableHead>
          <TableHead>Valid Period</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rateCategories.map(category => {
          const rate = rates[category.value];
          const IconComponent = getIcon(category.value);
          
          return (
            <TableRow key={category.value}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <IconComponent className="w-4 h-4" />
                  <Badge className={getCategoryColor(category.value)}>
                    {category.label}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                {rate ? (
                  <span className="text-lg font-bold text-green-600">
                    £{rate.charge_rate.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Not set</span>
                )}
              </TableCell>
              <TableCell>
                {rate ? (
                  <span className="text-lg font-bold text-blue-600">
                    £{rate.pay_rate.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Not set</span>
                )}
              </TableCell>
              <TableCell>
                {rate ? (
                  <span className="font-bold text-purple-600">
                    £{(rate.charge_rate - rate.pay_rate).toFixed(2)} ({(((rate.charge_rate - rate.pay_rate) / rate.charge_rate) * 100).toFixed(1)}%)
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {rate ? (
                  <div className="text-xs">
                    <div>{rate.valid_from}</div>
                    {rate.valid_to && <div>to {rate.valid_to}</div>}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {rate ? (
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => onEditRate(rate)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>
                      <RateFormDialog
                        isOpen={editingRate?.id === rate.id}
                        onOpenChange={() => {}}
                        title="Edit Rate"
                        formData={formData}
                        onFormDataChange={onFormDataChange}
                        onSubmit={onUpdateRate}
                      />
                    </Dialog>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDeleteRate(rate.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddRate(driverClass, category.value)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Set Rate
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default RatesTable;
