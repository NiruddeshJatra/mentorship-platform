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
    const start = new Date(Date.now() + 3600000).toISOString(); // 1 hour in future
    const end = new Date(Date.now() + 7200000).toISOString();   // 2 hours in future
    const slotRes = await request(app)
      .post('/api/mentors/availability')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ startDatetime: start, endDatetime: end });
    const slotId = slotRes.body.slot.id;
    const slotMentorId = slotRes.body.slot.mentorId;
    console.log('Mentor ID:', mentorId);
    console.log('Expertise ID:', expertiseId);
    console.log('Slot:', slotRes.body.slot);
    // Create booking
    const bookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({
        mentorId: slotMentorId, // Use mentorId from slot
        mentorExpertiseId: expertiseId,
        availabilitySlotId: slotId,
        startDatetime: start,
        endDatetime: end,
        totalPrice: 100,
        menteeNotes: 'Review test'
      });
    console.log('Booking creation status:', bookingRes.statusCode);
    console.log('Booking creation body:', bookingRes.body);
    bookingId = bookingRes.body.booking && bookingRes.body.booking.id;
    // Approve booking
    await request(app)
      .patch(`/api/bookings/${bookingId}/approve`)
      .set('Authorization', `Bearer ${mentorToken}`);
    // Fast-forward booking times to the past so it can be completed
    const { prisma } = require('../src/config/database');
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        startDatetime: new Date(Date.now() - 7200000), // 2 hours ago
        endDatetime: new Date(Date.now() - 3600000)    // 1 hour ago
      }
    });
    // Mark booking as completed
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
    // Register and login mentor
    const mentorEmail = 'mentor' + Date.now() + Math.random() + '@test.com';
    await request(app)
      .post('/api/auth/register')
      .send({ email: mentorEmail, password: 'TestPassword123!', name: 'Mentor User', role: 'mentor' });
    const mentorLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: mentorEmail, password: 'TestPassword123!' });
    const mentorToken = mentorLoginRes.body.token;

    // Register and login mentee
    const menteeEmail = 'mentee' + Date.now() + Math.random() + '@test.com';
    await request(app)
      .post('/api/auth/register')
      .send({ email: menteeEmail, password: 'TestPassword123!', name: 'Mentee User', role: 'mentee' });
    const menteeLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: menteeEmail, password: 'TestPassword123!' });
    const menteeToken = menteeLoginRes.body.token;

    // Create mentor profile
    await request(app)
      .put('/api/mentors/profile')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ company: 'TestCo' });
    // Create mentee profile
    await request(app)
      .put('/api/mentees/profile')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({});
    const menteeProfileRes = await request(app)
      .get('/api/mentees/profile')
      .set('Authorization', `Bearer ${menteeToken}`);
    const menteeProfileId = menteeProfileRes.body.mentee.id;

    // Create topic
    const topicRes = await request(app)
      .post('/api/topics')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ name: 'ReviewTopic' + Date.now(), description: 'desc' });
    const topicId = topicRes.body.topic.id;

    // Create expertise
    const expertiseRes = await request(app)
      .post('/api/mentors/expertise')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ topicId, price: 100, durationMinutes: 60 });
    const expertiseId = expertiseRes.body.expertise.id;

    // Create slot
    const start = new Date(Date.now() + 3600000).toISOString();
    const end = new Date(Date.now() + 7200000).toISOString();
    const slotRes = await request(app)
      .post('/api/mentors/availability')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ startDatetime: start, endDatetime: end });
    const slotId = slotRes.body.slot.id;
    const mentorProfileId = slotRes.body.slot.mentorId;

    // Create booking
    const bookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({
        mentorId: slotRes.body.slot.mentorId,
        mentorExpertiseId: expertiseId,
        availabilitySlotId: slotId,
        startDatetime: start,
        endDatetime: end,
        totalPrice: 100,
        menteeNotes: 'Review test'
      });
    const bookingId = bookingRes.body.booking.id;

    // Approve booking
    await request(app)
      .patch(`/api/bookings/${bookingId}/approve`)
      .set('Authorization', `Bearer ${mentorToken}`);

    // Set booking times in the past so it can be completed
    const { prisma } = require('../src/config/database');
    const pastStart = new Date(Date.now() - 7200000).toISOString();
    const pastEnd = new Date(Date.now() - 3600000).toISOString();
    await prisma.booking.update({
      where: { id: bookingId },
      data: { startDatetime: pastStart, endDatetime: pastEnd }
    });

    // Complete booking
    await request(app)
      .patch(`/api/bookings/${bookingId}/complete`)
      .set('Authorization', `Bearer ${mentorToken}`);

    // Create review
    await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ bookingId, rating: 5, comment: 'Great session!' });

    // Public view
    const res = await request(app)
      .get(`/api/reviews/mentor/${mentorProfileId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.reviews)).toBe(true);
    expect(res.body.reviews.length).toBeGreaterThan(0);
  });
}); 