const { prisma } = require('../config/database');
const { AvailabilityStatus } = require('@prisma/client');

// Profile Management
const completeProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    // Check if mentor profile exists
    const existingMentor = await prisma.mentor.findUnique({
      where: { userId }
    });

    if (!existingMentor) {
      const error = new Error('Mentor profile not found');
      error.statusCode = 404;
      error.code = 'MENTOR_NOT_FOUND';
      return next(error);
    }

    // Update both user and mentor tables in transaction
    const updatedMentor = await prisma.$transaction(async (tx) => {
      // Update user fields
      const { company, experienceYears, hourlyRate, ...userFields } = profileData;
      
      if (Object.keys(userFields).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: userFields
        });
      }

      // Update mentor-specific fields
      const mentorUpdateData = {};
      if (company !== undefined) mentorUpdateData.company = company;
      if (experienceYears !== undefined) mentorUpdateData.experienceYears = experienceYears;
      if (hourlyRate !== undefined) mentorUpdateData.hourlyRate = hourlyRate;

      if (Object.keys(mentorUpdateData).length > 0) {
        await tx.mentor.update({
          where: { userId },
          data: mentorUpdateData
        });
      }

      // Return complete profile
      return await tx.user.findUnique({
        where: { id: userId },
        include: {
          mentor: {
            include: {
              expertise: {
                include: {
                  topic: true
                }
              }
            }
          }
        }
      });
    });

    res.json({
      message: 'Profile completed successfully',
      mentor: updatedMentor
    });
  } catch (error) {
    console.error('Complete mentor profile error:', error);
    error.statusCode = 500;
    error.code = 'PROFILE_COMPLETION_ERROR';
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    const updatedMentor = await prisma.$transaction(async (tx) => {
      // Update user fields
      const { company, experienceYears, hourlyRate, ...userFields } = profileData;
      
      if (Object.keys(userFields).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: userFields
        });
      }

      // Update mentor-specific fields
      const mentorUpdateData = {};
      if (company !== undefined) mentorUpdateData.company = company;
      if (experienceYears !== undefined) mentorUpdateData.experienceYears = experienceYears;
      if (hourlyRate !== undefined) mentorUpdateData.hourlyRate = hourlyRate;

      if (Object.keys(mentorUpdateData).length > 0) {
        await tx.mentor.update({
          where: { userId },
          data: mentorUpdateData
        });
      }

      return await tx.user.findUnique({
        where: { id: userId },
        include: {
          mentor: {
            include: {
              expertise: {
                include: {
                  topic: true
                }
              }
            }
          }
        }
      });
    });

    res.json({
      message: 'Profile updated successfully',
      mentor: updatedMentor
    });
  } catch (error) {
    console.error('Update mentor profile error:', error);
    error.statusCode = 500;
    error.code = 'PROFILE_UPDATE_ERROR';
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const mentor = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        mentor: {
          include: {
            expertise: {
              include: {
                topic: true
              }
            },
            availabilitySlots: {
              where: {
                status: AvailabilityStatus.AVAILABLE,
                endDatetime: {
                  gte: new Date()
                }
              },
              orderBy: {
                startDatetime: 'asc'
              }
            }
          }
        }
      }
    });

    if (!mentor) {
      const error = new Error('Mentor not found');
      error.statusCode = 404;
      error.code = 'MENTOR_NOT_FOUND';
      return next(error);
    }

    res.json({ mentor });
  } catch (error) {
    console.error('Get mentor profile error:', error);
    error.statusCode = 500;
    error.code = 'GET_PROFILE_ERROR';
    next(error);
  }
};

