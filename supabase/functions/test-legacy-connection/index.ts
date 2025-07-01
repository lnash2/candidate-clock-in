
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔍 Testing legacy database connection with connection string...')
    
    const { connectionString } = await req.json() as { connectionString: string }
    
    if (!connectionString) {
      throw new Error('Connection string is required')
    }

    console.log('🔗 Using connection string (masked):', connectionString.replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1***$2'))
    
    const client = new Client(connectionString)
    await client.connect()
    
    console.log('✅ Connection successful!')
    
    const result = await client.queryObject('SELECT version() as version')
    const tableResult = await client.queryObject(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `)
    
    await client.end()
    
    return new Response(
      JSON.stringify({
        success: true,
        database_version: result.rows[0]?.version,
        table_count: Number(tableResult.rows[0]?.table_count || 0),
        message: 'Connection successful using provided connection string'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('🚨 Connection test error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        recommendations: [
          'Verify the connection string format is correct',
          'Check that SSL parameters are properly set if using SSL bypass',
          'Ensure database credentials are valid',
          'Verify network connectivity to the database host'
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
