const { setupTestDB, cleanupTestDB } = require('./setup');

let prisma;

beforeAll(async () => {
  prisma = await setupTestDB();
  global.__PRISMA__ = prisma;
});

afterAll(async () => {
  await cleanupTestDB(prisma);
});

// Clean up all tables before each test file
beforeEach(async () => {
  if (prisma) {
    await prisma.booking.deleteMany();
    await prisma.review.deleteMany();
    await prisma.availabilitySlot.deleteMany();
    await prisma.mentorExpertise.deleteMany();
    await prisma.mentor.deleteMany();
    await prisma.mentee.deleteMany();
    await prisma.user.deleteMany();
    await prisma.topic.deleteMany();
  }
}); 