
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Star } from 'lucide-react';

interface RateFieldsProps {
  formData: {
    pay_rate: string;
    amended_pay_rate: string;
    charge_rate: string;
    expenses: string;
    holiday_accrual: boolean;
  };
  onUpdate: (updates: Partial<typeof formData>) => void;
  ratePreview?: {
    charge_rate: number;
    pay_rate: number;
    margin: number;
    margin_percent: number;
    rate_description?: string;
  };
  duration: number;
}

const RateFields = ({ formData, onUpdate, ratePreview, duration }: RateFieldsProps) => {
  const effectivePayRate = parseFloat(formData.amended_pay_rate || formData.pay_rate || '0');
  const chargeRate = parseFloat(formData.charge_rate || '0');
  const expenses = parseFloat(formData.expenses || '0');

  const totalPay = effectivePayRate * duration + expenses;
  const totalCharge = chargeRate * duration + expenses;
  const totalMargin = totalCharge - totalPay;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="pay_rate">Pay Rate (£/hour)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="pay_rate"
              type="number"
              step="0.01"
              value={formData.pay_rate}
              onChange={(e) => onUpdate({ pay_rate: e.target.value })}
              placeholder="0.00"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="amended_pay_rate">Amended Pay Rate (£/hour)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="amended_pay_rate"
              type="number"
              step="0.01"
              value={formData.amended_pay_rate}
              onChange={(e) => onUpdate({ amended_pay_rate: e.target.value })}
              placeholder="0.00"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="charge_rate">Charge Rate (£/hour)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="charge_rate"
              type="number"
              step="0.01"
              value={formData.charge_rate}
              onChange={(e) => onUpdate({ charge_rate: e.target.value })}
              placeholder="0.00"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="expenses">Expenses (£)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="expenses"
              type="number"
              step="0.01"
              value={formData.expenses}
              onChange={(e) => onUpdate({ expenses: e.target.value })}
              placeholder="0.00"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="holiday_accrual"
          checked={formData.holiday_accrual}
          onCheckedChange={(checked) => onUpdate({ holiday_accrual: checked })}
        />
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4" />
          <Label htmlFor="holiday_accrual">Holiday Accrual</Label>
        </div>
      </div>

      {ratePreview && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Rate Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-lg text-green-600">£{ratePreview.charge_rate}</div>
                <div className="text-muted-foreground">Charge Rate/hour</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-blue-600">£{ratePreview.pay_rate}</div>
                <div className="text-muted-foreground">Pay Rate/hour</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-purple-600">£{ratePreview.margin.toFixed(2)}</div>
                <div className="text-muted-foreground">Margin/hour</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-orange-600">{ratePreview.margin_percent.toFixed(1)}%</div>
                <div className="text-muted-foreground">Margin %</div>
              </div>
            </div>
            {duration > 0 && (
              <div className="mt-4 p-3 bg-white rounded border">
                <div className="text-sm text-center">
                  <span className="font-medium">Total Duration: {duration.toFixed(1)} hours</span>
                  <span className="mx-4">|</span>
                  <span className="font-medium">Total Charge: £{totalCharge.toFixed(2)}</span>
                  <span className="mx-4">|</span>
                  <span className="font-medium">Total Pay: £{totalPay.toFixed(2)}</span>
                  <span className="mx-4">|</span>
                  <span className="font-medium text-purple-600">Total Margin: £{totalMargin.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RateFields;
