
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SyncRequest {
  connectionString: string;
  tableName: string;
  lastSyncTimestamp?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔄 Starting legacy data sync via proxy service...')
    
    // Log environment variables for debugging
    console.log('📋 Environment check:')
    console.log('- PROXY_SERVICE_URL:', Deno.env.get('PROXY_SERVICE_URL') ? 'SET' : 'NOT SET')
    console.log('- PROXY_SERVICE_URL value:', Deno.env.get('PROXY_SERVICE_URL'))

    const { connectionString, tableName, lastSyncTimestamp } = await req.json() as SyncRequest
    
    if (!connectionString || !tableName) {
      throw new Error('Connection string and table name are required')
    }

    // Get proxy service URL from environment
    const proxyServiceUrl = Deno.env.get('PROXY_SERVICE_URL')
    if (!proxyServiceUrl) {
      console.error('❌ PROXY_SERVICE_URL environment variable is not set')
      throw new Error('PROXY_SERVICE_URL environment variable is required')
    }

    console.log(`📡 Calling proxy service for sync of ${tableName}...`)

    // Ensure the URL has proper format
    const fullProxyUrl = proxyServiceUrl.endsWith('/') 
      ? `${proxyServiceUrl}sync-data` 
      : `${proxyServiceUrl}/sync-data`

    // Call the proxy service for sync
    const proxyResponse = await fetch(fullProxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connectionString,
        tableName,
        lastSyncTimestamp
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
      throw new Error(proxyData.error || 'Proxy service sync failed')
    }

    console.log(`✅ Sync completed via proxy service for ${tableName}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Sync completed for ${tableName} via proxy service`,
        records_synced: proxyData.records_synced || 0,
        last_sync: proxyData.last_sync,
        proxy_used: true
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('🚨 Sync error:', error)
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
