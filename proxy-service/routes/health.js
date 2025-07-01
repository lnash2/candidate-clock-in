
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    cors_enabled: true,
    service: 'PCRM Proxy Service'
  });
});

module.exports = router;
