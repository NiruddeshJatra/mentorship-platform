const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty'
});

// Connect to database
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Disconnect from database
const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log('🔌 Disconnected from database');
};

module.exports = {
  prisma,
  connectDB,
  disconnectDB
};