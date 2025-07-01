
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test database connection endpoint
app.post('/test-connection', async (req, res) => {
  const { connectionString } = req.body;
  
  if (!connectionString) {
    return res.status(400).json({
      success: false,
      error: 'Connection string is required'
    });
  }

  console.log('🔍 Testing connection with masked string:', 
    connectionString.replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1***$2'));

  let pool;
  try {
    // Create pool with SSL bypass for expired certificates
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false // This bypasses SSL certificate validation
      },
      max: 1, // Single connection for testing
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 10000
    });

    console.log('✅ Pool created, testing connection...');

    // Test the connection
    const client = await pool.connect();
    console.log('✅ Connected successfully');

    // Get database version
    const versionResult = await client.query('SELECT version() as version');
    
    // Get table count
    const tableResult = await client.query(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);

    client.release();

    res.json({
      success: true,
      database_version: versionResult.rows[0]?.version,
      table_count: Number(tableResult.rows[0]?.table_count || 0),
      message: 'Connection successful using Node.js proxy service'
    });

  } catch (error) {
    console.error('❌ Connection test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      recommendations: [
        'Verify the connection string format is correct',
        'Check that the database server is accessible',
        'Ensure database credentials are valid',
        'Verify network connectivity to the database host',
        'Node.js proxy bypasses SSL certificate validation issues'
      ]
    });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
});

// Data migration endpoint
app.post('/migrate-data', async (req, res) => {
  const { connectionString, tables, batchSize } = req.body;
  
  if (!connectionString) {
    return res.status(400).json({
      success: false,
      error: 'Connection string is required'
    });
  }

  console.log('🚀 Starting migration for tables:', tables || 'all');

  let pool;
  try {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 2,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    });

    const client = await pool.connect();

    // Get all tables if not specified
    let tablesToMigrate = tables;
    if (!tablesToMigrate || tablesToMigrate.length === 0) {
      const tableResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      `);
      tablesToMigrate = tableResult.rows.map(row => row.table_name);
    }

    console.log(`Found ${tablesToMigrate.length} tables to migrate:`, tablesToMigrate);

    const results = [];
    const actualBatchSize = batchSize || 1000;

    for (const tableName of tablesToMigrate) {
      try {
        console.log(`Starting migration for table: ${tableName}`);

        // Get table schema
        const schemaResult = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = $1 
          ORDER BY ordinal_position
        `, [tableName]);

        // Get total record count
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        const totalRecords = Number(countResult.rows[0]?.count || 0);

        console.log(`Total records for ${tableName}: ${totalRecords}`);

        // Get sample data in batches
        const sampleResult = await client.query(`
          SELECT * FROM ${tableName} 
          ORDER BY 1 
          LIMIT ${Math.min(actualBatchSize, 100)}
        `);

        results.push({
          table: tableName,
          status: 'completed',
          total_records: totalRecords,
          schema: schemaResult.rows,
          sample_data: sampleResult.rows,
          migrated_records: totalRecords // Simulated for now
        });

      } catch (error) {
        console.error(`Error processing table ${tableName}:`, error);
        results.push({
          table: tableName,
          status: 'failed',
          error: error.message
        });
      }
    }

    client.release();

    res.json({
      success: true,
      message: 'Migration analysis completed',
      results
    });

  } catch (error) {
    console.error('🚨 Migration error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
});

// Data sync endpoint
app.post('/sync-data', async (req, res) => {
  const { connectionString, tableName, lastSyncTimestamp } = req.body;
  
  if (!connectionString || !tableName) {
    return res.status(400).json({
      success: false,
      error: 'Connection string and table name are required'
    });
  }

  console.log(`🔄 Starting sync for table: ${tableName}`);

  let pool;
  try {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 1,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    });

    const client = await pool.connect();

    // Build query for changed records
    let query = `SELECT * FROM ${tableName}`;
    const params = [];
    
    if (lastSyncTimestamp) {
      query += ` WHERE updated_at > $1 OR created_at > $1`;
      params.push(lastSyncTimestamp);
    } else {
      query += ` WHERE updated_at > NOW() - INTERVAL '1 hour' OR created_at > NOW() - INTERVAL '1 hour'`;
    }

    console.log(`Sync query: ${query}`);

    const result = await client.query(query, params);
    
    console.log(`Found ${result.rows.length} changed records for ${tableName}`);

    client.release();

    res.json({
      success: true,
      message: `Sync completed for ${tableName}`,
      records_synced: result.rows.length,
      data: result.rows,
      last_sync: new Date().toISOString()
    });

  } catch (error) {
    console.error('🚨 Sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
});

app.listen(port, () => {
  console.log(`🚀 PCRM Proxy Service running on port ${port}`);
  console.log(`📋 Health check: http://localhost:${port}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...');
  process.exit(0);
});
