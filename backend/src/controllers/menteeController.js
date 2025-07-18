const { prisma } = require('../config/database');

// Complete mentee profile
const completeProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    // Check if mentee profile exists
    const existingMentee = await prisma.mentee.findUnique({
      where: { userId }
    });
    if (!existingMentee) {
      const error = new Error('Mentee profile not found');
      error.statusCode = 404;
      error.code = 'MENTEE_NOT_FOUND';
      return next(error);
    }

    // Update both user and mentee tables in transaction
    const updatedMentee = await prisma.$transaction(async (tx) => {
      // Update user fields
      const { currentRole, learningGoals, ...userFields } = profileData;
      if (Object.keys(userFields).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: userFields
        });
      }
      // Update mentee-specific fields
      const menteeUpdateData = {};
      if (currentRole !== undefined) menteeUpdateData.currentRole = currentRole;
      if (learningGoals !== undefined) menteeUpdateData.learningGoals = learningGoals;
      if (Object.keys(menteeUpdateData).length > 0) {
        await tx.mentee.update({
          where: { userId },
          data: menteeUpdateData
        });
      }
      // Return complete profile
      return await tx.user.findUnique({
        where: { id: userId },
        include: {
          mentee: true
        }
      });
    });

    res.json({
      message: 'Profile completed successfully',
      mentee: updatedMentee
    });
  } catch (error) {
    console.error('Complete mentee profile error:', error);
    error.statusCode = 500;
    error.code = 'PROFILE_COMPLETION_ERROR';
    next(error);
  }
};

// Update mentee profile
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;
    const updatedMentee = await prisma.$transaction(async (tx) => {
      // Update user fields
      const { currentRole, learningGoals, ...userFields } = profileData;
      if (Object.keys(userFields).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: userFields
        });
      }
      // Update mentee-specific fields
      const menteeUpdateData = {};
      if (currentRole !== undefined) menteeUpdateData.currentRole = currentRole;
      if (learningGoals !== undefined) menteeUpdateData.learningGoals = learningGoals;
      if (Object.keys(menteeUpdateData).length > 0) {
        await tx.mentee.update({
          where: { userId },
          data: menteeUpdateData
        });
      }
      return await tx.user.findUnique({
        where: { id: userId },
        include: {
          mentee: true
        }
      });
    });
    res.json({
      message: 'Profile updated successfully',
      mentee: updatedMentee
    });
  } catch (error) {
    console.error('Update mentee profile error:', error);
    error.statusCode = 500;
    error.code = 'PROFILE_UPDATE_ERROR';
    next(error);
  }
};

// Get mentee profile
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const mentee = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        mentee: true
      }
    });
    if (!mentee) {
      const error = new Error('Mentee not found');
      error.statusCode = 404;
      error.code = 'MENTEE_NOT_FOUND';
      return next(error);
    }
    res.json({ mentee });
  } catch (error) {
    console.error('Get mentee profile error:', error);
    error.statusCode = 500;
    error.code = 'GET_PROFILE_ERROR';
    next(error);
  }
};

module.exports = {
  completeProfile,
  updateProfile,
  getProfile
}; 