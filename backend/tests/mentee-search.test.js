const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Mentee Search API', () => {
  let menteeToken;
  let prisma;
  let menteeEmail;
  beforeAll(() => {
    prisma = global.__PRISMA__;
  });
  beforeEach(async () => {
    menteeEmail = 'search_test' + Date.now() + Math.random() + '@example.com';
    await request(app)
      .post('/api/auth/register')
      .send({
        email: menteeEmail,
        password: 'TestPassword123!',
        name: 'Search Test User',
        role: 'mentee'
      });
    // Login as mentee
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: menteeEmail,
        password: 'TestPassword123!'
      });
    menteeToken = res.body.token;
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });
  
  test('should search mentors with default parameters', async () => {
    const res = await request(app)
      .get('/api/mentees/mentors/search')
      .set('Authorization', `Bearer ${menteeToken}`);
    
    console.log('Response status:', res.statusCode);
    console.log('Response body:', res.body);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.mentors).toBeDefined();
    expect(res.body.pagination).toBeDefined();
  });
});