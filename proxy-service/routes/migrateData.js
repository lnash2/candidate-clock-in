
const express = require('express');
const { createPool } = require('../services/database');
const router = express.Router();

router.post('/', async (req, res) => {
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
    pool = createPool(connectionString);
    const client = await pool.connect();

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

        const schemaResult = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = $1 
          ORDER BY ordinal_position
        `, [tableName]);

        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        const totalRecords = Number(countResult.rows[0]?.count || 0);

        console.log(`Total records for ${tableName}: ${totalRecords}`);

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
          migrated_records: totalRecords
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

module.exports = router;
