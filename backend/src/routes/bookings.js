const express = require('express');
const router = express.Router();
const { createBooking, approveBooking, rejectBooking } = require('../controllers/bookingController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Mentee creates a booking
router.post('/', authenticateToken, requireRole('MENTEE'), createBooking);

// Mentor approves a booking
router.patch('/:id/approve', authenticateToken, requireRole('MENTOR'), approveBooking);
// Mentor rejects a booking
router.patch('/:id/reject', authenticateToken, requireRole('MENTOR'), rejectBooking);

// TODO: Add route handlers

module.exports = router;
