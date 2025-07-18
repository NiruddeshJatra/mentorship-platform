const request = require('supertest');
const app = require('../src/app');

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
  let mentorToken, menteeToken, mentorId, menteeId, expertiseId, slotId, bookingId;
  const mentorEmail = `mentor${Date.now()}@test.com`;
  const menteeEmail = `mentee${Date.now()}@test.com`;

  beforeAll(async () => {
    mentorToken = await registerAndLogin('mentor', mentorEmail);
    menteeToken = await registerAndLogin('mentee', menteeEmail);
    // Get mentor/mentee IDs
    const mentorRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${mentorToken}`);
    mentorId = mentorRes.body.user.id;
    const menteeRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${menteeToken}`);
    menteeId = menteeRes.body.user.id;
    // Mentor creates expertise
    const topicRes = await request(app)
      .post('/api/topics')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ name: `Booking Topic ${Date.now()}` });
    const topicId = topicRes.body.topic.id;
    const expertiseRes = await request(app)
      .post('/api/mentors/expertise')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ topicId, price: 100, durationMinutes: 60 });
    expertiseId = expertiseRes.body.expertise.id;
    // Mentor creates availability slot
    const start = new Date(Date.now() + 3600000).toISOString();
    const end = new Date(Date.now() + 7200000).toISOString();
    const slotRes = await request(app)
      .post('/api/mentors/availability')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ startDatetime: start, endDatetime: end, isRecurring: false });
    slotId = slotRes.body.slot.id;
  });

  test('Mentee can create a booking', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({
        mentorId,
        mentorExpertiseId: expertiseId,
        availabilitySlotId: slotId,
        startDatetime: new Date(Date.now() + 3600000).toISOString(),
        endDatetime: new Date(Date.now() + 7200000).toISOString(),
        totalPrice: 100,
        menteeNotes: 'Looking forward!'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.booking).toBeDefined();
    bookingId = res.body.booking.id;
  });

  test('Mentor can approve a booking', async () => {
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}/approve`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.booking.status).toBe('CONFIRMED');
  });

  test('Mentor can reject a new booking', async () => {
    // Create another booking to reject
    const res1 = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({
        mentorId,
        mentorExpertiseId: expertiseId,
        availabilitySlotId: slotId,
        startDatetime: new Date(Date.now() + 10800000).toISOString(),
        endDatetime: new Date(Date.now() + 14400000).toISOString(),
        totalPrice: 100,
        menteeNotes: 'Please reject!'
      });
    const bookingToRejectId = res1.body.booking.id;
    const res2 = await request(app)
      .patch(`/api/bookings/${bookingToRejectId}/reject`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res2.statusCode).toBe(200);
    expect(res2.body.booking.status).toBe('CANCELLED');
  });

  test('Mentor and mentee can view their bookings', async () => {
    const mentorRes = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(mentorRes.statusCode).toBe(200);
    expect(Array.isArray(mentorRes.body.bookings)).toBe(true);
    const menteeRes = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${menteeToken}`);
    expect(menteeRes.statusCode).toBe(200);
    expect(Array.isArray(menteeRes.body.bookings)).toBe(true);
  });

  test('Mentor and mentee can view booking detail', async () => {
    const mentorRes = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(mentorRes.statusCode).toBe(200);
    expect(mentorRes.body.booking).toBeDefined();
    const menteeRes = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${menteeToken}`);
    expect(menteeRes.statusCode).toBe(200);
    expect(menteeRes.body.booking).toBeDefined();
  });

  test('Mentor can cancel a booking', async () => {
    // Create a new booking to cancel
    const res1 = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({
        mentorId,
        mentorExpertiseId: expertiseId,
        availabilitySlotId: slotId,
        startDatetime: new Date(Date.now() + 21600000).toISOString(),
        endDatetime: new Date(Date.now() + 25200000).toISOString(),
        totalPrice: 100,
        menteeNotes: 'Cancel test'
      });
    const bookingToCancelId = res1.body.booking.id;
    const res2 = await request(app)
      .patch(`/api/bookings/${bookingToCancelId}/cancel`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res2.statusCode).toBe(200);
    expect(res2.body.booking.status).toBe('CANCELLED');
  });

  test('Mentee can cancel a booking', async () => {
    // Create a new booking to cancel
    const res1 = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({
        mentorId,
        mentorExpertiseId: expertiseId,
        availabilitySlotId: slotId,
        startDatetime: new Date(Date.now() + 28800000).toISOString(),
        endDatetime: new Date(Date.now() + 32400000).toISOString(),
        totalPrice: 100,
        menteeNotes: 'Cancel test'
      });
    const bookingToCancelId = res1.body.booking.id;
    const res2 = await request(app)
      .patch(`/api/bookings/${bookingToCancelId}/cancel`)
      .set('Authorization', `Bearer ${menteeToken}`);
    expect(res2.statusCode).toBe(200);
    expect(res2.body.booking.status).toBe('CANCELLED');
  });
}); 