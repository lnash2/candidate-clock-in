
const express = require('express');
const app = express();

// Railway environment variables
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

console.log('🚀 Railway-Optimized PCRM Proxy Service v4.0 Starting...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', PORT);
console.log('Host:', HOST);
console.log('Railway Environment:', process.env.RAILWAY_ENVIRONMENT);

// Minimal middleware - only what's absolutely necessary
app.use(express.json({ limit: '1mb' }));

// CRITICAL: Railway health check endpoint - must be FIRST and FASTEST
app.get('/', (req, res) => {
  console.log('🏥 Railway health check hit at:', new Date().toISOString());
  res.status(200).send('OK');
});

// Secondary health endpoint for debugging
app.get('/health', (req, res) => {
  console.log('🩺 Health endpoint accessed');
  res.status(200).json({
    status: 'healthy',
    service: 'PCRM Proxy',
    version: '4.0.0',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint
app.get('/debug', (req, res) => {
  console.log('🔍 Debug endpoint accessed');
  res.status(200).json({
    success: true,
    message: 'Railway deployment working',
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT
    },
    server: {
      host: HOST,
      port: PORT,
      uptime: process.uptime()
    },
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.post('/test-connection', (req, res) => {
  console.log('🧪 Test connection accessed');
  res.status(200).json({
    success: true,
    message: 'Railway proxy service operational',
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

// Minimal error handling
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.message);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// Start server with Railway-optimized configuration
const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Railway server LIVE on ${HOST}:${PORT}`);
  console.log(`✅ Health check: http://${HOST}:${PORT}/`);
  console.log(`✅ Railway deployment successful`);
});

// Railway-specific error handling
server.on('error', (err) => {
  console.error('❌ Railway server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} already in use`);
  }
  process.exit(1);
});

// Graceful shutdown for Railway
process.on('SIGTERM', () => {
  console.log('📡 SIGTERM received - Railway shutdown');
  server.close(() => {
    console.log('✅ Server closed for Railway');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📡 SIGINT received - Manual shutdown');
  server.close(() => {
    console.log('✅ Server closed manually');
    process.exit(0);
  });
});

console.log('🚀 Railway-optimized proxy service ready');
