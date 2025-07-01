
const express = require('express');
const app = express();

// Railway requires binding to 0.0.0.0 and the PORT environment variable
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

console.log('🚀 Starting PCRM Proxy Service v3.0...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', PORT);
console.log('Host:', HOST);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic CORS - Railway needs this
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Railway health check endpoint - CRITICAL
app.get('/', (req, res) => {
  console.log('🏥 Root health check accessed');
  res.status(200).json({
    status: 'healthy',
    service: 'PCRM Proxy Service',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    railway: true
  });
});

// Additional health endpoint
app.get('/health', (req, res) => {
  console.log('🏥 Health endpoint accessed');
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint
app.get('/debug', (req, res) => {
  console.log('🔍 Debug endpoint accessed');
  res.status(200).json({
    success: true,
    message: 'Debug endpoint working',
    headers: req.headers,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT
    },
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for proxy functionality
app.post('/test-connection', (req, res) => {
  console.log('🧪 Test connection endpoint accessed');
  res.status(200).json({
    success: true,
    message: 'Proxy service is working',
    received_data: req.body,
    timestamp: new Date().toISOString()
  });
});

// Catch all 404s
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    requested_route: req.originalUrl,
    available_routes: ['/', '/health', '/debug', '/test-connection']
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('💥 Server error:', error.message);
  console.error('Stack:', error.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// Start server with proper error handling
const server = app.listen(PORT, HOST, (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
  console.log(`✅ Server successfully started on ${HOST}:${PORT}`);
  console.log(`✅ Railway health check available at: http://${HOST}:${PORT}/`);
});

// Handle server startup errors
server.on('error', (err) => {
  console.error('❌ Server error on startup:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Graceful shutdown handlers
const gracefulShutdown = (signal) => {
  console.log(`📡 ${signal} received, shutting down gracefully`);
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Prevent crashes from unhandled errors
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

console.log('🚀 Proxy service initialization complete');
