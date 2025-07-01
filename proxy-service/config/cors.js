
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
  credentials: false, // Fixed: Match frontend setting
  optionsSuccessStatus: 200,
  preflightContinue: false
};

module.exports = { corsOptions };
