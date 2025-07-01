
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { corsOptions } = require('./config/cors');
const healthRoutes = require('./routes/health');
const testConnectionRoutes = require('./routes/testConnection');
const migrateDataRoutes = require('./routes/migrateData');
const syncDataRoutes = require('./routes/syncData');

const app = express();
const port = process.env.PORT || 3001;

// Enhanced CORS handling with detailed logging
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`🌐 Request from origin: ${origin || 'no origin'}`);
  console.log(`📋 Request method: ${req.method}`);
  console.log(`📋 Request URL: ${req.url}`);
  console.log(`📋 User-Agent: ${req.headers['user-agent'] || 'unknown'}`);
  next();
});

// Apply CORS middleware - let it handle all preflight requests
app.use(cors(corsOptions));

// Parse JSON with increased limit
app.use(express.json({ limit: '50mb' }));

// Add a simple root endpoint for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'PCRM Proxy Service is running',
    timestamp: new Date().toISOString(),
    cors_enabled: true,
    allowed_origins: corsOptions.origin.length + ' origins configured'
  });
});

// Routes
app.use('/health', healthRoutes);
app.use('/test-connection', testConnectionRoutes);
app.use('/migrate-data', migrateDataRoutes);
app.use('/sync-data', syncDataRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Server error:', error);
  res.status(500).json({
    success: false,
    error: error.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    available_routes: ['/health', '/test-connection', '/migrate-data', '/sync-data']
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 PCRM Proxy Service running on port ${port}`);
  console.log(`📋 Health check: http://localhost:${port}/health`);
  console.log(`🌐 CORS configured for ${corsOptions.origin.length} origins including Lovable domains`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
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
