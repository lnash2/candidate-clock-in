
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Testing legacy database connection...')
    
    const { config } = await req.json() as { config: DatabaseConfig }
    
    // Build connection configuration
    const connectionConfig = {
      hostname: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
      tls: config.sslMode ? {
        enabled: true,
        enforce: false,
        caCertificates: []
      } : undefined
    }
    
    console.log(`Testing connection to: ${config.host}:${config.port}/${config.database} (SSL: ${config.sslMode})`)
    
    // Connect to legacy database
    const legacyClient = new Client(connectionConfig)
    await legacyClient.connect()
    
    console.log('Connection successful!')
    
    // Test a simple query
    const result = await legacyClient.queryObject('SELECT version() as version')
    console.log('Database version:', result.rows[0])
    
    // Get table count
    const tableResult = await legacyClient.queryObject(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `)
    
    const tableCount = Number(tableResult.rows[0]?.table_count || 0)
    console.log(`Found ${tableCount} tables`)
    
    await legacyClient.end()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Connection successful',
        database_version: result.rows[0]?.version,
        table_count: tableCount
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Connection test error:', error)
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
