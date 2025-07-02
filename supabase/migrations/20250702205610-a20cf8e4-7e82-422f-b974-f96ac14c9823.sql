-- Migration Phase 1: Candidates and Customers (Corrected)

-- Step 1: Migrate Candidates (42K records)
INSERT INTO candidates_prod (
    id,
    candidate_name,
    email,
    phone,
    address,
    city,
    postcode,
    national_insurance_number,
    hourly_rate,
    availability_status,
    active_status,
    licence_categories,
    skills,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid() as id,
    COALESCE(c.name, 'Unknown') as candidate_name,
    c.email,
    c.phone_number as phone,
    CASE 
        WHEN a.address1 IS NOT NULL THEN 
            CONCAT_WS(', ', a.address1, a.address2, a.street, a.city)
        ELSE NULL 
    END as address,
    a.city,
    a.postal_code as postcode,
    c.ni_number as national_insurance_number,
    CASE 
        WHEN c.expected_salary IS NOT NULL AND c.expected_salary < 99999999 THEN c.expected_salary::numeric(10,2)
        WHEN c.current_salary IS NOT NULL AND c.current_salary < 99999999 THEN c.current_salary::numeric(10,2)
        ELSE NULL
    END as hourly_rate,
    CASE 
        WHEN c.active_status = 'active' THEN 'Available'
        WHEN c.active_status = 'inactive' THEN 'Unavailable'
        ELSE 'Available'
    END as availability_status,
    CASE 
        WHEN c.active_status IN ('active', 'registered') THEN 'Active'
        ELSE 'Inactive'
    END as active_status,
    CASE 
        WHEN c.driver_license IS NOT NULL THEN 
            ARRAY[c.driver_license]::text[]
        ELSE ARRAY[]::text[]
    END as licence_categories,
    CASE 
        WHEN c.job_category_ids IS NOT NULL THEN 
            (SELECT array_agg(jc.name) 
             FROM job_categories jc 
             WHERE jc.id = ANY(c.job_category_ids))::text[]
        ELSE ARRAY[]::text[]
    END as skills,
    to_timestamp(c.created_at) as created_at,
    CASE 
        WHEN c.updated_at IS NOT NULL THEN to_timestamp(c.updated_at)
        ELSE to_timestamp(c.created_at)
    END as updated_at
FROM candidates c
LEFT JOIN addresses a ON c.address_id = a.id
WHERE c.name IS NOT NULL
ON CONFLICT DO NOTHING;

-- Step 2: Migrate Companies to Customers (27K records)
INSERT INTO customers_prod (
    id,
    company,
    contact_name,
    contact_email,
    contact_phone,
    address,
    city,
    postcode,
    country,
    is_active,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid() as id,
    COALESCE(comp.name, 'Unknown Company') as company,
    cont.name as contact_name,
    COALESCE(cont.work_email, cont.personal_email) as contact_email,
    COALESCE(cont.work_phone, cont.personal_mobile, cont.direct_dial_phone) as contact_phone,
    CASE 
        WHEN a.address1 IS NOT NULL THEN 
            CONCAT_WS(', ', a.address1, a.address2, a.street)
        ELSE NULL 
    END as address,
    a.city,
    a.postal_code as postcode,
    a.country,
    true as is_active,
    to_timestamp(comp.created_at) as created_at,
    CASE 
        WHEN comp.updated_at IS NOT NULL THEN to_timestamp(comp.updated_at)
        ELSE to_timestamp(comp.created_at)
    END as updated_at
FROM companies comp
LEFT JOIN contacts cont ON cont.company_id = comp.id
LEFT JOIN addresses a ON comp.address_id = a.id
WHERE comp.name IS NOT NULL
ON CONFLICT DO NOTHING;