const express = require('express');
const router = express.Router();
const { createReview, getMentorReviews, getBookingReview } = require('../controllers/reviewController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { reviewSchema } = require('../utils/validation');

// Create a review (mentee only)
router.post('/', authenticateToken, requireRole('MENTEE'), validateRequest(reviewSchema), createReview);

// Get reviews for a specific mentor (public)
router.get('/mentor/:id', getMentorReviews);

// Get review for a specific booking (mentor or mentee involved)
router.get('/booking/:id', authenticateToken, getBookingReview);

module.exports = router; 