// Expertise Management
const addExpertise = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { topicId, price, durationMinutes, description } = req.body;

    // Get mentor ID
    const mentor = await prisma.mentor.findUnique({
      where: { userId }
    });

    if (!mentor) {
      const error = new Error('Mentor profile not found');
      error.statusCode = 404;
      error.code = 'MENTOR_NOT_FOUND';
      return next(error);
    }

    // Check if topic exists
    const topic = await prisma.topic.findUnique({
      where: { id: topicId }
    });

    if (!topic) {
      const error = new Error('Topic not found');
      error.statusCode = 404;
      error.code = 'TOPIC_NOT_FOUND';
      return next(error);
    }

    // Check if expertise already exists
    const existingExpertise = await prisma.mentorExpertise.findUnique({
      where: {
        mentorId_topicId: {
          mentorId: mentor.id,
          topicId: topicId
        }
      }
    });

    if (existingExpertise) {
      const error = new Error('Expertise already exists for this topic');
      error.statusCode = 400;
      error.code = 'EXPERTISE_EXISTS';
      return next(error);
    }

    // Create expertise
    const expertise = await prisma.mentorExpertise.create({
      data: {
        mentorId: mentor.id,
        topicId,
        price,
        durationMinutes,
        description
      },
      include: {
        topic: true
      }
    });

    res.status(201).json({
      message: 'Expertise added successfully',
      expertise
    });
  } catch (error) {
    console.error('Add expertise error:', error);
    error.statusCode = 500;
    error.code = 'ADD_EXPERTISE_ERROR';
    next(error);
  }
};

const updateExpertise = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const expertiseId = req.params.id;
    const { topicId, price, durationMinutes, description } = req.body;

    // Get mentor ID
    const mentor = await prisma.mentor.findUnique({
      where: { userId }
    });

    if (!mentor) {
      const error = new Error('Mentor profile not found');
      error.statusCode = 404;
      error.code = 'MENTOR_NOT_FOUND';
      return next(error);
    }

    // Check if expertise exists and belongs to mentor
    const existingExpertise = await prisma.mentorExpertise.findFirst({
      where: {
        id: expertiseId,
        mentorId: mentor.id
      }
    });

    if (!existingExpertise) {
      const error = new Error('Expertise not found or unauthorized');
      error.statusCode = 404;
      error.code = 'EXPERTISE_NOT_FOUND';
      return next(error);
    }

    // If changing topic, check if new topic exists and not duplicate
    if (topicId && topicId !== existingExpertise.topicId) {
      const topic = await prisma.topic.findUnique({
        where: { id: topicId }
      });

      if (!topic) {
        const error = new Error('Topic not found');
        error.statusCode = 404;
        error.code = 'TOPIC_NOT_FOUND';
        return next(error);
      }

      // Check for duplicate with new topic
      const duplicateExpertise = await prisma.mentorExpertise.findUnique({
        where: {
          mentorId_topicId: {
            mentorId: mentor.id,
            topicId: topicId
          }
        }
      });

      if (duplicateExpertise) {
        const error = new Error('Expertise already exists for this topic');
        error.statusCode = 400;
        error.code = 'EXPERTISE_EXISTS';
        return next(error);
      }
    }

    // Update expertise
    const updatedExpertise = await prisma.mentorExpertise.update({
      where: { id: expertiseId },
      data: {
        ...(topicId && { topicId }),
        ...(price !== undefined && { price }),
        ...(durationMinutes !== undefined && { durationMinutes }),
        ...(description !== undefined && { description })
      },
      include: {
        topic: true
      }
    });

    res.json({
      message: 'Expertise updated successfully',
      expertise: updatedExpertise
    });
  } catch (error) {
    console.error('Update expertise error:', error);
    error.statusCode = 500;
    error.code = 'UPDATE_EXPERTISE_ERROR';
    next(error);
  }
};

const deleteExpertise = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const expertiseId = req.params.id;

    // Get mentor ID
    const mentor = await prisma.mentor.findUnique({
      where: { userId }
    });

    if (!mentor) {
      const error = new Error('Mentor profile not found');
      error.statusCode = 404;
      error.code = 'MENTOR_NOT_FOUND';
      return next(error);
    }

    // Check if expertise exists and belongs to mentor
    const existingExpertise = await prisma.mentorExpertise.findFirst({
      where: {
        id: expertiseId,
        mentorId: mentor.id
      }
    });

    if (!existingExpertise) {
      const error = new Error('Expertise not found or unauthorized');
      error.statusCode = 404;
      error.code = 'EXPERTISE_NOT_FOUND';
      return next(error);
    }

    // Check if there are any bookings for this expertise
    const bookingCount = await prisma.booking.count({
      where: {
        mentorExpertiseId: expertiseId,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    });

    if (bookingCount > 0) {
      const error = new Error('Cannot delete expertise with active bookings');
      error.statusCode = 400;
      error.code = 'EXPERTISE_HAS_BOOKINGS';
      return next(error);
    }

    // Soft delete by setting isActive to false
    await prisma.mentorExpertise.update({
      where: { id: expertiseId },
      data: { isActive: false }
    });

    res.json({
      message: 'Expertise deleted successfully'
    });
  } catch (error) {
    console.error('Delete expertise error:', error);
    error.statusCode = 500;
    error.code = 'DELETE_EXPERTISE_ERROR';
    next(error);
  }
};

