
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
    console.log('Testing legacy database connection with enhanced SSL handling...')
    
    const { config } = await req.json() as { config: DatabaseConfig }
    
    console.log(`Testing connection to: ${config.host}:${config.port}/${config.database} (SSL requested: ${config.sslMode})`)
    
    const attempts: ConnectionAttempt[] = []
    let successfulClient: Client | null = null
    let finalResult: any = null

    // Connection strategy 1: SSL with certificate validation disabled
    if (config.sslMode) {
      try {
        console.log('Attempt 1: SSL with certificate validation disabled')
        const sslConfig = {
          hostname: config.host,
          port: config.port,
          user: config.username,
          password: config.password,
          database: config.database,
          tls: {
            enabled: true,
            enforce: false,
            caCertificates: [],
            // Disable certificate validation to handle expired certificates
            checkServerIdentity: false
          }
        }
        
        const client = new Client(sslConfig)
        await client.connect()
        
        console.log('SSL connection successful (validation disabled)')
        successfulClient = client
        attempts.push({
          method: 'SSL with validation disabled',
          success: true,
          details: 'Connected with SSL but certificate validation was bypassed'
        })
        
      } catch (error) {
        console.log('SSL attempt 1 failed:', error.message)
        attempts.push({
          method: 'SSL with validation disabled',
          success: false,
          error: error.message
        })
      }
    }

    // Connection strategy 2: SSL required mode (if first attempt failed)
    if (!successfulClient && config.sslMode) {
      try {
        console.log('Attempt 2: SSL required mode')
        const sslRequiredConfig = {
          hostname: config.host,
          port: config.port,
          user: config.username,
          password: config.password,
          database: config.database,
          tls: {
            enabled: true,
            enforce: true,
            caCertificates: []
          }
        }
        
        const client = new Client(sslRequiredConfig)
        await client.connect()
        
        console.log('SSL required connection successful')
        successfulClient = client
        attempts.push({
          method: 'SSL required',
          success: true,
          details: 'Connected with SSL enforcement'
        })
        
      } catch (error) {
        console.log('SSL attempt 2 failed:', error.message)
        attempts.push({
          method: 'SSL required',
          success: false,
          error: error.message
        })
      }
    }

    // Connection strategy 3: No SSL (fallback)
    if (!successfulClient) {
      try {
        console.log('Attempt 3: No SSL (fallback)')
        const noSslConfig = {
          hostname: config.host,
          port: config.port,
          user: config.username,
          password: config.password,
          database: config.database,
          tls: undefined
        }
        
        const client = new Client(noSslConfig)
        await client.connect()
        
        console.log('Non-SSL connection successful')
        successfulClient = client
        attempts.push({
          method: 'No SSL',
          success: true,
          details: 'Connected without SSL encryption'
        })
        
      } catch (error) {
        console.log('Non-SSL attempt failed:', error.message)
        attempts.push({
          method: 'No SSL',
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
        ssl_recommendations: generateSSLRecommendations(attempts, config.sslMode)
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
          'Check your database host and port',
          'Verify username and password',
          'Ensure the database exists',
          'Check firewall and network connectivity'
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

function generateSSLRecommendations(attempts: ConnectionAttempt[], sslRequested: boolean): string[] {
  const recommendations: string[] = []
  
  const sslSuccess = attempts.find(a => a.success && a.method.includes('SSL'))
  const noSslSuccess = attempts.find(a => a.success && a.method === 'No SSL')
  
  if (sslSuccess && sslSuccess.method.includes('validation disabled')) {
    recommendations.push('⚠️ SSL certificate validation was bypassed - consider updating your RDS SSL certificate')
    recommendations.push('📋 Your connection is encrypted but certificate validation is disabled')
    recommendations.push('🔧 For production, update to a valid SSL certificate in AWS RDS')
  }
  
  if (noSslSuccess && sslRequested) {
    recommendations.push('⚠️ SSL was requested but fell back to unencrypted connection')
    recommendations.push('🔒 Consider fixing SSL configuration for better security')
  }
  
  if (sslSuccess && !sslSuccess.method.includes('validation disabled')) {
    recommendations.push('✅ SSL connection is working properly with certificate validation')
  }
  
  return recommendations
}

function generateFailureRecommendations(attempts: ConnectionAttempt[]): string[] {
  const recommendations: string[] = []
  
  const hasSSLErrors = attempts.some(a => a.error?.includes('certificate') || a.error?.includes('SSL') || a.error?.includes('TLS'))
  const hasPgHbaErrors = attempts.some(a => a.error?.includes('pg_hba.conf') || a.error?.includes('no entry'))
  const hasAuthErrors = attempts.some(a => a.error?.includes('authentication') || a.error?.includes('password'))
  
  if (hasPgHbaErrors) {
    recommendations.push('🔧 Update pg_hba.conf to allow connections from your IP address')
    recommendations.push('📝 Add entry: host all all 0.0.0.0/0 md5 (or more restrictive IP range)')
  }
  
  if (hasSSLErrors) {
    recommendations.push('🔐 Update your RDS SSL certificate - it appears to be expired')
    recommendations.push('📋 In AWS RDS Console: Modify instance → Certificate Authority → Apply immediately')
  }
  
  if (hasAuthErrors) {
    recommendations.push('👤 Verify database username and password are correct')
    recommendations.push('🔑 Check if the user has proper permissions')
  }
  
  recommendations.push('🌐 Verify network connectivity and firewall rules')
  recommendations.push('📍 Ensure the database host and port are correct')
  
  return recommendations
}
