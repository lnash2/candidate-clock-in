
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, DollarSign } from 'lucide-react';

const RateManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data - this would integrate with your day_type_rates table
  const rates = [
    {
      id: 1,
      dayType: 'weekday',
      chargeRate: 150.00,
      payRate: 120.00,
      description: 'Standard weekday rate',
      margin: 20.00,
      marginPercent: 20.0,
      lastUpdated: '2024-01-10'
    },
    {
      id: 2,
      dayType: 'weekend',
      chargeRate: 185.00,
      payRate: 145.00,
      description: 'Weekend and holiday rate',
      margin: 40.00,
      marginPercent: 27.6,
      lastUpdated: '2024-01-10'
    },
    {
      id: 3,
      dayType: 'bank_holiday',
      chargeRate: 225.00,
      payRate: 175.00,
      description: 'Bank holiday premium rate',
      margin: 50.00,
      marginPercent: 28.6,
      lastUpdated: '2024-01-10'
    },
    {
      id: 4,
      dayType: 'race_day',
      chargeRate: 275.00,
      payRate: 210.00,
      description: 'Premium race day rate',
      margin: 65.00,
      marginPercent: 31.0,
      lastUpdated: '2024-01-10'
    }
  ];

  // Mock customer-specific rates
  const customerRates = [
    {
      id: 1,
      customer: 'Cheltenham Racecourse',
      dayType: 'race_day',
      chargeRate: 250.00,
      payRate: 210.00,
      description: 'Negotiated rate for volume booking',
      margin: 40.00,
      marginPercent: 19.0,
      validFrom: '2024-01-01',
      validTo: '2024-12-31'
    },
    {
      id: 2,
      customer: 'Newmarket Training Centre',
      dayType: 'weekday',
      chargeRate: 140.00,
      payRate: 120.00,
      description: 'Long-term contract rate',
      margin: 20.00,
      marginPercent: 16.7,
      validFrom: '2024-01-01',
      validTo: '2024-06-30'
    }
  ];

  const getDayTypeColor = (dayType: string) => {
    switch (dayType) {
      case 'weekday': return 'bg-blue-100 text-blue-800';
      case 'weekend': return 'bg-purple-100 text-purple-800';
      case 'bank_holiday': return 'bg-orange-100 text-orange-800';
      case 'race_day': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Rate Management</h2>
          <p className="text-muted-foreground">Manage pricing for different day types and customers</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Rate</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Standard Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Standard Rates</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rates.map(rate => (
                <Card key={rate.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge className={getDayTypeColor(rate.dayType)}>
                          {rate.dayType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{rate.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Charge Rate:</span>
                        <div className="text-lg font-bold text-green-600">£{rate.chargeRate.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="font-medium">Pay Rate:</span>
                        <div className="text-lg font-bold text-blue-600">£{rate.payRate.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Margin:</span>
                        <span className="font-bold text-purple-600">
                          £{rate.margin.toFixed(2)} ({rate.marginPercent.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Last updated:</span>
                        <span>{rate.lastUpdated}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer-Specific Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Customer-Specific Rates</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerRates.map(rate => (
                <Card key={rate.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{rate.customer}</h4>
                        <Badge className={getDayTypeColor(rate.dayType)} size="sm">
                          {rate.dayType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{rate.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Charge Rate:</span>
                        <div className="text-lg font-bold text-green-600">£{rate.chargeRate.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="font-medium">Pay Rate:</span>
                        <div className="text-lg font-bold text-blue-600">£{rate.payRate.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Margin:</span>
                        <span className="font-bold text-purple-600">
                          £{rate.margin.toFixed(2)} ({rate.marginPercent.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Valid:</span>
                        <span>{rate.validFrom} to {rate.validTo}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Customer Rate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RateManagement;
