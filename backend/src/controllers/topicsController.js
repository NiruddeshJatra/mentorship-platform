const { prisma } = require('../config/database');

// Get all active topics
const getTopics = async (req, res, next) => {
  try {
    const topics = await prisma.topic.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json({ topics });
  } catch (error) {
    console.error('Get topics error:', error);
    error.statusCode = 500;
    error.code = 'GET_TOPICS_ERROR';
    next(error);
  }
};

// Create a new topic (mentor only)
const createTopic = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    // Check for duplicate
    const existing = await prisma.topic.findUnique({ where: { name } });
    if (existing) {
      const error = new Error('Topic already exists');
      error.statusCode = 409;
      error.code = 'TOPIC_EXISTS';
      return next(error);
    }
    const topic = await prisma.topic.create({
      data: {
        name,
        description,
        isPredefined: false,
        isActive: true
      }
    });
    res.status(201).json({ message: 'Topic created', topic });
  } catch (error) {
    // Handle unique constraint violation (race condition)
    if (error.code === 'P2002' && error.meta && error.meta.target && error.meta.target.includes('name')) {
      error.statusCode = 409;
      error.code = 'TOPIC_EXISTS';
      error.message = 'Topic already exists';
      return next(error);
    }
    console.error('Create topic error:', error);
    error.statusCode = 500;
    error.code = 'CREATE_TOPIC_ERROR';
    next(error);
  }
};

module.exports = { getTopics, createTopic }; 