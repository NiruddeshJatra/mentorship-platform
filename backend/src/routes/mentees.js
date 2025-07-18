const express = require('express');
const router = express.Router();
const { 
  completeProfile, 
  updateProfile, 
  getProfile,
  searchMentors,
  getMentorDetails
} = require('../controllers/menteeController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest, validateQuery } = require('../middleware/validation');
const { menteeProfileSchema, mentorSearchSchema } = require('../utils/validation');

// All routes require mentee authentication
router.use(authenticateToken);
router.use(requireRole('MENTEE'));

// Profile management
router.post('/profile', validateRequest(menteeProfileSchema), completeProfile);
router.put('/profile', validateRequest(menteeProfileSchema), updateProfile);
router.get('/profile', getProfile);

// Mentor discovery
router.get('/mentors/search', validateQuery(mentorSearchSchema), searchMentors);
router.get('/mentors/:id', getMentorDetails);

module.exports = router;