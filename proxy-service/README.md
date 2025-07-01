
# PCRM Proxy Service

A Node.js proxy service for handling legacy PostgreSQL connections with SSL certificate bypass capabilities.

## Features

- ✅ Robust SSL certificate handling (bypasses expired certificates)
- ✅ Connection testing endpoint
- ✅ Data migration analysis
- ✅ Incremental data sync
- ✅ Connection pooling for performance
- ✅ Comprehensive error handling and logging

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the service:**
   ```bash
   npm start
   ```
   
   For development:
   ```bash
   npm run dev
   ```

3. **Test the service:**
   ```bash
   curl http://localhost:3001/health
   ```

## API Endpoints

### Health Check
```
GET /health
```

### Test Connection
```
POST /test-connection
Content-Type: application/json

{
  "connectionString": "postgresql://user:pass@host:5432/db?sslmode=require"
}
```

### Migrate Data
```
POST /migrate-data
Content-Type: application/json

{
  "connectionString": "postgresql://user:pass@host:5432/db",
  "tables": ["table1", "table2"],
  "batchSize": 1000
}
```

### Sync Data
```
POST /sync-data
Content-Type: application/json

{
  "connectionString": "postgresql://user:pass@host:5432/db",
  "tableName": "users",
  "lastSyncTimestamp": "2024-01-01T00:00:00Z"
}
```

## Deployment

### Railway
1. Connect your GitHub repository to Railway
2. Set the start command to `npm start`
3. Deploy automatically

### Render
1. Connect your GitHub repository to Render
2. Set build command to `npm install`
3. Set start command to `npm start`
4. Deploy

### Environment Variables
- `PORT`: Port number (default: 3001)

## SSL Certificate Handling

This service automatically bypasses SSL certificate validation using:
```javascript
ssl: {
  rejectUnauthorized: false
}
```

This is specifically designed to handle expired SSL certificates on legacy RDS instances while maintaining encrypted connections.
