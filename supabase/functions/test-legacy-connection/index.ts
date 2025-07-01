
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
    console.log('Testing legacy database connection with advanced SSL certificate bypass...')
    
    const { config } = await req.json() as { config: DatabaseConfig }
    
    console.log(`Testing connection to: ${config.host}:${config.port}/${config.database} (SSL requested: ${config.sslMode})`)
    
    const attempts: ConnectionAttempt[] = []
    let successfulClient: Client | null = null
    let finalResult: any = null

    // Strategy 1: Force SSL with complete certificate bypass using connection parameters
    if (config.sslMode) {
      try {
        console.log('Attempt 1: Force SSL with complete certificate bypass')
        
        // Use connection string approach to force SSL parameters
        const connectionString = `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?sslmode=require&sslcert=&sslkey=&sslrootcert=`
        
        const sslConfig = {
          connection: connectionString,
          tls: {
            enabled: true,
            enforce: true,
            caCertificates: [],
            // Complete certificate bypass
            checkServerIdentity: () => undefined,
            rejectUnauthorized: false
          }
        }
        
        const client = new Client(sslConfig)
        await client.connect()
        
        console.log('✅ SSL connection successful with certificate bypass')
        successfulClient = client
        attempts.push({
          method: 'Force SSL with certificate bypass',
          success: true,
          details: 'Connected with SSL but bypassed all certificate validation'
        })
        
      } catch (error) {
        console.log('❌ Force SSL attempt failed:', error.message)
        attempts.push({
          method: 'Force SSL with certificate bypass',
          success: false,
          error: error.message
        })
      }
    }

    // Strategy 2: SSL prefer mode with certificate bypass (if first attempt failed)
    if (!successfulClient && config.sslMode) {
      try {
        console.log('Attempt 2: SSL prefer mode with certificate bypass')
        
        const sslPreferConfig = {
          hostname: config.host,
          port: config.port,
          user: config.username,
          password: config.password,
          database: config.database,
          tls: {
            enabled: true,
            enforce: false,
            caCertificates: [],
            // Advanced certificate bypass
            checkServerIdentity: () => undefined,
            rejectUnauthorized: false,
            // Force acceptance of any certificate
            secureContext: {
              rejectUnauthorized: false,
              checkServerIdentity: false
            }
          }
        }
        
        const client = new Client(sslPreferConfig)
        await client.connect()
        
        console.log('✅ SSL prefer connection successful')
        successfulClient = client
        attempts.push({
          method: 'SSL prefer with certificate bypass',
          success: true,
          details: 'Connected with SSL prefer mode and certificate bypass'
        })
        
      } catch (error) {
        console.log('❌ SSL prefer attempt failed:', error.message)
        attempts.push({
          method: 'SSL prefer with certificate bypass',
          success: false,
          error: error.message
        })
      }
    }

    // Strategy 3: Direct TLS socket approach (most aggressive bypass)
    if (!successfulClient && config.sslMode) {
      try {
        console.log('Attempt 3: Direct TLS with aggressive certificate bypass')
        
        const aggressiveConfig = {
          hostname: config.host,
          port: config.port,
          user: config.username,
          password: config.password,
          database: config.database,
          tls: {
            enabled: true,
            enforce: true,
            // Most aggressive certificate bypass
            caCertificates: [],
            cert: '',
            key: '',
            // Override all validation
            servername: '',
            checkServerIdentity: () => undefined,
            rejectUnauthorized: false,
            requestCert: false,
            agent: false
          }
        }
        
        const client = new Client(aggressiveConfig)
        await client.connect()
        
        console.log('✅ Aggressive SSL bypass successful')
        successfulClient = client
        attempts.push({
          method: 'Aggressive SSL bypass',
          success: true,
          details: 'Connected with aggressive SSL certificate bypass'
        })
        
      } catch (error) {
        console.log('❌ Aggressive SSL bypass failed:', error.message)
        attempts.push({
          method: 'Aggressive SSL bypass',
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
        message: 'Connection successful with advanced SSL bypass',
        database_version: result.rows[0]?.version,
        table_count: tableCount,
        connection_attempts: attempts,
        successful_method: attempts.find(a => a.success)?.method,
        ssl_recommendations: generateAdvancedSSLRecommendations(attempts, config.sslMode)
      }
    } else {
      finalResult = {
        success: false,
        error: 'All advanced SSL bypass attempts failed',
        connection_attempts: attempts,
        recommendations: generateAdvancedFailureRecommendations(attempts)
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
          'RDS SSL certificate appears to be expired',
          'Consider updating RDS SSL certificate in AWS Console',
          'Temporarily modify pg_hba.conf to allow non-SSL connections',
          'Check network connectivity and firewall rules'
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

function generateAdvancedSSLRecommendations(attempts: ConnectionAttempt[], sslRequested: boolean): string[] {
  const recommendations: string[] = []
  
  const sslSuccess = attempts.find(a => a.success && a.method.includes('SSL'))
  
  if (sslSuccess) {
    recommendations.push('✅ SSL connection established with certificate bypass')
    recommendations.push('⚠️ Certificate validation was completely disabled')
    recommendations.push('🔧 For production: Update RDS SSL certificate to restore proper validation')
    recommendations.push('📋 Connection is encrypted but not authenticated due to certificate bypass')
  }
  
  if (!sslSuccess && sslRequested) {
    recommendations.push('❌ All SSL bypass attempts failed')
    recommendations.push('🔐 RDS SSL certificate appears to be expired and cannot be bypassed')
    recommendations.push('🛠️ Consider updating RDS SSL certificate in AWS RDS Console')
    recommendations.push('📝 Temporarily modify pg_hba.conf to allow non-SSL connections')
  }
  
  return recommendations
}

function generateAdvancedFailureRecommendations(attempts: ConnectionAttempt[]): string[] {
  const recommendations: string[] = []
  
  const hasSSLErrors = attempts.some(a => a.error?.includes('certificate') || a.error?.includes('SSL') || a.error?.includes('TLS'))
  const hasPgHbaErrors = attempts.some(a => a.error?.includes('pg_hba.conf') || a.error?.includes('no entry'))
  
  if (hasSSLErrors && hasPgHbaErrors) {
    recommendations.push('🔥 Critical Issue: SSL certificate expired AND pg_hba.conf blocks non-SSL')
    recommendations.push('🎯 Solution 1: Update RDS SSL certificate in AWS Console')
    recommendations.push('🎯 Solution 2: Temporarily modify pg_hba.conf to allow non-SSL connections')
    recommendations.push('⚡ Quick fix: Add "host all all 0.0.0.0/0 md5" to pg_hba.conf')
  }
  
  if (hasSSLErrors) {
    recommendations.push('🔐 SSL certificate is expired or invalid')
    recommendations.push('📋 In AWS RDS: Modify → Certificate Authority → rds-ca-2019 → Apply immediately')
  }
  
  if (hasPgHbaErrors) {
    recommendations.push('🔧 pg_hba.conf only allows SSL connections')
    recommendations.push('📝 Add non-SSL entry temporarily: host all all 0.0.0.0/0 md5')
  }
  
  recommendations.push('🌐 Verify network connectivity from Supabase Edge Functions')
  
  return recommendations
}