const getExpertise = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const mentor = await prisma.mentor.findUnique({
      where: { userId },
      include: {
        expertise: {
          where: { isActive: true },
          include: {
            topic: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!mentor) {
      const error = new Error('Mentor profile not found');
      error.statusCode = 404;
      error.code = 'MENTOR_NOT_FOUND';
      return next(error);
    }

    res.json({ expertise: mentor.expertise });
  } catch (error) {
    console.error('Get expertise error:', error);
    error.statusCode = 500;
    error.code = 'GET_EXPERTISE_ERROR';
    next(error);
  }
};

// Availability Management
const createAvailability = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDatetime, endDatetime, isRecurring, recurrencePattern, recurrenceEndDate } = req.body;

    // Get mentor ID
    const mentor = await prisma.mentor.findUnique({
      where: { userId }
    });

    if (!mentor) {
      const error = new Error('Mentor profile not found');
      error.statusCode = 404;
      error.code = 'MENTOR_NOT_FOUND';
      return next(error);
    }

    // Validate dates
    const start = new Date(startDatetime);
    const end = new Date(endDatetime);
    const now = new Date();

    if (start <= now) {
      const error = new Error('Start time must be in the future');
      error.statusCode = 400;
      error.code = 'INVALID_START_TIME';
      return next(error);
    }

    if (end <= start) {
      const error = new Error('End time must be after start time');
      error.statusCode = 400;
      error.code = 'INVALID_END_TIME';
      return next(error);
    }

    // Check for overlapping slots
    const overlappingSlots = await prisma.availabilitySlot.findMany({
      where: {
        mentorId: mentor.id,
        status: AvailabilityStatus.AVAILABLE,
        OR: [
          {
            startDatetime: { lt: end },
            endDatetime: { gt: start }
          }
        ]
      }
    });

    if (overlappingSlots.length > 0) {
      const error = new Error('Time slot overlaps with existing availability');
      error.statusCode = 400;
      error.code = 'SLOT_OVERLAP';
      return next(error);
    }

    // Create availability slot
    const slot = await prisma.availabilitySlot.create({
      data: {
        mentorId: mentor.id,
        startDatetime: start,
        endDatetime: end,
        isRecurring: isRecurring || false,
        recurrencePattern: isRecurring ? recurrencePattern : null,
        recurrenceEndDate: isRecurring && recurrenceEndDate ? new Date(recurrenceEndDate) : null
      }
    });

    res.status(201).json({
      message: 'Availability slot created successfully',
      slot
    });
  } catch (error) {
    console.error('Create availability error:', error);
    error.statusCode = 500;
    error.code = 'CREATE_AVAILABILITY_ERROR';
    next(error);
  }
};

const getAvailability = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const mentor = await prisma.mentor.findUnique({
      where: { userId },
      include: {
        availabilitySlots: {
          where: {
            status: AvailabilityStatus.AVAILABLE,
            endDatetime: {
              gte: new Date()
            }
          },
          orderBy: {
            startDatetime: 'asc'
          }
        }
      }
    });

    if (!mentor) {
      const error = new Error('Mentor profile not found');
      error.statusCode = 404;
      error.code = 'MENTOR_NOT_FOUND';
      return next(error);
    }

    res.json({ availability: mentor.availabilitySlots });
  } catch (error) {
    console.error('Get availability error:', error);
    error.statusCode = 500;
    error.code = 'GET_AVAILABILITY_ERROR';
    next(error);
  }
};

