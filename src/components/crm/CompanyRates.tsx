
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CompanyRate, CompanyRatesProps, RateFormData } from './rates/types';
import RateFormDialog from './rates/RateFormDialog';
import RatesTable from './rates/RatesTable';
import EmptyRatesState from './rates/EmptyRatesState';

const CompanyRates = ({ companyId }: CompanyRatesProps) => {
  const [rates, setRates] = useState<CompanyRate[]>([
    {
      id: '1',
      driver_class: 'Class 1',
      rate_category: 'days',
      charge_rate: 24.00,
      pay_rate: 20.00,
      description: 'Standard Class 1 driver rate',
      valid_from: '2024-01-01',
      is_active: true
    },
    {
      id: '2',
      driver_class: 'Class 1',
      rate_category: 'nights',
      charge_rate: 27.60,
      pay_rate: 23.00,
      description: 'Standard Class 1 driver rate - Night rate',
      valid_from: '2024-01-01',
      is_active: true
    },
    {
      id: '3',
      driver_class: 'Class 1',
      rate_category: 'saturday',
      charge_rate: 26.40,
      pay_rate: 22.00,
      description: 'Standard Class 1 driver rate - Saturday rate',
      valid_from: '2024-01-01',
      is_active: true
    },
    {
      id: '4',
      driver_class: 'Class 1',
      rate_category: 'sunday',
      charge_rate: 28.80,
      pay_rate: 24.00,
      description: 'Standard Class 1 driver rate - Sunday rate',
      valid_from: '2024-01-01',
      is_active: true
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<CompanyRate | null>(null);
  const [formData, setFormData] = useState<RateFormData>({
    driver_class: '',
    rate_category: 'days',
    charge_rate: '',
    pay_rate: '',
    description: '',
    valid_from: new Date().toISOString().split('T')[0],
    valid_to: ''
  });

  const handleAddRate = () => {
    const newRate: CompanyRate = {
      id: Date.now().toString(),
      driver_class: formData.driver_class,
      rate_category: formData.rate_category,
      charge_rate: parseFloat(formData.charge_rate),
      pay_rate: parseFloat(formData.pay_rate),
      description: formData.description,
      valid_from: formData.valid_from,
      valid_to: formData.valid_to || undefined,
      is_active: true
    };
    
    setRates([...rates, newRate]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditRate = (rate: CompanyRate) => {
    setEditingRate(rate);
    setFormData({
      driver_class: rate.driver_class,
      rate_category: rate.rate_category,
      charge_rate: rate.charge_rate.toString(),
      pay_rate: rate.pay_rate.toString(),
      description: rate.description || '',
      valid_from: rate.valid_from,
      valid_to: rate.valid_to || ''
    });
  };

  const handleUpdateRate = () => {
    if (!editingRate) return;
    
    const updatedRates = rates.map(rate => 
      rate.id === editingRate.id 
        ? {
            ...rate,
            driver_class: formData.driver_class,
            rate_category: formData.rate_category,
            charge_rate: parseFloat(formData.charge_rate),
            pay_rate: parseFloat(formData.pay_rate),
            description: formData.description,
            valid_from: formData.valid_from,
            valid_to: formData.valid_to || undefined
          }
        : rate
    );
    
    setRates(updatedRates);
    setEditingRate(null);
    resetForm();
  };

  const handleDeleteRate = (rateId: string) => {
    setRates(rates.filter(rate => rate.id !== rateId));
  };

  const resetForm = () => {
    setFormData({
      driver_class: '',
      rate_category: 'days',
      charge_rate: '',
      pay_rate: '',
      description: '',
      valid_from: new Date().toISOString().split('T')[0],
      valid_to: ''
    });
  };

  const handleAddRateForClass = (driverClass: string, category?: string) => {
    setFormData({
      driver_class: driverClass,
      rate_category: category || 'days',
      charge_rate: '',
      pay_rate: '',
      description: '',
      valid_from: new Date().toISOString().split('T')[0],
      valid_to: ''
    });
    setIsAddDialogOpen(true);
  };

  // Group rates by driver class
  const groupedRates = rates.reduce((acc, rate) => {
    if (!acc[rate.driver_class]) {
      acc[rate.driver_class] = {};
    }
    acc[rate.driver_class][rate.rate_category] = rate;
    return acc;
  }, {} as Record<string, Record<string, CompanyRate>>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Company Rates</h3>
          <p className="text-sm text-muted-foreground">Manage specific rates for different time periods</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Rate
            </Button>
          </DialogTrigger>
          <RateFormDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            title="Add New Rate"
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={handleAddRate}
          />
        </Dialog>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedRates).map(([driverClass, categoryRates]) => (
          <Card key={driverClass}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{driverClass}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {Object.keys(categoryRates).length} rate{Object.keys(categoryRates).length !== 1 ? 's' : ''} configured
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddRateForClass(driverClass)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Rate
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RatesTable
                rates={categoryRates}
                driverClass={driverClass}
                onEditRate={handleEditRate}
                onDeleteRate={handleDeleteRate}
                onAddRate={handleAddRateForClass}
                editingRate={editingRate}
                formData={formData}
                onFormDataChange={setFormData}
                onUpdateRate={handleUpdateRate}
              />
            </CardContent>
          </Card>
        ))}
        
        {Object.keys(groupedRates).length === 0 && (
          <EmptyRatesState onAddRate={() => setIsAddDialogOpen(true)} />
        )}
      </div>
    </div>
  );
};

export default CompanyRates;
