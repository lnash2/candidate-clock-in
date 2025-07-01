
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
const port = process.env.PORT || 3001;

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

// Root endpoint with enhanced info
app.get('/', (req, res) => {
  const serverInfo = {
    message: 'PCRM Proxy Service is running',
    timestamp: new Date().toISOString(),
    cors_enabled: true,
    allowed_origins_count: corsOptions.origin.length,
    environment: process.env.NODE_ENV || 'development',
    port: port,
    available_routes: ['/health', '/debug', '/test-connection', '/migrate-data', '/sync-data']
  };
  
  console.log('🏠 Root endpoint accessed:', serverInfo);
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
    method: req.method
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    requested_route: req.originalUrl,
    available_routes: ['/health', '/debug', '/test-connection', '/migrate-data', '/sync-data']
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`\n🚀 PCRM Proxy Service starting...`);
  console.log(`📡 Port: ${port}`);
  console.log(`🌐 CORS origins: ${corsOptions.origin.length} configured`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Service ready at: https://candidate-clock-in-production.up.railway.app`);
  console.log(`📋 Health check: https://candidate-clock-in-production.up.railway.app/health`);
  console.log(`🔍 Debug endpoint: https://candidate-clock-in-production.up.railway.app/debug`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});
