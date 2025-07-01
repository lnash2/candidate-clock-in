
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
    'http://localhost:8080'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = { corsOptions };
