
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { connectionString, tableName, lastSyncTimestamp } = await req.json() as SyncRequest
    
    if (!connectionString || !tableName) {
      throw new Error('Connection string and table name are required')
    }

    // Get proxy service URL from environment
    const proxyServiceUrl = Deno.env.get('PROXY_SERVICE_URL')
    if (!proxyServiceUrl) {
      throw new Error('PROXY_SERVICE_URL environment variable is required')
    }

    console.log(`📡 Calling proxy service for sync of ${tableName}...`)

    // Call the proxy service for sync
    const proxyResponse = await fetch(`${proxyServiceUrl}/sync-data`, {
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

    const proxyData = await proxyResponse.json()

    if (!proxyResponse.ok) {
      throw new Error(proxyData.error || 'Proxy service sync failed')
    }

    console.log(`✅ Sync completed via proxy service for ${tableName}`)

    // Process the synced data (if needed, you can add logic here to 
    // upsert the data into your Supabase tables)
    
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
