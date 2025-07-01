
const { Pool } = require('pg');

const createPool = (connectionString) => {
  return new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false // This bypasses SSL certificate validation
    },
    max: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  });
};

const createTestPool = (connectionString) => {
  return new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    max: 1, // Single connection for testing
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 10000
  });
};

module.exports = {
  createPool,
  createTestPool
};
