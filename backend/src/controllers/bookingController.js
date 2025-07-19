const { prisma } = require('../config/database');
const { getUserMentorId, getUserMenteeId } = require('../utils/userHelpers');

// Create a new booking (mentee books a session)
const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const menteeId = await getUserMenteeId(userId);
    
    if (!menteeId) {
      return res.status(404).json({ error: 'Mentee profile not found', code: 'PROFILE_NOT_FOUND' });
    }
    
    const { mentorId, mentorExpertiseId, availabilitySlotId, startDatetime, endDatetime, totalPrice, menteeNotes } = req.body;

    // Validate required fields
    if (!mentorId || !mentorExpertiseId || !availabilitySlotId || !startDatetime || !endDatetime || !totalPrice) {
      return res.status(400).json({ error: 'Missing required fields', code: 'VALIDATION_ERROR' });
    }

    // Check if slot is available
    const slot = await prisma.availabilitySlot.findUnique({
      where: { id: availabilitySlotId },
    });
    if (!slot || slot.status !== 'AVAILABLE') {
      return res.status(400).json({ error: 'Slot not available', code: 'SLOT_UNAVAILABLE' });
    }

    // Check for double booking (slot already booked)
    const existingBooking = await prisma.booking.findFirst({
      where: {
        availabilitySlotId,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });
    if (existingBooking) {
      return res.status(400).json({ error: 'Slot already booked', code: 'DOUBLE_BOOKING' });
    }

    // Check expertise exists and belongs to mentor
    const expertise = await prisma.mentorExpertise.findUnique({
      where: { id: mentorExpertiseId },
    });
    if (!expertise || expertise.mentorId !== mentorId) {
      return res.status(400).json({ error: 'Invalid expertise for mentor', code: 'INVALID_EXPERTISE' });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        menteeId,
        mentorId,
        mentorExpertiseId,
        availabilitySlotId,
        startDatetime: new Date(startDatetime),
        endDatetime: new Date(endDatetime),
        totalPrice,
        menteeNotes,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
      include: {
        mentor: true,
        mentee: true,
        mentorExpertise: true,
        availabilitySlot: true,
      },
    });

    // Update slot status to BOOKED
    await prisma.availabilitySlot.update({
      where: { id: availabilitySlotId },
      data: { status: 'BOOKED' },
    });

    res.status(201).json({ booking });
  } catch (error) {
    console.error('Create booking error:', error);
    error.statusCode = 500;
    error.code = 'CREATE_BOOKING_ERROR';
    next(error);
  }
};

// Approve a booking (mentor)
const approveBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const mentorId = await getUserMentorId(userId);
    
    if (!mentorId) {
      return res.status(404).json({ error: 'Mentor profile not found', code: 'PROFILE_NOT_FOUND' });
    }
    
    const bookingId = req.params.id;

    // Find booking and check permissions
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { mentor: true, availabilitySlot: true }
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found', code: 'BOOKING_NOT_FOUND' });
    }
    if (booking.mentorId !== mentorId) {
      return res.status(403).json({ error: 'Not authorized to approve this booking', code: 'NOT_AUTHORIZED' });
    }
    if (booking.status !== 'PENDING') {
      return res.status(400).json({ error: 'Only pending bookings can be approved', code: 'INVALID_STATUS' });
    }

    // Approve booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
      include: { mentor: true, mentee: true, mentorExpertise: true, availabilitySlot: true }
    });
    // Update slot status to BOOKED
    await prisma.availabilitySlot.update({
      where: { id: booking.availabilitySlotId },
      data: { status: 'BOOKED' }
    });
    res.json({ booking: updatedBooking });
  } catch (error) {
    console.error('Approve booking error:', error);
    error.statusCode = 500;
    error.code = 'APPROVE_BOOKING_ERROR';
    next(error);
  }
};

// Reject a booking (mentor)
const rejectBooking = async (req, res, next) => {
  try {
    const mentorId = await getUserMentorId(req.user.id);
    const bookingId = req.params.id;

    // Find booking and check permissions
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { mentor: true, availabilitySlot: true }
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found', code: 'BOOKING_NOT_FOUND' });
    }
    if (booking.mentorId !== mentorId) {
      return res.status(403).json({ error: 'Not authorized to reject this booking', code: 'NOT_AUTHORIZED' });
    }
    if (booking.status !== 'PENDING') {
      return res.status(400).json({ error: 'Only pending bookings can be rejected', code: 'INVALID_STATUS' });
    }

    // Reject booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      include: { mentor: true, mentee: true, mentorExpertise: true, availabilitySlot: true }
    });
    // Optionally, update slot status to AVAILABLE
    await prisma.availabilitySlot.update({
      where: { id: booking.availabilitySlotId },
      data: { status: 'AVAILABLE' }
    });
    res.json({ message: 'Booking rejected', booking: updatedBooking });
  } catch (error) {
    console.error('Reject booking error:', error);
    error.statusCode = 500;
    error.code = 'REJECT_BOOKING_ERROR';
    next(error);
  }
};

