
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, DollarSign, Clock, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CompanyRatesProps {
  companyId: number;
}

interface CompanyRate {
  id: string;
  driver_class: string;
  rate_category: string;
  charge_rate: number;
  pay_rate: number;
  description?: string;
  valid_from: string;
  valid_to?: string;
  is_active: boolean;
}

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
  const [formData, setFormData] = useState({
    driver_class: '',
    rate_category: 'days',
    charge_rate: '',
    pay_rate: '',
    description: '',
    valid_from: new Date().toISOString().split('T')[0],
    valid_to: ''
  });

  const driverClasses = ['Class 1', 'Class 2', 'Class 3', 'Specialist', 'Trainee'];
  const rateCategories = [
    { value: 'days', label: 'Days', icon: Calendar },
    { value: 'nights', label: 'Nights', icon: Clock },
    { value: 'saturday', label: 'Saturday', icon: Calendar },
    { value: 'sunday', label: 'Sunday', icon: Calendar }
  ];

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

  const getMargin = (chargeRate: number, payRate: number) => {
    return chargeRate - payRate;
  };

  const getMarginPercent = (chargeRate: number, payRate: number) => {
    return ((chargeRate - payRate) / chargeRate * 100);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'days': return 'bg-blue-100 text-blue-800';
      case 'nights': return 'bg-purple-100 text-purple-800';
      case 'saturday': return 'bg-green-100 text-green-800';
      case 'sunday': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Rate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="driver_class">Driver Class</Label>
                <Select value={formData.driver_class} onValueChange={(value) => setFormData({...formData, driver_class: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver class" />
                  </SelectTrigger>
                  <SelectContent>
                    {driverClasses.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rate_category">Rate Category</Label>
                <Select value={formData.rate_category} onValueChange={(value) => setFormData({...formData, rate_category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rateCategories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="charge_rate">Charge Rate (£/hour)</Label>
                  <Input
                    id="charge_rate"
                    type="number"
                    step="0.01"
                    value={formData.charge_rate}
                    onChange={(e) => setFormData({...formData, charge_rate: e.target.value})}
                    placeholder="24.00"
                  />
                </div>
                <div>
                  <Label htmlFor="pay_rate">Pay Rate (£/hour)</Label>
                  <Input
                    id="pay_rate"
                    type="number"
                    step="0.01"
                    value={formData.pay_rate}
                    onChange={(e) => setFormData({...formData, pay_rate: e.target.value})}
                    placeholder="20.00"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Rate description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valid_from">Valid From</Label>
                  <Input
                    id="valid_from"
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="valid_to">Valid To (Optional)</Label>
                  <Input
                    id="valid_to"
                    type="date"
                    value={formData.valid_to}
                    onChange={(e) => setFormData({...formData, valid_to: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleAddRate} className="w-full">
                Add Rate
              </Button>
            </div>
          </DialogContent>
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
                  onClick={() => {
                    setFormData({
                      driver_class: driverClass,
                      rate_category: 'days',
                      charge_rate: '',
                      pay_rate: '',
                      description: '',
                      valid_from: new Date().toISOString().split('T')[0],
                      valid_to: ''
                    });
                    setIsAddDialogOpen(true);
                  }}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Rate
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                    const rate = categoryRates[category.value];
                    const IconComponent = category.icon;
                    
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
                                  <Button variant="outline" size="sm" onClick={() => handleEditRate(rate)}>
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Rate</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="edit_driver_class">Driver Class</Label>
                                      <Select value={formData.driver_class} onValueChange={(value) => setFormData({...formData, driver_class: value})}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {driverClasses.map(cls => (
                                            <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="edit_rate_category">Rate Category</Label>
                                      <Select value={formData.rate_category} onValueChange={(value) => setFormData({...formData, rate_category: value})}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {rateCategories.map(cat => (
                                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="edit_charge_rate">Charge Rate (£/hour)</Label>
                                        <Input
                                          id="edit_charge_rate"
                                          type="number"
                                          step="0.01"
                                          value={formData.charge_rate}
                                          onChange={(e) => setFormData({...formData, charge_rate: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="edit_pay_rate">Pay Rate (£/hour)</Label>
                                        <Input
                                          id="edit_pay_rate"
                                          type="number"
                                          step="0.01"
                                          value={formData.pay_rate}
                                          onChange={(e) => setFormData({...formData, pay_rate: e.target.value})}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <Label htmlFor="edit_description">Description</Label>
                                      <Input
                                        id="edit_description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="edit_valid_from">Valid From</Label>
                                        <Input
                                          id="edit_valid_from"
                                          type="date"
                                          value={formData.valid_from}
                                          onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="edit_valid_to">Valid To (Optional)</Label>
                                        <Input
                                          id="edit_valid_to"
                                          type="date"
                                          value={formData.valid_to}
                                          onChange={(e) => setFormData({...formData, valid_to: e.target.value})}
                                        />
                                      </div>
                                    </div>
                                    <Button onClick={handleUpdateRate} className="w-full">
                                      Update Rate
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeleteRate(rate.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setFormData({
                                  driver_class: driverClass,
                                  rate_category: category.value,
                                  charge_rate: '',
                                  pay_rate: '',
                                  description: '',
                                  valid_from: new Date().toISOString().split('T')[0],
                                  valid_to: ''
                                });
                                setIsAddDialogOpen(true);
                              }}
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
            </CardContent>
          </Card>
        ))}
        
        {Object.keys(groupedRates).length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No rates set</h3>
              <p className="text-muted-foreground mb-4">
                Add company-specific rates for different driver classes and time periods
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Rate
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CompanyRates;
