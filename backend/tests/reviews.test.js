jest.setTimeout(30000);
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

describe('Review API', () => {
  let mentorToken, menteeToken, mentorId, menteeId, topicId, expertiseId, bookingId;

  beforeEach(async () => {
    // Register and login mentor
    const mentorEmail = `mentor${Date.now()}@test.com`;
    mentorToken = await registerAndLogin('mentor', mentorEmail);
    // Register and login mentee
    const menteeEmail = `mentee${Date.now()}@test.com`;
    menteeToken = await registerAndLogin('mentee', menteeEmail);
    // Create mentor profile
    await request(app)
      .put('/api/mentors/profile')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ company: 'TestCo' });
    // Fetch mentor profile
    const mentorObjRes = await request(app)
      .get('/api/mentors/profile')
      .set('Authorization', `Bearer ${mentorToken}`);
    mentorId = mentorObjRes.body.mentor.id;
    // Create mentee profile
    await request(app)
      .put('/api/mentees/profile')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bio: 'Test Mentee' });
    // Fetch mentee profile
    const menteeObjRes = await request(app)
      .get('/api/mentees/profile')
      .set('Authorization', `Bearer ${menteeToken}`);
    menteeId = menteeObjRes.body.mentee.id;
    // Create a topic
    const topicRes = await request(app)
      .post('/api/topics')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ name: `Test Topic ${Date.now()}` });
    topicId = topicRes.body.topic.id;
    // Create mentor expertise
    const expertiseRes = await request(app)
      .post('/api/mentors/expertise')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ topicId, price: 100, durationMinutes: 60 });
    expertiseId = expertiseRes.body.expertise.id;
    // Create a slot
    const start = new Date(Date.now() + 3600000).toISOString();
    const end = new Date(Date.now() + 7200000).toISOString();
    const slotRes = await request(app)
      .post('/api/mentors/availability')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ startDatetime: start, endDatetime: end });
    const slotId = slotRes.body.slot.id;
    // Create booking
    const bookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({
        mentorId,
        mentorExpertiseId: expertiseId,
        availabilitySlotId: slotId,
        startDatetime: start,
        endDatetime: end,
        totalPrice: 100,
        menteeNotes: 'Review test'
      });
    bookingId = bookingRes.body.booking.id;
    // Approve booking
    await request(app)
      .patch(`/api/bookings/${bookingId}/approve`)
      .set('Authorization', `Bearer ${mentorToken}`);
    // Fast-forward time: mark booking as completed
    await request(app)
      .patch(`/api/bookings/${bookingId}/complete`)
      .set('Authorization', `Bearer ${mentorToken}`);
  });

  test('mentee can create a review after completed booking', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bookingId, rating: 5, comment: 'Great session!' });
    expect(res.statusCode).toBe(201);
    expect(res.body.review).toBeDefined();
    expect(res.body.review.rating).toBe(5);
  });

  test('should prevent duplicate reviews for the same booking', async () => {
    await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bookingId, rating: 4 });
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bookingId, rating: 5 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });

  test('should validate review input', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bookingId, rating: 10 }); // invalid rating
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/validation/i);
  });

  test('should not allow mentor to create a review', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ bookingId, rating: 5 });
    expect(res.statusCode).toBe(403);
  });

  test('mentor and mentee can view booking review', async () => {
    // Create review
    await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bookingId, rating: 5, comment: 'Nice!' });
    // Mentor view
    const mentorRes = await request(app)
      .get(`/api/reviews/booking/${bookingId}`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(mentorRes.statusCode).toBe(200);
    expect(mentorRes.body.review).toBeDefined();
    // Mentee view
    const menteeRes = await request(app)
      .get(`/api/reviews/booking/${bookingId}`)
      .set('Authorization', `Bearer ${menteeToken}`);
    expect(menteeRes.statusCode).toBe(200);
    expect(menteeRes.body.review).toBeDefined();
  });

  test('public can view mentor reviews', async () => {
    // Create review
    await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bookingId, rating: 4, comment: 'Good!' });
    // Public view
    const res = await request(app)
      .get(`/api/reviews/mentor/${mentorId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.reviews)).toBe(true);
    expect(res.body.reviews.length).toBeGreaterThan(0);
  });
}); 