
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔍 Testing legacy database connection via proxy service...')
    
    // Log all environment variables for debugging
    console.log('📋 Environment check:')
    console.log('- PROXY_SERVICE_URL:', Deno.env.get('PROXY_SERVICE_URL') ? 'SET' : 'NOT SET')
    console.log('- PROXY_SERVICE_URL value:', Deno.env.get('PROXY_SERVICE_URL'))
    
    const { connectionString } = await req.json() as { connectionString: string }
    
    if (!connectionString) {
      throw new Error('Connection string is required')
    }

    console.log('🔗 Using connection string (masked):', connectionString.replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1***$2'))
    
    // Get proxy service URL from environment
    const proxyServiceUrl = Deno.env.get('PROXY_SERVICE_URL')
    if (!proxyServiceUrl) {
      console.error('❌ PROXY_SERVICE_URL environment variable is not set')
      throw new Error('PROXY_SERVICE_URL environment variable is required')
    }

    console.log('📡 Calling proxy service at:', proxyServiceUrl)

    // Ensure the URL has proper format
    const fullProxyUrl = proxyServiceUrl.endsWith('/') 
      ? `${proxyServiceUrl}test-connection` 
      : `${proxyServiceUrl}/test-connection`
    
    console.log('🔗 Full proxy URL:', fullProxyUrl)

    // Call the proxy service using native fetch
    console.log('📤 Making request to proxy service...')
    const proxyResponse = await fetch(fullProxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ connectionString })
    })

    console.log('📥 Proxy response status:', proxyResponse.status)
    console.log('📥 Proxy response headers:', Object.fromEntries(proxyResponse.headers.entries()))

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
      throw new Error(proxyData.error || `Proxy service request failed with status ${proxyResponse.status}`)
    }

    console.log('✅ Proxy service response:', proxyData)

    return new Response(
      JSON.stringify({
        success: true,
        database_version: proxyData.database_version,
        table_count: proxyData.table_count,
        message: 'Connection successful via Node.js proxy service',
        proxy_used: true
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('🚨 Connection test error:', error)
    console.error('🚨 Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        error_details: error.stack,
        recommendations: [
          'Ensure the proxy service is deployed and running',
          'Verify PROXY_SERVICE_URL environment variable is set to: https://candidate-clock-in-production.up.railway.app',
          'Check that the connection string format is correct',
          'Verify network connectivity between Supabase Edge Functions and Railway',
          'Check proxy service logs for any errors'
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
