import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  sslMode: boolean;
}

interface MigrationConfig {
  database: DatabaseConfig;
  tables: string[];
  batchSize: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting legacy data migration with non-SSL priority...')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { config } = await req.json() as { config: MigrationConfig }
    
    console.log(`Connecting to: ${config.database.host}:${config.database.port}/${config.database.database}`)
    
    // Use robust connection with non-SSL priority
    const legacyClient = await createRobustConnection(config.database)
    
    console.log('Connected to legacy database successfully')

    // Get all tables from legacy database if not specified
    let tablesToMigrate = config.tables
    if (!tablesToMigrate || tablesToMigrate.length === 0) {
      const tableResult = await legacyClient.queryObject(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      `)
      tablesToMigrate = tableResult.rows.map((row: any) => row.table_name)
    }

    console.log(`Found ${tablesToMigrate.length} tables to migrate:`, tablesToMigrate)

    const results = []

    for (const tableName of tablesToMigrate) {
      try {
        console.log(`Starting migration for table: ${tableName}`)
        
        // Update migration status
        await supabaseClient
          .from('migration_status')
          .upsert({
            table_name: tableName,
            status: 'running',
            started_at: new Date().toISOString()
          })

        // Get table schema from legacy database
        const schemaResult = await legacyClient.queryObject(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = $1 
          ORDER BY ordinal_position
        `, [tableName])

        console.log(`Schema for ${tableName}:`, schemaResult.rows)

        // Create PCRM table in Supabase
        const pcrm_table_name = `${tableName}_pcrm`
        await createPCRMTable(supabaseClient, pcrm_table_name, schemaResult.rows)

        // Get total record count
        const countResult = await legacyClient.queryObject(`SELECT COUNT(*) as count FROM ${tableName}`)
        const totalRecords = Number(countResult.rows[0]?.count || 0)

        // Update total records
        await supabaseClient
          .from('migration_status')
          .update({ 
            total_records: totalRecords 
          })
          .eq('table_name', tableName)

        console.log(`Total records to migrate for ${tableName}: ${totalRecords}`)

        // Migrate data in batches
        let migratedCount = 0
        const batchSize = config.batchSize || 1000
        
        for (let offset = 0; offset < totalRecords; offset += batchSize) {
          const dataResult = await legacyClient.queryObject(`
            SELECT * FROM ${tableName} 
            ORDER BY 1 
            LIMIT ${batchSize} OFFSET ${offset}
          `)

          if (dataResult.rows.length > 0) {
            // Transform data for PCRM table
            const transformedData = dataResult.rows.map((row: any) => ({
              ...row,
              legacy_id: String(row.id || row.uuid || offset + dataResult.rows.indexOf(row)),
              migrated_at: new Date().toISOString(),
              migration_source: 'legacy_admin'
            }))

            // Insert into PCRM table
            const { error } = await supabaseClient
              .from(pcrm_table_name)
              .insert(transformedData)

            if (error) {
              console.error(`Error inserting batch for ${tableName}:`, error)
              throw error
            }

            migratedCount += dataResult.rows.length
            
            // Update progress
            await supabaseClient
              .from('migration_status')
              .update({ 
                migrated_records: migratedCount 
              })
              .eq('table_name', tableName)

            console.log(`Migrated ${migratedCount}/${totalRecords} records for ${tableName}`)
          }
        }

        // Mark as completed
        await supabaseClient
          .from('migration_status')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            migrated_records: migratedCount
          })
          .eq('table_name', tableName)

        results.push({
          table: tableName,
          status: 'completed',
          records_migrated: migratedCount
        })

        console.log(`Completed migration for ${tableName}: ${migratedCount} records`)

      } catch (error) {
        console.error(`Error migrating table ${tableName}:`, error)
        
        await supabaseClient
          .from('migration_status')
          .update({
            status: 'failed',
            error_message: error.message,
            completed_at: new Date().toISOString()
          })
          .eq('table_name', tableName)

        results.push({
          table: tableName,
          status: 'failed',
          error: error.message
        })
      }
    }

    await legacyClient.end()
    console.log('Migration completed')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Migration completed',
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Migration error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function createRobustConnection(config: DatabaseConfig): Promise<Client> {
  const strategies = []
  
  // Strategy 1: Non-SSL connection (most likely to work)
  strategies.push({
    name: 'Non-SSL connection',
    config: {
      hostname: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
      tls: {
        enabled: false
      }
    }
  })
  
  // Strategy 2: Connection string without SSL
  strategies.push({
    name: 'Connection string without SSL',
    config: `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?sslmode=disable`
  })
  
  // Strategy 3: SSL prefer (auto-fallback)
  strategies.push({
    name: 'SSL prefer mode',
    config: {
      hostname: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
      tls: {
        enabled: true,
        enforce: false
      }
    }
  })
  
  // Strategy 4: Basic connection
  strategies.push({
    name: 'Basic connection',
    config: {
      hostname: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database
    }
  })
  
  for (const strategy of strategies) {
    try {
      console.log(`Attempting connection with: ${strategy.name}`)
      const client = new Client(strategy.config)
      await client.connect()
      console.log(`✅ Connected successfully using: ${strategy.name}`)
      return client
    } catch (error) {
      console.log(`❌ ${strategy.name} failed:`, error.message)
    }
  }
  
  throw new Error('All connection strategies failed')
}

async function createPCRMTable(supabaseClient: any, tableName: string, columns: any[]) {
  // Check if table already exists
  const { data: existingTables } = await supabaseClient
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_name', tableName)

  if (existingTables && existingTables.length > 0) {
    console.log(`Table ${tableName} already exists, skipping creation`)
    return
  }

  // Build CREATE TABLE statement
  const columnDefinitions = columns.map((col: any) => {
    let definition = `${col.column_name} `
    
    // Map PostgreSQL types
    switch (col.data_type.toLowerCase()) {
      case 'integer':
      case 'bigint':
        definition += 'INTEGER'
        break
      case 'character varying':
      case 'varchar':
      case 'text':
        definition += 'TEXT'
        break
      case 'timestamp without time zone':
      case 'timestamp with time zone':
        definition += 'TIMESTAMP WITH TIME ZONE'
        break
      case 'date':
        definition += 'DATE'
        break
      case 'boolean':
        definition += 'BOOLEAN'
        break
      case 'numeric':
      case 'decimal':
        definition += 'NUMERIC'
        break
      case 'uuid':
        definition += 'UUID'
        break
      default:
        definition += 'TEXT'
    }
    
    if (col.is_nullable === 'NO') {
      definition += ' NOT NULL'
    }
    
    return definition
  }).join(', ')

  const createTableSQL = `
    CREATE TABLE public.${tableName} (
      id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      legacy_id TEXT NOT NULL UNIQUE,
      ${columnDefinitions},
      migrated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      migration_source TEXT DEFAULT 'legacy_admin'
    );
    
    ALTER TABLE public.${tableName} ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Allow all operations on ${tableName}" 
      ON public.${tableName} 
      FOR ALL 
      USING (true);
  `

  console.log(`Creating table ${tableName} with SQL:`, createTableSQL)
  
  // Execute the SQL using rpc (this is a special case for DDL)
  const { error } = await supabaseClient.rpc('exec_sql', { sql: createTableSQL })
  
  if (error) {
    console.error(`Error creating table ${tableName}:`, error)
    throw error
  }
  
  console.log(`Successfully created table: ${tableName}`)
}
