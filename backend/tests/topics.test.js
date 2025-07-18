const request = require('supertest');
const app = require('../src/app');

describe('Topics API', () => {
  let mentorToken;
  let menteeToken;
  let topicName = 'New Unique Topic';

  beforeAll(async () => {
    // Register and login as mentor and mentee, get tokens
    // mentorToken = await getMentorToken();
    // menteeToken = await getMenteeToken();
  });

  test('should fetch all topics', async () => {
    const res = await request(app)
      .get('/api/topics');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.topics)).toBe(true);
    expect(res.body.topics.length).toBeGreaterThan(0);
  });

  test('should allow mentor to create a new topic', async () => {
    const res = await request(app)
      .post('/api/topics')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ name: topicName, description: 'A unique topic for testing.' });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.topic).toBeDefined();
    expect(res.body.topic.name).toBe(topicName);
  });

  test('should reject duplicate topic creation', async () => {
    const res = await request(app)
      .post('/api/topics')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ name: topicName, description: 'Duplicate topic.' });
    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/already exists/i);
  });

  test('should reject invalid topic data', async () => {
    const res = await request(app)
      .post('/api/topics')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ name: '', description: 'Invalid' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  test('should reject non-mentor creating a topic', async () => {
    const res = await request(app)
      .post('/api/topics')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ name: 'Another Topic', description: 'Should fail' });
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/insufficient permissions/i);
  });
}); 