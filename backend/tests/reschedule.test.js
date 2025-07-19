jest.setTimeout(30000);
const request = require('supertest');
const app = require('../src/app');
const { prisma } = require('../src/config/database');

// Helper to register and login a user
async function registerAndLogin(role, email) {
  await request(app)
    .post('/api/auth/register')
    .send({ email, password: 'TestPassword123!', name: `${role} User`, role });
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email, password: 'TestPassword123!' });
  return loginRes.body.token;
}

// Helper to set up a booking
async function setupBooking(unique) {
  const mentorEmail = `mentor${unique}@test.com`;
  const menteeEmail = `mentee${unique}@test.com`;
  const mentorToken = await registerAndLogin('mentor', mentorEmail);
  const menteeToken = await registerAndLogin('mentee', menteeEmail);
  await request(app)
    .put('/api/mentors/profile')
    .set('Authorization', `Bearer ${mentorToken}`)
    .send({ company: 'TestCo' });
  await request(app)
    .put('/api/mentees/profile')
    .set('Authorization', `Bearer ${menteeToken}`)
    .send({ bio: 'Test Mentee' });
  const topicRes = await request(app)
    .post('/api/topics')
    .set('Authorization', `Bearer ${mentorToken}`)
    .send({ name: `Test Topic ${unique}` });
  const topicId = topicRes.body.topic.id;
  const expertiseRes = await request(app)
    .post('/api/mentors/expertise')
    .set('Authorization', `Bearer ${mentorToken}`)
    .send({ topicId, price: 100, durationMinutes: 60 });
  const expertiseId = expertiseRes.body.expertise.id;
  const start = new Date(Date.now() + 3600000).toISOString();
  const end = new Date(Date.now() + 7200000).toISOString();
  const slotRes = await request(app)
    .post('/api/mentors/availability')
    .set('Authorization', `Bearer ${mentorToken}`)
    .send({ startDatetime: start, endDatetime: end });
  const slotId = slotRes.body.slot.id;
  const slotMentorId = slotRes.body.slot.mentorId;
  const bookingRes = await request(app)
    .post('/api/bookings')
    .set('Authorization', `Bearer ${menteeToken}`)
    .send({
      mentorId: slotMentorId,
      mentorExpertiseId: expertiseId,
      availabilitySlotId: slotId,
      startDatetime: start,
      endDatetime: end,
      totalPrice: 100,
      menteeNotes: 'Reschedule test'
    });
  const bookingId = bookingRes.body.booking.id;
  return { mentorToken, menteeToken, bookingId, start, end };
}

