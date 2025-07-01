
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MigrationConfig {
  connectionString: string;
  tables: string[];
  batchSize: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Starting legacy data migration via proxy service...')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { connectionString, tables, batchSize } = await req.json() as MigrationConfig
    
    if (!connectionString) {
      throw new Error('Connection string is required')
    }

    // Get proxy service URL from environment
    const proxyServiceUrl = Deno.env.get('PROXY_SERVICE_URL')
    if (!proxyServiceUrl) {
      throw new Error('PROXY_SERVICE_URL environment variable is required')
    }

    console.log('📡 Calling proxy service for migration...')

    // Call the proxy service for migration
    const proxyResponse = await fetch(`${proxyServiceUrl}/migrate-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connectionString,
        tables: tables || [],
        batchSize: batchSize || 1000
      })
    })

    const proxyData = await proxyResponse.json()

    if (!proxyResponse.ok) {
      throw new Error(proxyData.error || 'Proxy service migration failed')
    }

    console.log('✅ Migration analysis completed via proxy service')

    // Update migration status in Supabase based on proxy results
    const results = []
    
    if (proxyData.results && Array.isArray(proxyData.results)) {
      for (const tableResult of proxyData.results) {
        try {
          // Update migration status
          await supabaseClient
            .from('migration_status')
            .upsert({
              table_name: tableResult.table,
              status: tableResult.status,
              total_records: tableResult.total_records || 0,
              migrated_records: tableResult.migrated_records || 0,
              started_at: new Date().toISOString(),
              completed_at: tableResult.status === 'completed' ? new Date().toISOString() : null,
              error_message: tableResult.error || null
            })

          results.push({
            table: tableResult.table,
            status: tableResult.status,
            records_analyzed: tableResult.total_records || 0,
            proxy_response: true
          })

          console.log(`Updated status for ${tableResult.table}: ${tableResult.status}`)

        } catch (error) {
          console.error(`Error updating status for ${tableResult.table}:`, error)
          results.push({
            table: tableResult.table,
            status: 'failed',
            error: error.message
          })
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Migration analysis completed via proxy service',
        results,
        proxy_used: true
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('🚨 Migration error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        recommendations: [
          'Ensure the proxy service is deployed and running',
          'Verify PROXY_SERVICE_URL environment variable is set',
          'Check network connectivity between services'
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