// List bookings for the current user (mentor or mentee)
const listBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let where = {};
    if (role === 'MENTOR') {
      // Use mentorId from userId
      const mentorId = await getUserMentorId(userId);
      if (!mentorId) {
        return res.status(404).json({ error: 'Mentor profile not found', code: 'PROFILE_NOT_FOUND' });
      }
      where.mentorId = mentorId;
    } else if (role === 'MENTEE') {
      // Use menteeId from userId
      const menteeId = await getUserMenteeId(userId);
      if (!menteeId) {
        return res.status(404).json({ error: 'Mentee profile not found', code: 'PROFILE_NOT_FOUND' });
      }
      where.menteeId = menteeId;
    } else {
      return res.status(403).json({ error: 'Invalid role', code: 'INVALID_ROLE' });
    }
    // Optional: filter by status, pagination, etc.
    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        mentor: true,
        mentee: true,
        mentorExpertise: true,
        availabilitySlot: true,
      },
    });
    res.json({ bookings });
  } catch (error) {
    console.error('List bookings error:', error);
    error.statusCode = 500;
    error.code = 'LIST_BOOKINGS_ERROR';
    next(error);
  }
};

// Get booking detail for the current user (mentor or mentee)
const getBookingDetail = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const bookingId = req.params.id;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        mentor: true,
        mentee: true,
        mentorExpertise: true,
        availabilitySlot: true,
      },
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found', code: 'BOOKING_NOT_FOUND' });
    }
    // Check if user is involved in the booking
    let isAuthorized = false;
    if (role === 'MENTOR') {
      const mentorId = await getUserMentorId(userId);
      isAuthorized = booking.mentorId === mentorId;
    } else if (role === 'MENTEE') {
      const menteeId = await getUserMenteeId(userId);
      isAuthorized = booking.menteeId === menteeId;
    }
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Not authorized to view this booking', code: 'NOT_AUTHORIZED' });
    }
    res.json({ booking });
  } catch (error) {
    console.error('Get booking detail error:', error);
    error.statusCode = 500;
    error.code = 'GET_BOOKING_DETAIL_ERROR';
    next(error);
  }
};

// Cancel a booking (mentor or mentee)
const cancelBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const bookingId = req.params.id;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { availabilitySlot: true }
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found', code: 'BOOKING_NOT_FOUND' });
    }
    // Check if user is involved in the booking
    let isAuthorized = false;
    if (role === 'MENTOR') {
      const mentorId = await getUserMentorId(userId);
      isAuthorized = booking.mentorId === mentorId;
    } else if (role === 'MENTEE') {
      const menteeId = await getUserMenteeId(userId);
      isAuthorized = booking.menteeId === menteeId;
    }
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking', code: 'NOT_AUTHORIZED' });
    }
    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      return res.status(400).json({ error: 'Only pending or confirmed bookings can be cancelled', code: 'INVALID_STATUS' });
    }
    // Cancel booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      include: { mentor: true, mentee: true, mentorExpertise: true, availabilitySlot: true }
    });
    // Optionally, set slot to AVAILABLE if it was booked
    if (booking.availabilitySlot && booking.availabilitySlot.status === 'BOOKED') {
      await prisma.availabilitySlot.update({
        where: { id: booking.availabilitySlotId },
        data: { status: 'AVAILABLE' }
      });
    }
    res.json({ message: 'Booking cancelled', booking: updatedBooking });
  } catch (error) {
    console.error('Cancel booking error:', error);
    error.statusCode = 500;
    error.code = 'CANCEL_BOOKING_ERROR';
    next(error);
  }
};

// Complete a booking (mentor only)
const completeBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const mentorId = await getUserMentorId(userId);
    
    if (!mentorId) {
      return res.status(404).json({ error: 'Mentor profile not found', code: 'PROFILE_NOT_FOUND' });
    }
    
    const bookingId = req.params.id;

    // Find booking and check permissions
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { mentor: true, availabilitySlot: true }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found', code: 'BOOKING_NOT_FOUND' });
    }
    
    if (booking.mentorId !== mentorId) {
      return res.status(403).json({ error: 'Not authorized to complete this booking', code: 'NOT_AUTHORIZED' });
    }
    
    if (booking.status !== 'CONFIRMED') {
      return res.status(400).json({ error: 'Only confirmed bookings can be completed', code: 'INVALID_STATUS' });
    }

    // Check if session time has passed
    const now = new Date();
    if (booking.endDatetime > now) {
      return res.status(400).json({ error: 'Cannot complete booking before session end time', code: 'SESSION_NOT_ENDED' });
    }

    // Complete booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'COMPLETED' },
      include: { mentor: true, mentee: true, mentorExpertise: true, availabilitySlot: true }
    });

    res.json({ 
      message: 'Booking completed successfully',
      booking: updatedBooking 
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    error.statusCode = 500;
    error.code = 'COMPLETE_BOOKING_ERROR';
    next(error);
  }
};

module.exports = {
  createBooking,
  approveBooking,
  rejectBooking,
  listBookings,
  getBookingDetail,
  cancelBooking,
  completeBooking
};