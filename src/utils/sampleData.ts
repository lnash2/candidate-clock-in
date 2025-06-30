
import { supabase } from '@/integrations/supabase/client';

export const addSampleData = async () => {
  try {
    console.log('Adding sample data to database...');

    // Add sample organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert([{ name: 'Demo Recruitment Agency' }])
      .select()
      .single();

    if (orgError) {
      console.error('Error creating organization:', orgError);
      return;
    }

    // Add sample customers
    const customersData = [
      {
        organization_id: orgData.id,
        company: 'Cheltenham Racecourse',
        contact_name: 'James Wilson',
        contact_phone: '01242 123456',
        contact_email: 'james.wilson@cheltenham.co.uk',
        address_line_1: 'Prestbury Park',
        post_code: 'GL50 4SH',
        county: 'Gloucestershire',
        country: 'United Kingdom'
      },
      {
        organization_id: orgData.id,
        company: 'Newmarket Training Centre',
        contact_name: 'Sarah Thompson',
        contact_phone: '01638 987654',
        contact_email: 'sarah.thompson@newmarket.co.uk',
        address_line_1: 'The Gallops',
        post_code: 'CB8 0XE',
        county: 'Suffolk',
        country: 'United Kingdom'
      },
      {
        organization_id: orgData.id,
        company: 'Royal Windsor Stables',
        contact_name: 'Michael Brown',
        contact_phone: '01753 456789',
        contact_email: 'michael.brown@windsor.co.uk',
        address_line_1: 'Windsor Great Park',
        post_code: 'SL4 3SE',
        county: 'Berkshire',
        country: 'United Kingdom'
      }
    ];

    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .insert(customersData)
      .select();

    if (customersError) {
      console.error('Error creating customers:', customersError);
      return;
    }

    // Add sample candidates
    const candidatesData = [
      {
        organization_id: orgData.id,
        candidate_name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '07123 456789',
        address: '123 Main Street, London',
        postcode: 'SW1A 1AA',
        job_title: 'Horse Transport Driver',
        preferred_shift: 'Days',
        national_insurance_no: 'AB123456C',
        recruiter: 'Emma Davis',
        payroll_type: 'PAYE',
        active_status: 'Active',
        onboarding_status: 'Complete',
        registration_status: 'Registered'
      },
      {
        organization_id: orgData.id,
        candidate_name: 'Mike Thompson',
        email: 'mike.thompson@email.com',
        phone: '07987 654321',
        address: '456 Oak Avenue, Birmingham',
        postcode: 'B1 1AA',
        job_title: 'Horse Transport Driver',
        preferred_shift: 'Nights',
        national_insurance_no: 'CD789123E',
        recruiter: 'Emma Davis',
        payroll_type: 'PAYE',
        active_status: 'Active',
        onboarding_status: 'Complete',
        registration_status: 'Registered'
      }
    ];

    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
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
        year: 2022,
        weight: '3.5t',
        truck_length_m: '6.5',
        horse_capacity: 3,
        can_go_overseas: false,
        status: 'active'
      },
      {
        truck_registration: 'GHI789',
        model: 'Iveco Daily',
        year: 2021,
        weight: '7.5t',
        truck_length_m: '7.2',
        horse_capacity: 6,
        can_go_overseas: true,
        status: 'active'
      }
    ];

    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .insert(vehiclesData)
      .select();

    if (vehiclesError) {
      console.error('Error creating vehicles:', vehiclesError);
      return;
    }

    // Add sample note types
    const noteTypesData = [
      { name: '1st Interview', color: '#3B82F6', organization_id: orgData.id },
      { name: 'BD Call', color: '#10B981', organization_id: orgData.id },
      { name: 'Candidate First Call - New Starter', color: '#8B5CF6', organization_id: orgData.id },
      { name: 'Candidate First Contact', color: '#F59E0B', organization_id: orgData.id },
      { name: 'CV Sent', color: '#F97316', organization_id: orgData.id },
      { name: 'Email', color: '#EC4899', organization_id: orgData.id }
    ];

    const { error: noteTypesError } = await supabase
      .from('note_types')
      .insert(noteTypesData);

    if (noteTypesError) {
      console.error('Error creating note types:', noteTypesError);
    }

    // Add sample company rates
    const ratesData = customers?.map(customer => [
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
    ]).flat();

    if (ratesData) {
      const { error: ratesError } = await supabase
        .from('company_rates')
        .insert(ratesData);

      if (ratesError) {
        console.error('Error creating company rates:', ratesError);
      }
    }

    console.log('Sample data added successfully!');
    return { success: true, organization: orgData };

  } catch (error) {
    console.error('Error adding sample data:', error);
    return { success: false, error };
  }
};
