jest.setTimeout(30000);
const request = require('supertest');
const app = require('../src/app');
const { prisma } = require('../src/config/database');

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

describe('Booking API', () => {
  let mentorId, menteeId, topicId, expertiseId;

  test('should create a booking', async () => {
    const unique = Date.now() + Math.random();
    const mentorEmail = `mentor${unique}@test.com`;
    const menteeEmail = `mentee${unique}@test.com`;
    // Register and login mentor
    await request(app)
      .post('/api/auth/register')
      .send({ email: mentorEmail, password: 'TestPassword123!', name: 'mentor User', role: 'mentor' });
    const mentorLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: mentorEmail, password: 'TestPassword123!' });
    const mentorToken = mentorLoginRes.body.token;
    // Create mentor profile
    const mentorProfileRes = await request(app)
      .put('/api/mentors/profile')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ company: 'TestCo' });
    expect(mentorProfileRes.statusCode).toBe(200);
    // Fetch mentor profile
    const mentorObjRes = await request(app)
      .get('/api/mentors/profile')
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(mentorObjRes.statusCode).toBe(200);
    mentorId = mentorObjRes.body.mentor.id;
    // Register and login mentee
    await request(app)
      .post('/api/auth/register')
      .send({ email: menteeEmail, password: 'TestPassword123!', name: 'mentee User', role: 'mentee' });
    const menteeLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: menteeEmail, password: 'TestPassword123!' });
    const menteeToken = menteeLoginRes.body.token;
    // Create mentee profile
    const menteeProfileRes = await request(app)
      .put('/api/mentees/profile')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bio: 'Test Mentee' });
    expect(menteeProfileRes.statusCode).toBe(200);
    // Fetch mentee profile
    const menteeObjRes = await request(app)
      .get('/api/mentees/profile')
      .set('Authorization', `Bearer ${menteeToken}`);
    expect(menteeObjRes.statusCode).toBe(200);
    menteeId = menteeObjRes.body.mentee.id;
    // Create a topic
    const topicRes = await request(app)
      .post('/api/topics')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ name: `Test Topic ${unique}` });
    expect(topicRes.statusCode).toBe(201);
    topicId = topicRes.body.topic.id;
    // Create mentor expertise
    const expertiseRes = await request(app)
      .post('/api/mentors/expertise')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ topicId, price: 100, durationMinutes: 60 });
    expect(expertiseRes.statusCode).toBe(201);
    expertiseId = expertiseRes.body.expertise.id;
    // Create a slot
    const start = new Date(Date.now() + 3600000).toISOString();
    const end = new Date(Date.now() + 7200000).toISOString();
    const slotRes = await request(app)
      .post('/api/mentors/availability')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ startDatetime: start, endDatetime: end });
    expect(slotRes.statusCode).toBe(201);
    const slotId = slotRes.body.slot.id;
    const slotMentorId = slotRes.body.slot.mentorId;
    // Create booking
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({
        mentorId: slotMentorId,
        mentorExpertiseId: expertiseId,
        availabilitySlotId: slotId,
        startDatetime: start,
        endDatetime: end,
        totalPrice: 100,
        menteeNotes: 'Looking forward!'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.booking).toBeDefined();
  });

  test('Mentor can approve a booking', async () => {
    // Create a slot and booking
    const start = new Date(Date.now() + 3600000).toISOString();
    const end = new Date(Date.now() + 7200000).toISOString();
    const slotRes = await request(app)
      .post('/api/mentors/availability')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ startDatetime: start, endDatetime: end });
    expect(slotRes.statusCode).toBe(201);
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
        menteeNotes: 'Approve test'
      });
    expect(bookingRes.statusCode).toBe(201);
    const bookingId = bookingRes.body.booking.id;
    // Approve
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}/approve`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.booking.status).toBe('CONFIRMED');
  });

  test('Mentor can reject a new booking', async () => {
    // Create a slot and booking
    const start = new Date(Date.now() + 10800000).toISOString();
    const end = new Date(Date.now() + 14400000).toISOString();
    const slotRes = await request(app)
      .post('/api/mentors/availability')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ startDatetime: start, endDatetime: end });
    expect(slotRes.statusCode).toBe(201);
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
        menteeNotes: 'Reject test'
      });
    expect(bookingRes.statusCode).toBe(201);
    const bookingId = bookingRes.body.booking.id;
    // Reject with the correct mentor token
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}/reject`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.booking.status).toBe('CANCELLED');
  });

  test('Mentor and mentee can view their bookings', async () => {
    // Create a slot and booking
    const start = new Date(Date.now() + 3600000).toISOString();
    const end = new Date(Date.now() + 7200000).toISOString();
    const slotRes = await request(app)
      .post('/api/mentors/availability')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ startDatetime: start, endDatetime: end });
    expect(slotRes.statusCode).toBe(201);
    const slotId = slotRes.body.slot.id;
    const slotMentorId = slotRes.body.slot.mentorId;
    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({
        mentorId: slotMentorId,
        mentorExpertiseId: expertiseId,
        availabilitySlotId: slotId,
        startDatetime: start,
        endDatetime: end,
        totalPrice: 100,
        menteeNotes: 'View test'
      });
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
    // Create a slot and booking
    const start = new Date(Date.now() + 3600000).toISOString();
    const end = new Date(Date.now() + 7200000).toISOString();
    const slotRes = await request(app)
      .post('/api/mentors/availability')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ startDatetime: start, endDatetime: end });
    expect(slotRes.statusCode).toBe(201);
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
        menteeNotes: 'Detail test'
      });
    expect(bookingRes.statusCode).toBe(201);
    const bookingId = bookingRes.body.booking.id;
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
    // Create a slot and booking
    const start = new Date(Date.now() + 3600000).toISOString();
    const end = new Date(Date.now() + 7200000).toISOString();
    const slotRes = await request(app)
      .post('/api/mentors/availability')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ startDatetime: start, endDatetime: end });
    expect(slotRes.statusCode).toBe(201);
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
        menteeNotes: 'Cancel test'
      });
    expect(bookingRes.statusCode).toBe(201);
    const bookingId = bookingRes.body.booking.id;
    // Mentor cancels
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.booking.status).toBe('CANCELLED');
  });

  test('Mentee can cancel a booking', async () => {
    // Create a slot and booking
    const start = new Date(Date.now() + 3600000).toISOString();
    const end = new Date(Date.now() + 7200000).toISOString();
    const slotRes = await request(app)
      .post('/api/mentors/availability')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ startDatetime: start, endDatetime: end });
    expect(slotRes.statusCode).toBe(201);
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
        menteeNotes: 'Cancel test'
      });
    expect(bookingRes.statusCode).toBe(201);
    const bookingId = bookingRes.body.booking.id;
    // Mentee cancels
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${menteeToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.booking.status).toBe('CANCELLED');
  });
}); 