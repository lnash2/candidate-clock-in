
#!/bin/bash
echo "🚀 Railway Deployment v4.0 Starting..."
echo "Node: $(node --version)"
echo "NPM: $(npm --version)"
echo "Environment: $NODE_ENV"
echo "Port: $PORT"
echo "Railway Env: $RAILWAY_ENVIRONMENT"

# Ultra-simple Railway start
exec node server.js
