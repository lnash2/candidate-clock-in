
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const healthInfo = {
    status: 'ok',
    service: 'PCRM Proxy Service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    railway_environment: process.env.RAILWAY_ENVIRONMENT || 'none',
    node_version: process.version,
    cors_enabled: true,
    endpoints: {
      root: '/',
      health: '/health',
      debug: '/debug',
      test_connection: '/test-connection',
      migrate_data: '/migrate-data',
      sync_data: '/sync-data'
    }
  };

  console.log('❤️ Health check endpoint accessed:', {
    timestamp: healthInfo.timestamp,
    uptime: healthInfo.uptime,
    memory_usage: `${Math.round(healthInfo.memory.heapUsed / 1024 / 1024)}MB`
  });

  res.json(healthInfo);
});

module.exports = router;

