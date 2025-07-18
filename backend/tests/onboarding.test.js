const request = require('supertest');
const app = require('../src/app');

// Helper functions and mock data would be defined here for registration, login, etc.
// For brevity, only structure and key tests are shown.

describe('Mentor Onboarding', () => {
  let mentorToken;
  let expertiseId;
  let slotId;

  beforeAll(async () => {
    // Register and login as mentor, get token
    // mentorToken = await getMentorToken();
  });

  test('should complete mentor profile', async () => {
    const res = await request(app)
      .put('/api/mentors/profile')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({
        company: 'TestCorp',
        experienceYears: 5,
        hourlyRate: 100,
        bio: 'Experienced mentor',
        profileImageUrl: 'http://example.com/img.png',
        linkedinUrl: 'http://linkedin.com/in/test',
        portfolioUrl: 'http://portfolio.com/test',
        timezone: 'UTC'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.mentor).toBeDefined();
  });

  test('should reject invalid mentor profile data', async () => {
    const res = await request(app)
      .put('/api/mentors/profile')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ hourlyRate: -10 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  test('should add expertise', async () => {
    const res = await request(app)
      .post('/api/mentors/expertise')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({
        topicId: 'some-topic-uuid',
        price: 50,
        durationMinutes: 60,
        description: 'JavaScript mentoring'
      });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.expertise).toBeDefined();
    expertiseId = res.body.expertise.id;
  });

  test('should get expertise', async () => {
    const res = await request(app)
      .get('/api/mentors/expertise')
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.expertise)).toBe(true);
  });

  test('should update expertise', async () => {
    const res = await request(app)
      .put(`/api/mentors/expertise/${expertiseId}`)
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ price: 60 });
    expect(res.statusCode).toBe(200);
    expect(res.body.expertise.price).toBe(60);
  });

  test('should delete expertise', async () => {
    const res = await request(app)
      .delete(`/api/mentors/expertise/${expertiseId}`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test('should add availability', async () => {
    const res = await request(app)
      .post('/api/mentors/availability')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({
        startDatetime: new Date(Date.now() + 3600000).toISOString(),
        endDatetime: new Date(Date.now() + 7200000).toISOString(),
        isRecurring: false
      });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.slot).toBeDefined();
    slotId = res.body.slot.id;
  });

  test('should get availability', async () => {
    const res = await request(app)
      .get('/api/mentors/availability')
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.availability)).toBe(true);
  });

  test('should update availability', async () => {
    const res = await request(app)
      .put(`/api/mentors/availability/${slotId}`)
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ endDatetime: new Date(Date.now() + 10800000).toISOString() });
    expect(res.statusCode).toBe(200);
    expect(res.body.slot).toBeDefined();
  });

  test('should delete availability', async () => {
    const res = await request(app)
      .delete(`/api/mentors/availability/${slotId}`)
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});

describe('Mentee Onboarding', () => {
  let menteeToken;

  beforeAll(async () => {
    // Register and login as mentee, get token
    // menteeToken = await getMenteeToken();
  });

  test('should complete mentee profile', async () => {
    const res = await request(app)
      .put('/api/mentees/profile')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({
        currentRole: 'Student',
        learningGoals: 'Learn Node.js',
        bio: 'Eager to learn',
        profileImageUrl: 'http://example.com/img.png',
        linkedinUrl: 'http://linkedin.com/in/mentee',
        portfolioUrl: 'http://portfolio.com/mentee',
        timezone: 'UTC'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.mentee).toBeDefined();
  });

  test('should reject invalid mentee profile data', async () => {
    const res = await request(app)
      .put('/api/mentees/profile')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ currentRole: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });
}); 