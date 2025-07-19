const express = require('express');
const router = express.Router();
const { proposeReschedule, acceptReschedule, rejectReschedule } = require('../controllers/rescheduleController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { rescheduleRequestSchema } = require('../utils/validation');

// Propose a reschedule (mentor or mentee)
router.post('/', authenticateToken, validateRequest(rescheduleRequestSchema), proposeReschedule);

// Accept a reschedule (other party)
router.patch('/:id/accept', authenticateToken, acceptReschedule);

// Reject a reschedule (other party)
router.patch('/:id/reject', authenticateToken, rejectReschedule);

module.exports = router; 