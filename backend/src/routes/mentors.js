const express = require('express');
const router = express.Router();
const { 
  completeProfile, 
  updateProfile, 
  getProfile,
  addExpertise,
  updateExpertise,
  deleteExpertise,
  getExpertise,
  createAvailability,
  getAvailability,
  updateAvailability,
  deleteAvailability
} = require('../controllers/mentorController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { 
  mentorProfileSchema, 
  mentorExpertiseSchema,
  availabilitySlotSchema 
} = require('../utils/validation');

// All routes require mentor authentication
router.use(authenticateToken);
router.use(requireRole('MENTOR'));

// Profile management
router.post('/profile', validateRequest(mentorProfileSchema), completeProfile);
router.put('/profile', validateRequest(mentorProfileSchema), updateProfile);
router.get('/profile', getProfile);

// Expertise management
router.post('/expertise', validateRequest(mentorExpertiseSchema), addExpertise);
router.get('/expertise', getExpertise);
router.put('/expertise/:id', validateRequest(mentorExpertiseSchema), updateExpertise);
router.delete('/expertise/:id', deleteExpertise);

// Availability management
router.post('/availability', validateRequest(availabilitySlotSchema), createAvailability);
router.get('/availability', getAvailability);
router.put('/availability/:id', validateRequest(availabilitySlotSchema), updateAvailability);
router.delete('/availability/:id', deleteAvailability);

module.exports = router;