describe('Reschedule API', () => {
  test('mentee can propose a reschedule', async () => {
    const unique = Date.now() + Math.random();
    const { menteeToken, bookingId } = await setupBooking(unique);
    const newStart = new Date(Date.now() + 10800000).toISOString();
    const newEnd = new Date(Date.now() + 14400000).toISOString();
    const res = await request(app)
      .post('/api/reschedule-requests')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bookingId, proposedStart: newStart, proposedEnd: newEnd });
    expect(res.statusCode).toBe(201);
    expect(res.body.request).toBeDefined();
    expect(res.body.request.status).toBe('PENDING');
  });

  test('mentor can propose a reschedule', async () => {
    const unique = Date.now() + Math.random();
    const { mentorToken, bookingId } = await setupBooking(unique);
    const newStart = new Date(Date.now() + 10800000).toISOString();
    const newEnd = new Date(Date.now() + 14400000).toISOString();
    const res = await request(app)
      .post('/api/reschedule-requests')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ bookingId, proposedStart: newStart, proposedEnd: newEnd });
    expect(res.statusCode).toBe(201);
    expect(res.body.request).toBeDefined();
    expect(res.body.request.status).toBe('PENDING');
  });

  test('cannot propose two pending reschedules for the same booking', async () => {
    const unique = Date.now() + Math.random();
    const { menteeToken, bookingId } = await setupBooking(unique);
    const newStart = new Date(Date.now() + 10800000).toISOString();
    const newEnd = new Date(Date.now() + 14400000).toISOString();
    await request(app)
      .post('/api/reschedule-requests')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bookingId, proposedStart: newStart, proposedEnd: newEnd });
    const res = await request(app)
      .post('/api/reschedule-requests')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bookingId, proposedStart: newStart, proposedEnd: newEnd });
    expect(res.statusCode).toBe(409);
  });

  test('other party can accept a reschedule and booking time is updated', async () => {
    const unique = Date.now() + Math.random();
    const { mentorToken, menteeToken, bookingId } = await setupBooking(unique);
    const newStart = new Date(Date.now() + 10800000).toISOString();
    const newEnd = new Date(Date.now() + 14400000).toISOString();
    // Mentee proposes
    const proposeRes = await request(app)
      .post('/api/reschedule-requests')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bookingId, proposedStart: newStart, proposedEnd: newEnd });
    const requestId = proposeRes.body.request.id;
    // Mentor accepts
    const acceptRes = await request(app)
      .patch(`/api/reschedule-requests/${requestId}/accept`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(acceptRes.statusCode).toBe(200);
    expect(acceptRes.body.booking.startDatetime).toBe(newStart);
    expect(acceptRes.body.booking.endDatetime).toBe(newEnd);
  });

  test('other party can reject a reschedule', async () => {
    const unique = Date.now() + Math.random();
    const { mentorToken, menteeToken, bookingId } = await setupBooking(unique);
    const newStart = new Date(Date.now() + 10800000).toISOString();
    const newEnd = new Date(Date.now() + 14400000).toISOString();
    // Mentor proposes
    const proposeRes = await request(app)
      .post('/api/reschedule-requests')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ bookingId, proposedStart: newStart, proposedEnd: newEnd });
    const requestId = proposeRes.body.request.id;
    // Mentee rejects
    const rejectRes = await request(app)
      .patch(`/api/reschedule-requests/${requestId}/reject`)
      .set('Authorization', `Bearer ${menteeToken}`);
    expect(rejectRes.statusCode).toBe(200);
    expect(rejectRes.body.message).toMatch(/rejected/i);
  });

  test('cannot accept or reject a non-pending request', async () => {
    const unique = Date.now() + Math.random();
    const { mentorToken, menteeToken, bookingId } = await setupBooking(unique);
    const newStart = new Date(Date.now() + 10800000).toISOString();
    const newEnd = new Date(Date.now() + 14400000).toISOString();
    // Mentee proposes
    const proposeRes = await request(app)
      .post('/api/reschedule-requests')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bookingId, proposedStart: newStart, proposedEnd: newEnd });
    const requestId = proposeRes.body.request.id;
    // Mentor accepts
    await request(app)
      .patch(`/api/reschedule-requests/${requestId}/accept`)
      .set('Authorization', `Bearer ${mentorToken}`);
    // Try to accept again
    const acceptAgain = await request(app)
      .patch(`/api/reschedule-requests/${requestId}/accept`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(acceptAgain.statusCode).toBe(400);
    // Try to reject
    const rejectAgain = await request(app)
      .patch(`/api/reschedule-requests/${requestId}/reject`)
      .set('Authorization', `Bearer ${menteeToken}`);
    expect(rejectAgain.statusCode).toBe(400);
  });

  test('unauthorized user cannot propose, accept, or reject', async () => {
    const unique = Date.now() + Math.random();
    const { mentorToken, menteeToken, bookingId } = await setupBooking(unique);
    const outsiderEmail = `outsider${unique}@test.com`;
    const outsiderToken = await registerAndLogin('mentee', outsiderEmail);
    const newStart = new Date(Date.now() + 10800000).toISOString();
    const newEnd = new Date(Date.now() + 14400000).toISOString();
    // Outsider tries to propose
    const proposeRes = await request(app)
      .post('/api/reschedule-requests')
      .set('Authorization', `Bearer ${outsiderToken}`)
      .send({ bookingId, proposedStart: newStart, proposedEnd: newEnd });
    expect(proposeRes.statusCode).toBe(403);
    // Mentee proposes
    const proposeOk = await request(app)
      .post('/api/reschedule-requests')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bookingId, proposedStart: newStart, proposedEnd: newEnd });
    const requestId = proposeOk.body.request.id;
    // Outsider tries to accept
    const acceptRes = await request(app)
      .patch(`/api/reschedule-requests/${requestId}/accept`)
      .set('Authorization', `Bearer ${outsiderToken}`);
    expect(acceptRes.statusCode).toBe(403);
    // Outsider tries to reject
    const rejectRes = await request(app)
      .patch(`/api/reschedule-requests/${requestId}/reject`)
      .set('Authorization', `Bearer ${outsiderToken}`);
    expect(rejectRes.statusCode).toBe(403);
  });

  test('validation errors for invalid times', async () => {
    const unique = Date.now() + Math.random();
    const { menteeToken, bookingId } = await setupBooking(unique);
    const now = new Date();
    // End before start
    const res1 = await request(app)
      .post('/api/reschedule-requests')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bookingId, proposedStart: now.toISOString(), proposedEnd: now.toISOString() });
    expect(res1.statusCode).toBe(400);
    // Start in the past
    const past = new Date(Date.now() - 3600000).toISOString();
    const future = new Date(Date.now() + 3600000).toISOString();
    const res2 = await request(app)
      .post('/api/reschedule-requests')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bookingId, proposedStart: past, proposedEnd: future });
    expect(res2.statusCode).toBe(400);
  });
}); 