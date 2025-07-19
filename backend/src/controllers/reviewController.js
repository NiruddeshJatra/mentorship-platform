const { prisma } = require('../config/database');
const { getUserMenteeId } = require('../utils/userHelpers');

// Create a review (mentee only, after completed booking)
const createReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const menteeId = await getUserMenteeId(userId);
    
    if (!menteeId) {
      return res.status(404).json({ error: 'Mentee profile not found', code: 'PROFILE_NOT_FOUND' });
    }
    
    const { bookingId, rating, comment } = req.body;

    // Validate required fields
    if (!bookingId || !rating) {
      return res.status(400).json({ error: 'Missing required fields', code: 'VALIDATION_ERROR' });
    }

    // Check if booking exists and belongs to mentee
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { mentor: true }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found', code: 'BOOKING_NOT_FOUND' });
    }
    
    if (booking.menteeId !== menteeId) {
      return res.status(403).json({ error: 'Not authorized to review this booking', code: 'NOT_AUTHORIZED' });
    }
    
    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Only completed bookings can be reviewed', code: 'INVALID_BOOKING_STATUS' });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { bookingId }
    });
    
    if (existingReview) {
      return res.status(400).json({ error: 'Review already exists for this booking', code: 'REVIEW_EXISTS' });
    }

    // Create review and update mentor rating in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create review
      const review = await tx.review.create({
        data: {
          bookingId,
          menteeId,
          mentorId: booking.mentorId,
          rating,
          comment
        },
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
        }
      });

      // Update mentor's average rating and total reviews
      const mentorReviews = await tx.review.findMany({
        where: { mentorId: booking.mentorId }
      });

      const totalRating = mentorReviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / mentorReviews.length;

      await tx.mentor.update({
        where: { id: booking.mentorId },
        data: {
          averageRating,
          totalReviews: mentorReviews.length
        }
      });

      return review;
    });

    res.status(201).json({ 
      message: 'Review created successfully',
      review: result 
    });
  } catch (error) {
    console.error('Create review error:', error);
    error.statusCode = 500;
    error.code = 'CREATE_REVIEW_ERROR';
    next(error);
  }
};

// Get reviews for a specific mentor (public)
const getMentorReviews = async (req, res, next) => {
  try {
    const mentorId = req.params.id;
    
    // Check if mentor exists
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId }
    });
    
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found', code: 'MENTOR_NOT_FOUND' });
    }

    const reviews = await prisma.review.findMany({
      where: { mentorId },
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
      orderBy: { createdAt: 'desc' }
    });

    res.json({ reviews });
  } catch (error) {
    console.error('Get mentor reviews error:', error);
    error.statusCode = 500;
    error.code = 'GET_MENTOR_REVIEWS_ERROR';
    next(error);
  }
};

// Get review for a specific booking (mentor or mentee involved)
const getBookingReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;

    // Check if booking exists and user is involved
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { mentor: true, mentee: true }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found', code: 'BOOKING_NOT_FOUND' });
    }

    // Check if user is involved in the booking
    let isAuthorized = false;
    if (req.user.role === 'MENTOR') {
      isAuthorized = booking.mentor.userId === userId;
    } else if (req.user.role === 'MENTEE') {
      isAuthorized = booking.mentee.userId === userId;
    }
    
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Not authorized to view this review', code: 'NOT_AUTHORIZED' });
    }

    const review = await prisma.review.findUnique({
      where: { bookingId },
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
      }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found', code: 'REVIEW_NOT_FOUND' });
    }

    res.json({ review });
  } catch (error) {
    console.error('Get booking review error:', error);
    error.statusCode = 500;
    error.code = 'GET_BOOKING_REVIEW_ERROR';
    next(error);
  }
};

module.exports = {
  createReview,
  getMentorReviews,
  getBookingReview
}; 