
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

console.log('🚀 Starting PCRM Proxy Service...');
console.log('Port:', port);
console.log('Environment:', process.env.NODE_ENV || 'development');

// Basic CORS - allow all origins for now
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json());

// Simple logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Railway health check - MUST respond quickly
app.get('/', (req, res) => {
  console.log('Health check hit');
  res.status(200).json({
    status: 'healthy',
    message: 'PCRM Proxy Service is running',
    timestamp: new Date().toISOString(),
    port: port
  });
});

// Simple health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'PCRM Proxy Service',
    timestamp: new Date().toISOString()
  });
});

// Basic debug endpoint
app.get('/debug', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Debug endpoint working',
    timestamp: new Date().toISOString()
  });
});

// Catch all 404s
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    requested_route: req.originalUrl
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
const server = app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
  console.log(`✅ Server running on 0.0.0.0:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
