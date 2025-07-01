
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
    console.log('Testing legacy database connection with forced SSL and certificate bypass...')
    
    const { config } = await req.json() as { config: DatabaseConfig }
    
    console.log(`Testing connection to: ${config.host}:${config.port}/${config.database}`)
    
    // Single connection strategy: Force SSL but bypass certificate validation
    try {
      console.log('Attempting SSL connection with certificate validation bypass')
      
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
      
      console.log('✅ SSL connection successful with certificate bypass')
      
      // Test a simple query
      const result = await client.queryObject('SELECT version() as version')
      console.log('Database version:', result.rows[0])
      
      // Get table count
      const tableResult = await client.queryObject(`
        SELECT COUNT(*) as table_count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      `)
      
      const tableCount = Number(tableResult.rows[0]?.table_count || 0)
      console.log(`Found ${tableCount} tables`)
      
      await client.end()

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Connection successful with SSL certificate bypass',
          database_version: result.rows[0]?.version,
          table_count: tableCount,
          connection_method: 'SSL with certificate validation bypass',
          recommendations: [
            '✅ SSL connection established successfully',
            '⚠️  Certificate validation bypassed due to expired RDS certificate',
            '🔧 Consider updating RDS SSL certificate for production use',
            '📋 Current setup allows migration to proceed safely'
          ]
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )

    } catch (error) {
      console.error('SSL connection with bypass failed:', error.message)
      
      return new Response(
        JSON.stringify({
          success: false,
          error: `SSL connection failed: ${error.message}`,
          recommendations: [
            '🔥 SSL connection required by pg_hba.conf but failed',
            '🔧 Check if RDS allows connections from Supabase Edge Function IPs',
            '📝 Verify RDS security groups allow port 5432 from Supabase',
            '🌐 Consider temporarily allowing non-SSL in pg_hba.conf for testing'
          ]
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

  } catch (error) {
    console.error('Connection test error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        recommendations: [
          'Check network connectivity from Supabase Edge Functions',
          'Verify database credentials are correct',
          'Ensure RDS security groups allow connections from Supabase',
          'Check if pg_hba.conf requires SSL connections'
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
