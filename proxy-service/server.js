
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { corsOptions } = require('./config/cors');
const healthRoutes = require('./routes/health');
const testConnectionRoutes = require('./routes/testConnection');
const migrateDataRoutes = require('./routes/migrateData');
const syncDataRoutes = require('./routes/syncData');
const debugRoutes = require('./routes/debug');

const app = express();

// Railway-specific port handling - MUST bind to 0.0.0.0
const port = process.env.PORT || 3001;
const host = '0.0.0.0'; // Critical for Railway deployment

console.log(`\n🚀 PCRM Proxy Service v2.0 initializing...`);
console.log(`📊 Node.js version: ${process.version}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🚢 Railway deployment detected: ${process.env.RAILWAY_ENVIRONMENT ? 'Yes' : 'No'}`);
console.log(`📡 Target host: ${host}`);
console.log(`📡 Target port: ${port}`);
console.log(`⏰ Startup time: ${new Date().toISOString()}`);

// Validate critical dependencies
try {
  console.log('🔍 Validating dependencies...');
  require('express');
  require('cors');
  require('pg');
  console.log('✅ All dependencies loaded successfully');
} catch (error) {
  console.error('❌ Critical dependency missing:', error.message);
  process.exit(1);
}

// Enhanced request logging middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const timestamp = new Date().toISOString();
  
  console.log(`\n🌐 [${timestamp}] ${req.method} ${req.url}`);
  console.log(`📋 Origin: ${origin || 'no origin'}`);
  console.log(`📋 User-Agent: ${req.headers['user-agent'] || 'unknown'}`);
  console.log(`📋 Content-Type: ${req.headers['content-type'] || 'none'}`);
  
  // Log if this is a preflight request
  if (req.method === 'OPTIONS') {
    console.log('✈️ PREFLIGHT REQUEST detected');
    console.log(`📋 Access-Control-Request-Method: ${req.headers['access-control-request-method'] || 'none'}`);
    console.log(`📋 Access-Control-Request-Headers: ${req.headers['access-control-request-headers'] || 'none'}`);
  }
  
  next();
});

// Apply CORS middleware with detailed logging
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = corsOptions.origin;
  
  // Check if origin is allowed
  let isAllowed = false;
  if (typeof allowedOrigins === 'string') {
    isAllowed = allowedOrigins === origin;
  } else if (Array.isArray(allowedOrigins)) {
    isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
  }
  
  console.log(`🔒 CORS Check: Origin ${origin} ${isAllowed ? '✅ ALLOWED' : '❌ BLOCKED'}`);
  next();
});

app.use(cors(corsOptions));

// Parse JSON with increased limit
app.use(express.json({ limit: '50mb' }));

// Response logging middleware
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`📤 Response: ${res.statusCode} for ${req.method} ${req.url}`);
    if (res.statusCode >= 400) {
      console.log(`❌ Error response data:`, data);
    }
    originalSend.call(this, data);
  };
  next();
});

// Railway health check endpoint (must be first)
app.get('/', (req, res) => {
  const serverInfo = {
    status: 'healthy',
    message: 'PCRM Proxy Service v2.0 is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    cors_enabled: true,
    allowed_origins_count: corsOptions.origin.length,
    environment: process.env.NODE_ENV || 'development',
    railway_environment: process.env.RAILWAY_ENVIRONMENT || 'none',
    host: host,
    port: port,
    uptime: process.uptime(),
    available_routes: ['/health', '/debug', '/test-connection', '/migrate-data', '/sync-data']
  };
  
  console.log('🏠 Root health check accessed (v2.0):', serverInfo);
  res.json(serverInfo);
});

// Routes
app.use('/health', healthRoutes);
app.use('/debug', debugRoutes);
app.use('/test-connection', testConnectionRoutes);
app.use('/migrate-data', migrateDataRoutes);
app.use('/sync-data', syncDataRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Server error:', error);
  console.error('🚨 Stack trace:', error.stack);
  res.status(500).json({
    success: false,
    error: error.message,
    timestamp: new Date().toISOString(),
    endpoint: req.url,
    method: req.method,
    version: '2.0.0'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    requested_route: req.originalUrl,
    available_routes: ['/health', '/debug', '/test-connection', '/migrate-data', '/sync-data'],
    version: '2.0.0'
  });
});

// Start server with Railway-specific configuration
const server = app.listen(port, host, (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
  
  console.log(`\n✅ PCRM Proxy Service v2.0 successfully started!`);
  console.log(`📡 Listening on: ${host}:${port}`);
  console.log(`🌐 CORS origins: ${corsOptions.origin.length} configured`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚢 Railway environment: ${process.env.RAILWAY_ENVIRONMENT || 'none'}`);
  console.log(`🔗 Public URL: https://candidate-clock-in-production.up.railway.app`);
  console.log(`❤️ Health check: https://candidate-clock-in-production.up.railway.app/`);
  console.log(`🔍 Debug endpoint: https://candidate-clock-in-production.up.railway.app/debug`);
  console.log(`⚡ Server ready to accept connections on ${host}:${port}`);
  
  // Additional Railway-specific logging
  if (process.env.RAILWAY_ENVIRONMENT) {
    console.log(`🚂 Railway deployment successful - service is publicly accessible`);
  }
});

// Enhanced graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
  server.close((err) => {
    if (err) {
      console.error('❌ Error during server shutdown:', err);
      process.exit(1);
    }
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.log('⚠️ Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled error logging
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  console.error('🚨 Stack:', error.stack);
  process.exit(1);
});
