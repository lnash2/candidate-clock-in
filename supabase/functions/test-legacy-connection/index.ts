
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔍 Testing legacy database connection with multiple SSL bypass strategies...')
    
    const { config } = await req.json() as { config: DatabaseConfig }
    
    console.log(`🎯 Target: ${config.host}:${config.port}/${config.database}`)
    
    // Strategy 1: Connection string approach with SSL parameters
    try {
      console.log('📋 Strategy 1: Connection string with SSL parameters')
      
      const connectionString = `postgresql://${config.username}:${encodeURIComponent(config.password)}@${config.host}:${config.port}/${config.database}?sslmode=require&sslcert=/dev/null&sslkey=/dev/null&sslrootcert=/dev/null`
      
      console.log('🔗 Connection string (masked):', connectionString.replace(config.password, '***'))
      
      const client1 = new Client(connectionString)
      await client1.connect()
      
      console.log('✅ Strategy 1 SUCCESS!')
      
      const result = await client1.queryObject('SELECT version() as version')
      const tableResult = await client1.queryObject(`
        SELECT COUNT(*) as table_count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      `)
      
      await client1.end()
      
      return new Response(
        JSON.stringify({
          success: true,
          strategy: 'Connection string with SSL parameters',
          database_version: result.rows[0]?.version,
          table_count: Number(tableResult.rows[0]?.table_count || 0),
          recommendations: [
            '✅ Connection string approach worked',
            '🔧 SSL certificate validation bypassed successfully',
            '📋 Ready for migration'
          ]
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
      
    } catch (error1) {
      console.error('❌ Strategy 1 failed:', error1.message)
      console.error('📝 Error details:', error1)
      
      // Strategy 2: Config object with enhanced TLS options
      try {
        console.log('📋 Strategy 2: Enhanced TLS configuration object')
        
        const client2 = new Client({
          hostname: config.host,
          port: config.port,
          user: config.username,
          password: config.password,
          database: config.database,
          tls: {
            enabled: true,
            enforce: true,
            rejectUnauthorized: false,
            checkServerIdentity: () => undefined,
            ciphers: 'ALL',
            secureProtocol: 'TLSv1_2_method'
          }
        })
        
        await client2.connect()
        
        console.log('✅ Strategy 2 SUCCESS!')
        
        const result = await client2.queryObject('SELECT version() as version')
        const tableResult = await client2.queryObject(`
          SELECT COUNT(*) as table_count 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
        `)
        
        await client2.end()
        
        return new Response(
          JSON.stringify({
            success: true,
            strategy: 'Enhanced TLS configuration',
            database_version: result.rows[0]?.version,
            table_count: Number(tableResult.rows[0]?.table_count || 0),
            recommendations: [
              '✅ Enhanced TLS configuration worked',
              '🔧 SSL certificate validation bypassed with TLS options',
              '📋 Ready for migration'
            ]
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        )
        
      } catch (error2) {
        console.error('❌ Strategy 2 failed:', error2.message)
        console.error('📝 Error details:', error2)
        
        // Strategy 3: Alternative client version approach
        try {
          console.log('📋 Strategy 3: Basic SSL with minimal validation')
          
          const client3 = new Client({
            hostname: config.host,
            port: config.port,
            user: config.username,
            password: config.password,
            database: config.database,
            tls: true // Simple boolean approach
          })
          
          await client3.connect()
          
          console.log('✅ Strategy 3 SUCCESS!')
          
          const result = await client3.queryObject('SELECT version() as version')
          const tableResult = await client3.queryObject(`
            SELECT COUNT(*) as table_count 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
          `)
          
          await client3.end()
          
          return new Response(
            JSON.stringify({
              success: true,
              strategy: 'Basic SSL boolean approach',
              database_version: result.rows[0]?.version,
              table_count: Number(tableResult.rows[0]?.table_count || 0),
              recommendations: [
                '✅ Basic SSL approach worked',
                '🔧 Simple TLS configuration succeeded',
                '📋 Ready for migration'
              ]
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          )
          
        } catch (error3) {
          console.error('❌ Strategy 3 failed:', error3.message)
          console.error('📝 Error details:', error3)
          
          return new Response(
            JSON.stringify({
              success: false,
              error: 'All SSL bypass strategies failed',
              strategy_1_error: error1.message,
              strategy_2_error: error2.message,
              strategy_3_error: error3.message,
              recommendations: [
                '🔥 All SSL bypass methods failed',
                '🔧 This suggests a deeper SSL/TLS configuration issue',
                '📝 Consider updating RDS SSL certificate',
                '🌐 Check if RDS allows connections from Supabase Edge Function IPs',
                '⚙️ Verify pg_hba.conf configuration on RDS'
              ]
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500
            }
          )
        }
      }
    }

  } catch (error) {
    console.error('🚨 Connection test error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        recommendations: [
          'Check network connectivity from Supabase Edge Functions',
          'Verify database credentials are correct',
          'Ensure RDS security groups allow connections from Supabase',
          'Consider RDS SSL certificate renewal'
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
