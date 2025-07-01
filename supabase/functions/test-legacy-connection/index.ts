
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
    
    const { connectionString } = await req.json() as { connectionString: string }
    
    if (!connectionString) {
      throw new Error('Connection string is required')
    }

    console.log('🔗 Using connection string (masked):', connectionString.replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1***$2'))
    
    // Get proxy service URL from environment
    const proxyServiceUrl = Deno.env.get('PROXY_SERVICE_URL')
    if (!proxyServiceUrl) {
      throw new Error('PROXY_SERVICE_URL environment variable is required')
    }

    console.log('📡 Calling proxy service at:', proxyServiceUrl)

    // Call the proxy service
    const proxyResponse = await fetch(`${proxyServiceUrl}/test-connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ connectionString })
    })

    const proxyData = await proxyResponse.json()

    if (!proxyResponse.ok) {
      throw new Error(proxyData.error || 'Proxy service request failed')
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
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        recommendations: [
          'Ensure the proxy service is deployed and running',
          'Verify PROXY_SERVICE_URL environment variable is set',
          'Check that the connection string format is correct',
          'Verify network connectivity between services'
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
