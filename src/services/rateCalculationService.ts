
import { supabase } from '@/integrations/supabase/client';

export interface RateCalculation {
  charge_rate: number;
  pay_rate: number;
  margin: number;
  margin_percent: number;
  rate_description: string;
  rate_category: string;
  applicable_rate_id?: string;
}

export class RateCalculationService {
  static async calculateBookingRates(
    customerId: string,
    driverClass: string,
    dayType: 'weekday' | 'saturday' | 'sunday' | 'bank_holiday',
    shiftType: 'day_shift' | 'night_shift',
    startDate: string,
    endDate: string
  ): Promise<RateCalculation | null> {
    try {
      // Determine rate category based on shift type and day type
      const rateCategory = this.getRateCategory(dayType, shiftType);
      
      // First, try to find customer-specific rate
      let { data: companyRates, error } = await supabase
        .from('company_rates')
        .select('*')
        .eq('customer_id', customerId)
        .eq('driver_class', driverClass)
        .eq('rate_category', rateCategory)
        .eq('is_active', true)
        .lte('valid_from', startDate)
        .gte('valid_to', endDate)
        .order('valid_from', { ascending: false })
        .limit(1);

      if (error) throw error;

      // If no customer-specific rate found, try to find default rate
      if (!companyRates || companyRates.length === 0) {
        const { data: defaultRates, error: defaultError } = await supabase
          .from('day_type_rates')
          .select('*')
          .eq('day_type', rateCategory);

        if (defaultError) throw defaultError;
        
        if (defaultRates && defaultRates.length > 0) {
          const defaultRate = defaultRates[0];
          return {
            charge_rate: defaultRate.charge_rate,
            pay_rate: defaultRate.pay_rate,
            margin: defaultRate.charge_rate - defaultRate.pay_rate,
            margin_percent: ((defaultRate.charge_rate - defaultRate.pay_rate) / defaultRate.charge_rate) * 100,
            rate_description: `Default ${rateCategory} rate`,
            rate_category: rateCategory
          };
        }
      } else {
        const rate = companyRates[0];
        return {
          charge_rate: rate.charge_rate,
          pay_rate: rate.pay_rate,
          margin: rate.charge_rate - rate.pay_rate,
          margin_percent: ((rate.charge_rate - rate.pay_rate) / rate.charge_rate) * 100,
          rate_description: rate.description || `Company ${rateCategory} rate`,
          rate_category: rateCategory,
          applicable_rate_id: rate.id
        };
      }

      return null;
    } catch (error) {
      console.error('Error calculating rates:', error);
      return null;
    }
  }

  static getRateCategory(dayType: string, shiftType: string): string {
    if (shiftType === 'night_shift') return 'nights';
    
    switch (dayType) {
      case 'saturday':
        return 'saturday';
      case 'sunday':
        return 'sunday';
      case 'bank_holiday':
        return 'bank_holiday';
      default:
        return 'weekday';
    }
  }

  static calculateTotalCost(
    hourlyRate: number,
    startDateTime: Date,
    endDateTime: Date,
    expenses: number = 0
  ): {
    total_hours: number;
    total_cost: number;
    total_with_expenses: number;
  } {
    const totalHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
    const totalCost = hourlyRate * totalHours;
    
    return {
      total_hours: totalHours,
      total_cost: totalCost,
      total_with_expenses: totalCost + expenses
    };
  }

  static formatRateBreakdown(
    rateCalc: RateCalculation,
    totalHours: number,
    expenses: number = 0
  ): {
    charge_total: number;
    pay_total: number;
    margin_total: number;
    expenses: number;
    grand_total_charge: number;
    grand_total_pay: number;
  } {
    const chargeTotal = rateCalc.charge_rate * totalHours;
    const payTotal = rateCalc.pay_rate * totalHours;
    const marginTotal = chargeTotal - payTotal;
    
    return {
      charge_total: chargeTotal,
      pay_total: payTotal,
      margin_total: marginTotal,
      expenses: expenses,
      grand_total_charge: chargeTotal + expenses,
      grand_total_pay: payTotal + expenses
    };
  }

  static async getAvailableDriverClasses(customerId?: string): Promise<string[]> {
    try {
      let query = supabase
        .from('company_rates')
        .select('driver_class')
        .eq('is_active', true);

      if (customerId) {
        query = query.eq('customer_id', customerId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Get unique driver classes
      const uniqueClasses = [...new Set(data?.map(rate => rate.driver_class) || [])];
      return uniqueClasses;
    } catch (error) {
      console.error('Error fetching driver classes:', error);
      return ['Class 1', 'Class 2', 'Class 3', 'Specialist', 'Trainee']; // fallback
    }
  }
}
