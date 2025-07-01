
const corsOptions = {
  origin: [
    'https://lovable.dev',
    'https://www.lovable.dev',
    'https://gptengineer.app',
    'https://www.gptengineer.app',
    /^https:\/\/.*\.lovable\.dev$/,
    /^https:\/\/.*\.gptengineer\.app$/,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    // Add specific domains that might be causing issues
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
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

module.exports = { corsOptions };
