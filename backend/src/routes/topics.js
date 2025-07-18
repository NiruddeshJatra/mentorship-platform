const express = require('express');
const router = express.Router();
const { getTopics, createTopic } = require('../controllers/topicsController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { topicSchema } = require('../utils/validation');

// Public route - anyone can view topics
router.get('/', getTopics);

// Protected route - only mentors can create custom topics
router.post('/', authenticateToken, requireRole('MENTOR'), validateRequest(topicSchema), createTopic);

module.exports = router;