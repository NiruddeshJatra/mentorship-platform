const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

// Create test database URL
const createTestDatabaseUrl = () => {
  const originalUrl = process.env.DATABASE_URL;
  return originalUrl.replace('mentorship_platform', 'mentorship_platform_test');
};

// Set up test database
const setupTestDB = async () => {
  const testDatabaseUrl = createTestDatabaseUrl();
  process.env.DATABASE_URL = testDatabaseUrl;
  
  try {
    // Run migrations on test database
    execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: testDatabaseUrl }
    });
    
    console.log('✅ Test database migrations completed');
    
    return new PrismaClient({
      datasources: {
        db: {
          url: testDatabaseUrl
        }
      }
    });
  } catch (error) {
    console.error('❌ Test database setup failed:', error);
    throw error;
  }
};

// Clean up test database
const cleanupTestDB = async (prisma) => {
  if (prisma) {
    // Clean up in reverse order of foreign key dependencies
    await prisma.booking.deleteMany();
    await prisma.review.deleteMany();
    await prisma.availabilitySlot.deleteMany();
    await prisma.mentorExpertise.deleteMany();
    await prisma.mentor.deleteMany();
    await prisma.mentee.deleteMany();
    await prisma.user.deleteMany();
    await prisma.topic.deleteMany();
    
    await prisma.$disconnect();
    console.log('🧹 Test database cleaned up');
  }
};

// Create test user data
const createTestUser = (overrides = {}) => {
  return {
    email: 'test@example.com',
    password: 'TestPassword123!',
    name: 'Test User',
    role: 'mentee',
    ...overrides
  };
};

const createTestMentor = (overrides = {}) => {
  return createTestUser({
    email: 'mentor@example.com',
    name: 'Test Mentor',
    role: 'mentor',
    ...overrides
  });
};

const createTestMentee = (overrides = {}) => {
  return createTestUser({
    email: 'mentee@example.com',
    name: 'Test Mentee',
    role: 'mentee',
    ...overrides
  });
};

module.exports = {
  setupTestDB,
  cleanupTestDB,
  createTestUser,
  createTestMentor,
  createTestMentee
}; 