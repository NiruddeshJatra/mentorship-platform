const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Mentee creates a booking
router.post('/', authenticateToken, requireRole('MENTEE'), createBooking);

// TODO: Add route handlers

module.exports = router;
