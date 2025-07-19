const { prisma } = require('../config/database');
const { getUserMentorId, getUserMenteeId } = require('../utils/userHelpers');

// Propose a reschedule (mentor or mentee)
const proposeReschedule = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { bookingId, proposedStart, proposedEnd } = req.body;
    // Find booking and check if user is involved
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { mentor: true, mentee: true }
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found', code: 'BOOKING_NOT_FOUND' });
    }
    // Only mentor or mentee can propose
    const mentorId = await getUserMentorId(userId);
    const menteeId = await getUserMenteeId(userId);
    const isMentor = mentorId && booking.mentorId === mentorId;
    const isMentee = menteeId && booking.menteeId === menteeId;
    if (!isMentor && !isMentee) {
      return res.status(403).json({ error: 'Not authorized to propose reschedule', code: 'NOT_AUTHORIZED' });
    }
    // Only allow one pending request per booking
    const existing = await prisma.rescheduleRequest.findFirst({
      where: { bookingId, status: 'PENDING' }
    });
    if (existing) {
      return res.status(409).json({ error: 'A pending reschedule request already exists for this booking', code: 'RESCHEDULE_EXISTS' });
    }
    // Validate proposed times (not in past, end after start)
    const now = new Date();
    if (new Date(proposedStart) < now || new Date(proposedEnd) <= new Date(proposedStart)) {
      return res.status(400).json({ error: 'Invalid proposed times', code: 'INVALID_TIME' });
    }
    // Create reschedule request
    const request = await prisma.rescheduleRequest.create({
      data: {
        bookingId,
        proposerId: userId,
        proposedStart: new Date(proposedStart),
        proposedEnd: new Date(proposedEnd),
        status: 'PENDING'
      }
    });
    res.status(201).json({ message: 'Reschedule request created', request });
  } catch (error) {
    next(error);
  }
};

// Accept a reschedule (other party)
const acceptReschedule = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    // Find reschedule request
    const request = await prisma.rescheduleRequest.findUnique({
      where: { id },
      include: { booking: true }
    });
    if (!request) {
      return res.status(404).json({ error: 'Reschedule request not found', code: 'NOT_FOUND' });
    }
    if (request.status !== 'PENDING') {
      return res.status(400).json({ error: 'Only pending requests can be accepted', code: 'INVALID_STATUS' });
    }
    // Only the other party can accept
    const booking = request.booking;
    const mentorId = await getUserMentorId(userId);
    const menteeId = await getUserMenteeId(userId);
    const isMentor = mentorId && booking.mentorId === mentorId;
    const isMentee = menteeId && booking.menteeId === menteeId;
    if ((isMentor && request.proposerId === userId) || (isMentee && request.proposerId === userId) || (!isMentor && !isMentee)) {
      return res.status(403).json({ error: 'Not authorized to accept this request', code: 'NOT_AUTHORIZED' });
    }
    // Update booking slot/time (for now, just update booking start/end)
    const updated = await prisma.$transaction(async (tx) => {
      await tx.rescheduleRequest.update({
        where: { id },
        data: { status: 'ACCEPTED', responseAt: new Date() }
      });
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: {
          startDatetime: request.proposedStart,
          endDatetime: request.proposedEnd
        }
      });
      return updatedBooking;
    });
    res.json({ message: 'Reschedule request accepted', booking: updated });
  } catch (error) {
    next(error);
  }
};

// Reject a reschedule (other party)
const rejectReschedule = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    // Find reschedule request
    const request = await prisma.rescheduleRequest.findUnique({
      where: { id },
      include: { booking: true }
    });
    if (!request) {
      return res.status(404).json({ error: 'Reschedule request not found', code: 'NOT_FOUND' });
    }
    if (request.status !== 'PENDING') {
      return res.status(400).json({ error: 'Only pending requests can be rejected', code: 'INVALID_STATUS' });
    }
    // Only the other party can reject
    const booking = request.booking;
    const mentorId = await getUserMentorId(userId);
    const menteeId = await getUserMenteeId(userId);
    const isMentor = mentorId && booking.mentorId === mentorId;
    const isMentee = menteeId && booking.menteeId === menteeId;
    if ((isMentor && request.proposerId === userId) || (isMentee && request.proposerId === userId) || (!isMentor && !isMentee)) {
      return res.status(403).json({ error: 'Not authorized to reject this request', code: 'NOT_AUTHORIZED' });
    }
    await prisma.rescheduleRequest.update({
      where: { id },
      data: { status: 'REJECTED', responseAt: new Date() }
    });
    res.json({ message: 'Reschedule request rejected' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  proposeReschedule,
  acceptReschedule,
  rejectReschedule
}; 