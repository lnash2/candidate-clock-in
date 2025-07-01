
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    
    // Log environment variables for debugging
    console.log('📋 Environment check:')
    console.log('- PROXY_SERVICE_URL:', Deno.env.get('PROXY_SERVICE_URL') ? 'SET' : 'NOT SET')
    console.log('- PROXY_SERVICE_URL value:', Deno.env.get('PROXY_SERVICE_URL'))

    const { connectionString, tables, batchSize } = await req.json() as MigrationConfig
    
    if (!connectionString) {
      throw new Error('Connection string is required')
    }

    // Get proxy service URL from environment
    const proxyServiceUrl = Deno.env.get('PROXY_SERVICE_URL')
    if (!proxyServiceUrl) {
      console.error('❌ PROXY_SERVICE_URL environment variable is not set')
      throw new Error('PROXY_SERVICE_URL environment variable is required')
    }

    console.log('📡 Calling proxy service for migration...')

    // Ensure the URL has proper format
    const fullProxyUrl = proxyServiceUrl.endsWith('/') 
      ? `${proxyServiceUrl}migrate-data` 
      : `${proxyServiceUrl}/migrate-data`

    // Call the proxy service for migration
    const proxyResponse = await fetch(fullProxyUrl, {
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

    let proxyData
    try {
      const responseText = await proxyResponse.text()
      console.log('📥 Raw proxy response:', responseText)
      proxyData = JSON.parse(responseText)
    } catch (parseError) {
      console.error('❌ Failed to parse proxy response:', parseError)
      throw new Error('Invalid response from proxy service')
    }

    if (!proxyResponse.ok) {
      console.error('❌ Proxy service returned error:', proxyData)
      throw new Error(proxyData.error || 'Proxy service migration failed')
    }

    console.log('✅ Migration analysis completed via proxy service')

    // Prepare results for response
    const results = []
    
    if (proxyData.results && Array.isArray(proxyData.results)) {
      for (const tableResult of proxyData.results) {
        results.push({
          table: tableResult.table,
          status: tableResult.status,
          records_analyzed: tableResult.total_records || 0,
          proxy_response: true
        })

        console.log(`✅ Processed ${tableResult.table}: ${tableResult.status}`)
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
    console.error('🚨 Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        error_details: error.stack,
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
