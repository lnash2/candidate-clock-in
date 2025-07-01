
const express = require('express');
const cors = require('cors');
require('dotenv').config();

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

// CORS configuration
const corsOptions = {
  origin: [
    'https://lovable.dev',
    'https://www.lovable.dev',
    'https://gptengineer.app',
    'https://www.gptengineer.app',
    /^https:\/\/.*\.lovable\.dev$/,
    /^https:\/\/.*\.gptengineer\.app$/,
    /^https:\/\/.*\.lovableproject\.com$/,
    'https://0b88ce54-c9a6-4d2e-a553-df1b0e0a248d.lovableproject.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'https://candidate-clock-in-production.up.railway.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  credentials: false,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Apply CORS first
app.use(cors(corsOptions));

// Parse JSON with increased limit
app.use(express.json({ limit: '50mb' }));

// Simple request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Railway health check endpoint (must be first and simple)
app.get('/', (req, res) => {
  console.log('🏠 Root health check accessed');
  res.json({
    status: 'healthy',
    message: 'PCRM Proxy Service v2.0 is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    railway_environment: process.env.RAILWAY_ENVIRONMENT || 'none'
  });
});

// Load routes with error handling
try {
  const healthRoutes = require('./routes/health');
  const debugRoutes = require('./routes/debug');
  const testConnectionRoutes = require('./routes/testConnection');
  const migrateDataRoutes = require('./routes/migrateData');
  const syncDataRoutes = require('./routes/syncData');

  app.use('/health', healthRoutes);
  app.use('/debug', debugRoutes);
  app.use('/test-connection', testConnectionRoutes);
  app.use('/migrate-data', migrateDataRoutes);
  app.use('/sync-data', syncDataRoutes);
  
  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  process.exit(1);
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Server error:', error.message);
  res.status(500).json({
    success: false,
    error: error.message,
    timestamp: new Date().toISOString(),
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
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚢 Railway environment: ${process.env.RAILWAY_ENVIRONMENT || 'none'}`);
  console.log(`🔗 Public URL: https://candidate-clock-in-production.up.railway.app`);
  console.log(`❤️ Health check: https://candidate-clock-in-production.up.railway.app/`);
  console.log(`⚡ Server ready to accept connections on ${host}:${port}`);
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
