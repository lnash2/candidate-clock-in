
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

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Routes
app.use('/health', healthRoutes);
app.use('/test-connection', testConnectionRoutes);
app.use('/migrate-data', migrateDataRoutes);
app.use('/sync-data', syncDataRoutes);

app.listen(port, () => {
  console.log(`🚀 PCRM Proxy Service running on port ${port}`);
  console.log(`📋 Health check: http://localhost:${port}/health`);
  console.log(`🌐 CORS configured for Lovable domains`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...');
  process.exit(0);
});
