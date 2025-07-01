
const express = require('express');
const router = express.Router();

// Simple debug endpoint that doesn't require database
router.get('/', (req, res) => {
  const requestInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    origin: req.headers.origin,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress,
    protocol: req.protocol,
    secure: req.secure
  };

  console.log('🔍 Debug endpoint called:', requestInfo);

  res.json({
    success: true,
    message: 'Debug endpoint working',
    cors_enabled: true,
    service: 'PCRM Proxy Service',
    ...requestInfo
  });
});

// POST endpoint for testing form submissions
router.post('/', (req, res) => {
  console.log('📤 Debug POST endpoint called');
  console.log('📋 Request body:', req.body);
  
  res.json({
    success: true,
    message: 'Debug POST endpoint working',
    received_data: req.body,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
