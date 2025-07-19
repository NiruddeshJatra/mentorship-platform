const express = require('express');
const router = express.Router();
const { createBooking, approveBooking, rejectBooking, listBookings, getBookingDetail, cancelBooking, completeBooking } = require('../controllers/bookingController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Mentee creates a booking
router.post('/', authenticateToken, requireRole('MENTEE'), createBooking);

// Mentor approves a booking
router.patch('/:id/approve', authenticateToken, requireRole('MENTOR'), approveBooking);
// Mentor rejects a booking
router.patch('/:id/reject', authenticateToken, requireRole('MENTOR'), rejectBooking);
// Mentor completes a booking
router.patch('/:id/complete', authenticateToken, requireRole('MENTOR'), completeBooking);

// Cancel a booking (mentor or mentee)
router.patch('/:id/cancel', authenticateToken, cancelBooking);

// List bookings for current user
router.get('/', authenticateToken, listBookings);
// Get booking detail for current user
router.get('/:id', authenticateToken, getBookingDetail);

// TODO: Add route handlers

module.exports = router;
