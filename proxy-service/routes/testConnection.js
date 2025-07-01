
const express = require('express');
const { createTestPool } = require('../services/database');
const router = express.Router();

router.post('/', async (req, res) => {
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
    pool = createTestPool(connectionString);
    console.log('✅ Pool created, testing connection...');

    const client = await pool.connect();
    console.log('✅ Connected successfully');

    const versionResult = await client.query('SELECT version() as version');
    
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

module.exports = router;
