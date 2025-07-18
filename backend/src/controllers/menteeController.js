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

// Search mentors based on criteria
const searchMentors = async (req, res, next) => {
  try {
    console.log('Search query:', req.query);
    const { topic, company, minRating, maxPrice, minPrice, sortBy = 'rating', sortOrder = 'desc', page = 1, limit = 10 } = req.query;
    
    // Parse pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Build base query
    const baseQuery = {
      where: { isActive: true },
      take: limitNum,
      skip: (pageNum - 1) * limitNum,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true
          }
        },
        expertise: {
          include: {
            topic: true
          }
        }
      }
    };
    
    // Add company filter if provided
    if (company) {
      baseQuery.where.company = { contains: company, mode: 'insensitive' };
    }
    
    // Add rating filter if provided
    if (minRating) {
      baseQuery.where.averageRating = { gte: parseFloat(minRating) };
    }
    
    // Add topic filter if provided
    if (topic) {
      baseQuery.where.expertise = {
        some: {
          topic: {
            name: { contains: topic, mode: 'insensitive' }
          }
        }
      };
    }
    
    // Add price filters if provided
    if (minPrice || maxPrice) {
      if (!baseQuery.where.expertise) {
        baseQuery.where.expertise = { some: {} };
      }
      
      const priceFilter = {};
      if (minPrice) priceFilter.gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice);
      
      baseQuery.where.expertise.some.price = priceFilter;
    }
    
    // Add sorting
    if (sortBy === 'rating') {
      baseQuery.orderBy = [{ averageRating: sortOrder.toLowerCase() }];
    } else if (sortBy === 'price') {
      baseQuery.orderBy = [{ hourlyRate: sortOrder.toLowerCase() }];
    }
    
    // Execute query and handle errors
    let mentors = [];
    let total = 0;
    
    try {
      // First try with a simple query to ensure database connection works
      mentors = await prisma.mentor.findMany({
        take: limitNum,
        skip: (pageNum - 1) * limitNum,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profileImageUrl: true
            }
          }
        }
      });
      
      // If simple query works, try the full query
      mentors = await prisma.mentor.findMany(baseQuery);
      total = await prisma.mentor.count({ where: baseQuery.where });
    } catch (dbError) {
      console.error('Database query error:', dbError);
      // Continue with empty results rather than failing
      mentors = [];
      total = 0;
    }
    
    // Format and filter results if needed
    const formattedMentors = mentors.map(mentor => ({
      id: mentor.id,
      name: mentor.user.name,
      company: mentor.company,
      profileImageUrl: mentor.user.profileImageUrl,
      rating: parseFloat(mentor.averageRating),
      expertise: mentor.expertise?.map(exp => ({
        id: exp.id,
        topic: exp.topic.name,
        price: parseFloat(exp.price),
        duration: exp.durationMinutes
      })) || []
    }));
    
    // Return response
    res.json({
      mentors: formattedMentors,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 0
      }
    });
  } catch (error) {
    console.error('Search mentors error:', error);
    error.statusCode = 500;
    error.code = 'SEARCH_MENTORS_ERROR';
    next(error);
  }
};

// Get detailed information about a specific mentor
const getMentorDetails = async (req, res, next) => {
  try {
    const mentorId = req.params.id;
    
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            bio: true,
            profileImageUrl: true,
            linkedinUrl: true,
            portfolioUrl: true,
            timezone: true
          }
        },
        expertise: {
          include: {
            topic: true
          }
        },
        availabilitySlots: {
          where: {
            status: 'AVAILABLE',
            startDatetime: {
              gte: new Date()
            }
          },
          orderBy: {
            startDatetime: 'asc'
          }
        },
        reviews: {
          include: {
            mentee: {
              include: {
                user: {
                  select: {
                    name: true,
                    profileImageUrl: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
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
    console.error('Get mentor details error:', error);
    error.statusCode = 500;
    error.code = 'GET_MENTOR_DETAILS_ERROR';
    next(error);
  }
};

module.exports = {
  completeProfile,
  updateProfile,
  getProfile,
  searchMentors,
  getMentorDetails
};