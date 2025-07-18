const { prisma } = require('../config/database');

/**
 * Get the mentor ID for a user
 * @param {string} userId - The user ID
 * @returns {Promise<string|null>} - The mentor ID or null if not found
 */
async function getUserMentorId(userId) {
  const mentor = await prisma.mentor.findUnique({
    where: { userId }
  });
  return mentor ? mentor.id : null;
}

/**
 * Get the mentee ID for a user
 * @param {string} userId - The user ID
 * @returns {Promise<string|null>} - The mentee ID or null if not found
 */
async function getUserMenteeId(userId) {
  console.log('Looking up mentee for userId:', userId);
  const mentee = await prisma.mentee.findUnique({
    where: { userId }
  });
  console.log('Mentee lookup result:', mentee);
  return mentee ? mentee.id : null;
}

module.exports = {
  getUserMentorId,
  getUserMenteeId
};