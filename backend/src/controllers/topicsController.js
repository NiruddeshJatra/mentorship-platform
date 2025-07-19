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
    // Normalize name for duplicate check
    const normalized = name.trim().toLowerCase();
    const existing = await prisma.topic.findFirst({
      where: { name: { equals: normalized, mode: 'insensitive' } }
    });
    if (existing) {
      return res.status(409).json({ error: 'Topic already exists', code: 'TOPIC_EXISTS' });
    }
    const topic = await prisma.topic.create({
      data: {
        name: name.trim(),
        description,
        isPredefined: false,
        isActive: true
      }
    });
    res.status(201).json({ message: 'Topic created', topic });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTopics, createTopic }; 