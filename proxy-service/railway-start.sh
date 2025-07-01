
#!/bin/bash
echo "🚀 Starting Railway deployment..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Environment: $NODE_ENV"
echo "Port: $PORT"
echo "Railway Environment: $RAILWAY_ENVIRONMENT"

# Start the application
exec node server.js