const updateAvailability = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const slotId = req.params.id;
    const { startDatetime, endDatetime, isRecurring, recurrencePattern, recurrenceEndDate } = req.body;

    // Get mentor ID
    const mentor = await prisma.mentor.findUnique({
      where: { userId }
    });

    if (!mentor) {
      const error = new Error('Mentor profile not found');
      error.statusCode = 404;
      error.code = 'MENTOR_NOT_FOUND';
      return next(error);
    }

    // Check if slot exists and belongs to mentor
    const existingSlot = await prisma.availabilitySlot.findFirst({
      where: {
        id: slotId,
        mentorId: mentor.id
      }
    });

    if (!existingSlot) {
      const error = new Error('Availability slot not found or unauthorized');
      error.statusCode = 404;
      error.code = 'SLOT_NOT_FOUND';
      return next(error);
    }

    // Check if slot is booked
    if (existingSlot.status === AvailabilityStatus.BOOKED) {
      const error = new Error('Cannot update booked availability slot');
      error.statusCode = 400;
      error.code = 'SLOT_BOOKED';
      return next(error);
    }

    // Validate new dates if provided
    if (startDatetime || endDatetime) {
      const start = new Date(startDatetime || existingSlot.startDatetime);
      const end = new Date(endDatetime || existingSlot.endDatetime);
      const now = new Date();

      if (start <= now) {
        const error = new Error('Start time must be in the future');
        error.statusCode = 400;
        error.code = 'INVALID_START_TIME';
        return next(error);
      }

      if (end <= start) {
        const error = new Error('End time must be after start time');
        error.statusCode = 400;
        error.code = 'INVALID_END_TIME';
        return next(error);
      }

      // Check for overlapping slots (excluding current slot)
      const overlappingSlots = await prisma.availabilitySlot.findMany({
        where: {
          mentorId: mentor.id,
          id: { not: slotId },
          status: AvailabilityStatus.AVAILABLE,
          OR: [
            {
              startDatetime: { lt: end },
              endDatetime: { gt: start }
            }
          ]
        }
      });

      if (overlappingSlots.length > 0) {
        const error = new Error('Time slot overlaps with existing availability');
        error.statusCode = 400;
        error.code = 'SLOT_OVERLAP';
        return next(error);
      }
    }

    // Update slot
    const updatedSlot = await prisma.availabilitySlot.update({
      where: { id: slotId },
      data: {
        ...(startDatetime && { startDatetime: new Date(startDatetime) }),
        ...(endDatetime && { endDatetime: new Date(endDatetime) }),
        ...(isRecurring !== undefined && { isRecurring }),
        ...(isRecurring && recurrencePattern && { recurrencePattern }),
        ...(isRecurring && recurrenceEndDate && { recurrenceEndDate: new Date(recurrenceEndDate) }),
        ...(!isRecurring && { recurrencePattern: null, recurrenceEndDate: null })
      }
    });

    res.json({
      message: 'Availability slot updated successfully',
      slot: updatedSlot
    });
  } catch (error) {
    console.error('Update availability error:', error);
    error.statusCode = 500;
    error.code = 'UPDATE_AVAILABILITY_ERROR';
    next(error);
  }
};

const deleteAvailability = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const slotId = req.params.id;

    // Get mentor ID
    const mentor = await prisma.mentor.findUnique({
      where: { userId }
    });

    if (!mentor) {
      const error = new Error('Mentor profile not found');
      error.statusCode = 404;
      error.code = 'MENTOR_NOT_FOUND';
      return next(error);
    }

    // Check if slot exists and belongs to mentor
    const existingSlot = await prisma.availabilitySlot.findFirst({
      where: {
        id: slotId,
        mentorId: mentor.id
      }
    });

    if (!existingSlot) {
      const error = new Error('Availability slot not found or unauthorized');
      error.statusCode = 404;
      error.code = 'SLOT_NOT_FOUND';
      return next(error);
    }

    // Check if slot is booked
    if (existingSlot.status === AvailabilityStatus.BOOKED) {
      const error = new Error('Cannot delete booked availability slot');
      error.statusCode = 400;
      error.code = 'SLOT_BOOKED';
      return next(error);
    }

    // Soft delete by setting status to CANCELLED
    await prisma.availabilitySlot.update({
      where: { id: slotId },
      data: { status: AvailabilityStatus.CANCELLED }
    });

    res.json({
      message: 'Availability slot deleted successfully'
    });
  } catch (error) {
    console.error('Delete availability error:', error);
    error.statusCode = 500;
    error.code = 'DELETE_AVAILABILITY_ERROR';
    next(error);
  }
};

module.exports = {
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
};