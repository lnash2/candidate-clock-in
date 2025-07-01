
// Simple test function with zero Supabase dependencies
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle requests
async function handleRequest(req: Request): Promise<Response> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔍 Starting simple legacy connection test...')
    
    // Parse request body
    const requestData = await req.json()
    const { connectionString } = requestData
    
    if (!connectionString) {
      console.error('❌ No connection string provided')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Connection string is required' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Log masked connection string
    const maskedConnectionString = connectionString.replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1***$2')
    console.log('🔗 Testing connection string:', maskedConnectionString)
    
    // Get proxy service URL
    const proxyServiceUrl = Deno.env.get('PROXY_SERVICE_URL')
    console.log('📋 PROXY_SERVICE_URL:', proxyServiceUrl || 'NOT SET')
    
    if (!proxyServiceUrl) {
      console.error('❌ PROXY_SERVICE_URL environment variable not set')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'PROXY_SERVICE_URL environment variable is required' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // Build proxy URL
    const testUrl = `${proxyServiceUrl}/test-connection`
    console.log('📡 Calling proxy at:', testUrl)

    // Make request to proxy service
    const proxyResponse = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ connectionString })
    })

    console.log('📥 Proxy response status:', proxyResponse.status)
    
    // Get response text
    const responseText = await proxyResponse.text()
    console.log('📥 Proxy response body:', responseText)

    // Parse response
    let proxyData
    try {
      proxyData = JSON.parse(responseText)
    } catch (parseError) {
      console.error('❌ Failed to parse proxy response:', parseError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid response from proxy service',
          raw_response: responseText
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // Handle proxy errors
    if (!proxyResponse.ok) {
      console.error('❌ Proxy service error:', proxyData)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: proxyData.error || `Proxy service returned ${proxyResponse.status}`,
          proxy_data: proxyData
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: proxyResponse.status 
        }
      )
    }

    // Success response
    console.log('✅ Connection test successful')
    return new Response(
      JSON.stringify({
        success: true,
        database_version: proxyData.database_version,
        table_count: proxyData.table_count,
        message: 'Connection successful via simple proxy test',
        proxy_used: true
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('🚨 Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred',
        error_type: error.constructor.name
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
}

// Start server
Deno.serve(handleRequest)
