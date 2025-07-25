const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config(); // Load environment variables
const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger'); // Destructure the middleware function

// Import routes
const authRoutes = require('./routes/auth');
const mentorRoutes = require('./routes/mentors');
const menteeRoutes = require('./routes/mentees');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const topicRoutes = require('./routes/topics');
const rescheduleRoutes = require('./routes/reschedule');


const app = express();

// Connect to database
connectDB();

// Trust first proxy in production (important for secure cookies)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
}

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Use environment variable in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (requires HTTPS)
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Required for cross-site cookies
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(requestLogger); // Use the destructured function

// CORS configuration
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:3000',
  'https://mentorship-platform-smoky.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    // In development or if no origin, allow the request
    if (process.env.NODE_ENV !== 'production' || !origin) {
      return callback(null, true);
    }
    
    // Check if the origin is allowed
    if (allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin.startsWith(`https://${allowedOrigin.replace(/^https?:\/\//, '')}`) ||
      origin.endsWith('.vercel.app')
    )) {
      return callback(null, true);
    }
    
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 204,
  preflightContinue: false,
  maxAge: 86400 // 24 hours
};

// Apply CORS with the above options
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Rate limiting
if (process.env.NODE_ENV !== 'test') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentees', menteeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/reschedule', rescheduleRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;