
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

interface ConnectionAttempt {
  method: string;
  success: boolean;
  error?: string;
  details?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Testing legacy database connection with non-SSL priority...')
    
    const { config } = await req.json() as { config: DatabaseConfig }
    
    console.log(`Testing connection to: ${config.host}:${config.port}/${config.database}`)
    
    const attempts: ConnectionAttempt[] = []
    let successfulClient: Client | null = null
    let finalResult: any = null

    // Strategy 1: Try non-SSL connection first (most likely to work with RDS pg_hba.conf)
    try {
      console.log('Attempt 1: Non-SSL connection')
      
      const nonSslConfig = {
        hostname: config.host,
        port: config.port,
        user: config.username,
        password: config.password,
        database: config.database,
        tls: {
          enabled: false
        }
      }
      
      const client = new Client(nonSslConfig)
      await client.connect()
      
      console.log('✅ Non-SSL connection successful')
      successfulClient = client
      attempts.push({
        method: 'Non-SSL connection',
        success: true,
        details: 'Connected without SSL encryption'
      })
      
    } catch (error) {
      console.log('❌ Non-SSL attempt failed:', error.message)
      attempts.push({
        method: 'Non-SSL connection',
        success: false,
        error: error.message
      })
    }

    // Strategy 2: Try connection string approach without SSL
    if (!successfulClient) {
      try {
        console.log('Attempt 2: Connection string without SSL')
        
        const connectionString = `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?sslmode=disable`
        
        const client = new Client(connectionString)
        await client.connect()
        
        console.log('✅ Connection string without SSL successful')
        successfulClient = client
        attempts.push({
          method: 'Connection string without SSL',
          success: true,
          details: 'Connected using connection string with SSL disabled'
        })
        
      } catch (error) {
        console.log('❌ Connection string without SSL failed:', error.message)
        attempts.push({
          method: 'Connection string without SSL',
          success: false,
          error: error.message
        })
      }
    }

    // Strategy 3: Try minimal SSL with prefer mode (fallback to non-SSL)
    if (!successfulClient) {
      try {
        console.log('Attempt 3: SSL prefer mode (auto-fallback to non-SSL)')
        
        const sslPreferConfig = {
          hostname: config.host,
          port: config.port,
          user: config.username,
          password: config.password,
          database: config.database,
          tls: {
            enabled: true,
            enforce: false
          }
        }
        
        const client = new Client(sslPreferConfig)
        await client.connect()
        
        console.log('✅ SSL prefer connection successful')
        successfulClient = client
        attempts.push({
          method: 'SSL prefer mode',
          success: true,
          details: 'Connected with SSL prefer mode (may have fallen back to non-SSL)'
        })
        
      } catch (error) {
        console.log('❌ SSL prefer attempt failed:', error.message)
        attempts.push({
          method: 'SSL prefer mode',
          success: false,
          error: error.message
        })
      }
    }

    // Strategy 4: Basic connection without any TLS config
    if (!successfulClient) {
      try {
        console.log('Attempt 4: Basic connection without TLS config')
        
        const basicConfig = {
          hostname: config.host,
          port: config.port,
          user: config.username,
          password: config.password,
          database: config.database
        }
        
        const client = new Client(basicConfig)
        await client.connect()
        
        console.log('✅ Basic connection successful')
        successfulClient = client
        attempts.push({
          method: 'Basic connection',
          success: true,
          details: 'Connected with minimal configuration'
        })
        
      } catch (error) {
        console.log('❌ Basic connection failed:', error.message)
        attempts.push({
          method: 'Basic connection',
          success: false,
          error: error.message
        })
      }
    }

    if (successfulClient) {
      // Test a simple query
      const result = await successfulClient.queryObject('SELECT version() as version')
      console.log('Database version:', result.rows[0])
      
      // Get table count
      const tableResult = await successfulClient.queryObject(`
        SELECT COUNT(*) as table_count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      `)
      
      const tableCount = Number(tableResult.rows[0]?.table_count || 0)
      console.log(`Found ${tableCount} tables`)
      
      await successfulClient.end()

      finalResult = {
        success: true,
        message: 'Connection successful',
        database_version: result.rows[0]?.version,
        table_count: tableCount,
        connection_attempts: attempts,
        successful_method: attempts.find(a => a.success)?.method,
        recommendations: generateSuccessRecommendations(attempts)
      }
    } else {
      finalResult = {
        success: false,
        error: 'All connection attempts failed',
        connection_attempts: attempts,
        recommendations: generateFailureRecommendations(attempts)
      }
    }

    return new Response(
      JSON.stringify(finalResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: finalResult.success ? 200 : 500
      }
    )

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
          'Consider temporarily allowing non-SSL connections in RDS'
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

function generateSuccessRecommendations(attempts: ConnectionAttempt[]): string[] {
  const recommendations: string[] = []
  
  const successfulAttempt = attempts.find(a => a.success)
  
  if (successfulAttempt?.method === 'Non-SSL connection') {
    recommendations.push('✅ Non-SSL connection works - your RDS allows unencrypted connections')
    recommendations.push('🔧 For production: Consider updating RDS SSL certificate and requiring SSL')
    recommendations.push('📋 Current setup allows migration to proceed without SSL issues')
  } else if (successfulAttempt?.method.includes('SSL')) {
    recommendations.push('✅ SSL connection established')
    recommendations.push('🔐 SSL encryption is working properly')
  }
  
  return recommendations
}

function generateFailureRecommendations(attempts: ConnectionAttempt[]): string[] {
  const recommendations: string[] = []
  
  const hasSSLErrors = attempts.some(a => a.error?.includes('certificate') || a.error?.includes('SSL') || a.error?.includes('TLS'))
  const hasPgHbaErrors = attempts.some(a => a.error?.includes('pg_hba.conf') || a.error?.includes('no entry'))
  
  if (hasSSLErrors && hasPgHbaErrors) {
    recommendations.push('🔥 Critical: RDS requires SSL but certificate is invalid')
    recommendations.push('🎯 Solution: Update RDS SSL certificate in AWS Console')
    recommendations.push('📝 Alternative: Temporarily modify RDS to allow non-SSL connections')
  } else if (hasPgHbaErrors) {
    recommendations.push('🔧 pg_hba.conf is blocking connections')
    recommendations.push('📝 Need to modify RDS connection settings to allow your IP')
  } else if (hasSSLErrors) {
    recommendations.push('🔐 SSL certificate issues detected')
    recommendations.push('📋 Update RDS SSL certificate to resolve')
  }
  
  recommendations.push('🌐 Verify RDS security groups allow Supabase Edge Function IPs')
  recommendations.push('🔍 Check RDS publicly accessible setting if needed')
  
  return recommendations
}
