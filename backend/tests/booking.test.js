jest.setTimeout(30000);
const request = require('supertest');
const app = require('../src/app');
const { prisma } = require('../src/config/database');

// NOTE: If a test requires browser or frontend interaction, skip it here and test via the UI.
// Use test.skip('description', ...) for such cases.

// Helper to register and login a user
async function registerAndLogin(role, email) {
  await request(app)
    .post('/api/auth/register')
    .send({
      email,
      password: 'TestPassword123!',
      name: `${role} User`,
      role
    });
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email, password: 'TestPassword123!' });
  return loginRes.body.token;
}

// Helper to create mentor/mentee, topic, expertise, slot, and booking
async function setupBookingTest({ unique, slotStartOffset = 3600000, slotEndOffset = 7200000, menteeNotes = 'Test', bookingStatus = 'PENDING' }) {
  const mentorEmail = `mentor${unique}@test.com`;
  const menteeEmail = `mentee${unique}@test.com`;
  const mentorToken = await registerAndLogin('mentor', mentorEmail);
  const menteeToken = await registerAndLogin('mentee', menteeEmail);
  // Create mentor profile
  await request(app)
    .put('/api/mentors/profile')
    .set('Authorization', `Bearer ${mentorToken}`)
    .send({ company: 'TestCo' });
  // Create mentee profile
  await request(app)
    .put('/api/mentees/profile')
    .set('Authorization', `Bearer ${menteeToken}`)
    .send({ bio: 'Test Mentee' });
  // Create a topic
  const topicRes = await request(app)
    .post('/api/topics')
    .set('Authorization', `Bearer ${mentorToken}`)
    .send({ name: `Test Topic ${unique}` });
  const topicId = topicRes.body.topic.id;
  // Create mentor expertise
  const expertiseRes = await request(app)
    .post('/api/mentors/expertise')
    .set('Authorization', `Bearer ${mentorToken}`)
    .send({ topicId, price: 100, durationMinutes: 60 });
  const expertiseId = expertiseRes.body.expertise.id;
  // Create a slot
  const start = new Date(Date.now() + slotStartOffset).toISOString();
  const end = new Date(Date.now() + slotEndOffset).toISOString();
  const slotRes = await request(app)
    .post('/api/mentors/availability')
    .set('Authorization', `Bearer ${mentorToken}`)
    .send({ startDatetime: start, endDatetime: end });
  const slotId = slotRes.body.slot.id;
  const slotMentorId = slotRes.body.slot.mentorId;
  // Create booking
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
      menteeNotes
    });
  const bookingId = bookingRes.body.booking.id;
  return { mentorToken, menteeToken, topicId, expertiseId, slotId, slotMentorId, bookingId };
}

describe('Booking API', () => {
  test('should create a booking', async () => {
    const unique = Date.now() + Math.random();
    const { bookingId } = await setupBookingTest({ unique });
    const res = await request(app)
      .get(`/api/bookings/${bookingId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.booking).toBeDefined();
  });

  test('Mentor can approve a booking', async () => {
    const unique = Date.now() + Math.random();
    const { bookingId } = await setupBookingTest({ unique });
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}/approve`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.booking.status).toBe('CONFIRMED');
  });

  test('Mentor can reject a new booking', async () => {
    const unique = Date.now() + Math.random();
    const { bookingId } = await setupBookingTest({ unique });
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}/reject`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.booking.status).toBe('CANCELLED');
  });

  test('Mentor and mentee can view their bookings', async () => {
    const unique = Date.now() + Math.random();
    const { mentorToken, menteeToken } = await setupBookingTest({ unique });
    // Mentor view
    const mentorRes = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(mentorRes.statusCode).toBe(200);
    expect(Array.isArray(mentorRes.body.bookings)).toBe(true);
    // Mentee view
    const menteeRes = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${menteeToken}`);
    expect(menteeRes.statusCode).toBe(200);
    expect(Array.isArray(menteeRes.body.bookings)).toBe(true);
  });

  test('Mentor and mentee can view booking detail', async () => {
    const unique = Date.now() + Math.random();
    const { mentorToken, menteeToken, bookingId } = await setupBookingTest({ unique });
    // Mentor detail
    const mentorRes = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(mentorRes.statusCode).toBe(200);
    expect(mentorRes.body.booking).toBeDefined();
    // Mentee detail
    const menteeRes = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${menteeToken}`);
    expect(menteeRes.statusCode).toBe(200);
    expect(menteeRes.body.booking).toBeDefined();
  });

  test('Mentor can cancel a booking', async () => {
    const unique = Date.now() + Math.random();
    const { mentorToken, bookingId } = await setupBookingTest({ unique });
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.booking.status).toBe('CANCELLED');
  });

  test('Mentee can cancel a booking', async () => {
    const unique = Date.now() + Math.random();
    const { menteeToken, bookingId } = await setupBookingTest({ unique });
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${menteeToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.booking.status).toBe('CANCELLED');
  });
}); 