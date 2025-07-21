const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
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

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(requestLogger); // Use the destructured function

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://your-production-frontend.com' : 'http://localhost:8080',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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