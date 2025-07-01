
const express = require('express');
const { createPool } = require('../services/database');
const router = express.Router();

router.post('/', async (req, res) => {
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

module.exports = router;
