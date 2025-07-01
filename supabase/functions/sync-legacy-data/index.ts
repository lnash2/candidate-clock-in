
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

interface SyncRequest {
  database: DatabaseConfig;
  tableName: string;
  lastSyncTimestamp?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting legacy data sync with SSL certificate bypass...')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { database, tableName, lastSyncTimestamp } = await req.json() as SyncRequest
    
    // Create SSL connection with certificate bypass
    const legacyClient = await createSSLConnection(database)
    
    console.log(`Connected to legacy database for sync of ${tableName}`)

    const pcrm_table_name = `${tableName}_pcrm`

    // Build query to get changed records
    let query = `SELECT * FROM ${tableName}`
    const params = []
    
    if (lastSyncTimestamp) {
      // Assume there's an updated_at or modified_at column
      query += ` WHERE updated_at > $1 OR created_at > $1`
      params.push(lastSyncTimestamp)
    } else {
      // If no timestamp provided, get records from last hour
      query += ` WHERE updated_at > NOW() - INTERVAL '1 hour' OR created_at > NOW() - INTERVAL '1 hour'`
    }

    console.log(`Sync query: ${query}`)

    const changedRecords = await legacyClient.queryObject(query, params)
    
    console.log(`Found ${changedRecords.rows.length} changed records for ${tableName}`)

    if (changedRecords.rows.length > 0) {
      // Transform data for PCRM table
      const transformedData = changedRecords.rows.map((row: any) => ({
        ...row,
        legacy_id: String(row.id || row.uuid),
        migrated_at: new Date().toISOString(),
        migration_source: 'legacy_admin_sync'
      }))

      // Upsert into PCRM table (insert or update based on legacy_id)
      for (const record of transformedData) {
        const { error } = await supabaseClient
          .from(pcrm_table_name)
          .upsert(record, { onConflict: 'legacy_id' })

        if (error) {
          console.error(`Error upserting record for ${tableName}:`, error)
        }
      }

      console.log(`Successfully synced ${transformedData.length} records for ${tableName}`)
    }

    await legacyClient.end()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Sync completed for ${tableName}`,
        records_synced: changedRecords.rows.length,
        last_sync: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Sync error:', error)
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

async function createSSLConnection(config: DatabaseConfig): Promise<Client> {
  console.log('Creating SSL connection with certificate bypass...')
  
  const sslConfig = {
    hostname: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.database,
    tls: {
      enabled: true,
      enforce: true,
      rejectUnauthorized: false,
      checkServerIdentity: () => undefined
    }
  }
  
  const client = new Client(sslConfig)
  await client.connect()
  console.log('✅ Connected successfully using SSL with certificate bypass')
  return client
}
