
import { supabase } from '@/integrations/supabase/client';

export const addSampleData = async () => {
  try {
    console.log('Adding sample data to database...');

    // Add sample customers (replacing organizations)
    const customersData = [
      {
        company: 'Cheltenham Racecourse',
        contact_name: 'James Wilson',
        contact_phone: '01242 123456',
        contact_email: 'james.wilson@cheltenham.co.uk',
        address: 'Prestbury Park',
        postcode: 'GL50 4SH',
        city: 'Cheltenham',
        country: 'United Kingdom'
      },
      {
        company: 'Newmarket Training Centre',
        contact_name: 'Sarah Thompson',
        contact_phone: '01638 987654',
        contact_email: 'sarah.thompson@newmarket.co.uk',
        address: 'The Gallops',
        postcode: 'CB8 0XE',
        city: 'Newmarket',
        country: 'United Kingdom'
      },
      {
        company: 'Royal Windsor Stables',
        contact_name: 'Michael Brown',
        contact_phone: '01753 456789',
        contact_email: 'michael.brown@windsor.co.uk',
        address: 'Windsor Great Park',
        postcode: 'SL4 3SE',
        city: 'Windsor',
        country: 'United Kingdom'
      }
    ];

    const { data: customers, error: customersError } = await supabase
      .from('customers_prod')
      .insert(customersData)
      .select();

    if (customersError) {
      console.error('Error creating customers:', customersError);
      return;
    }

    // Add sample candidates
    const candidatesData = [
      {
        candidate_name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '07123 456789',
        address: '123 Main Street, London',
        postcode: 'SW1A 1AA',
        national_insurance_number: 'AB123456C',
        hourly_rate: 20.00,
        availability_status: 'Available',
        active_status: 'Active'
      },
      {
        candidate_name: 'Mike Thompson',
        email: 'mike.thompson@email.com',
        phone: '07987 654321',
        address: '456 Oak Avenue, Birmingham',
        postcode: 'B1 1AA',
        national_insurance_number: 'CD789123E',
        hourly_rate: 22.00,
        availability_status: 'Available',
        active_status: 'Active'
      }
    ];

    const { data: candidatesResult, error: candidatesError } = await supabase
      .from('candidates_prod')
      .insert(candidatesData)
      .select();

    if (candidatesError) {
      console.error('Error creating candidates:', candidatesError);
      return;
    }

    // Add sample vehicles
    const vehiclesData = [
      {
        truck_registration: 'ABC123',
        model: 'Mercedes Sprinter',
        manufacturer: 'Mercedes',
        year_manufactured: 2022,
        gross_weight: 3500,
        status: 'Available'
      },
      {
        truck_registration: 'GHI789',
        model: 'Iveco Daily',
        manufacturer: 'Iveco',
        year_manufactured: 2021,
        gross_weight: 7500,
        status: 'Available'
      }
    ];

    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles_prod')
      .insert(vehiclesData)
      .select();

    if (vehiclesError) {
      console.error('Error creating vehicles:', vehiclesError);
      return;
    }

    // Add sample company rates
    if (customers && customers.length > 0) {
      const ratesData = customers.flatMap(customer => [
        {
          customer_id: customer.id,
          driver_class: 'Class 1',
          rate_category: 'days',
          charge_rate: 24.00,
          pay_rate: 20.00,
          description: 'Standard Class 1 driver rate - weekdays'
        },
        {
          customer_id: customer.id,
          driver_class: 'Class 1',
          rate_category: 'nights',
          charge_rate: 27.60,
          pay_rate: 23.00,
          description: 'Night rate for Class 1 drivers'
        },
        {
          customer_id: customer.id,
          driver_class: 'Class 2',
          rate_category: 'days',
          charge_rate: 22.00,
          pay_rate: 18.00,
          description: 'Standard Class 2 driver rate - weekdays'
        }
      ]);

      const { error: ratesError } = await supabase
        .from('company_rates_prod')
        .insert(ratesData);

      if (ratesError) {
        console.error('Error creating company rates:', ratesError);
      }
    }

    console.log('Sample data added successfully!');
    return { success: true, customers };

  } catch (error) {
    console.error('Error adding sample data:', error);
    return { success: false, error };
  }
};
