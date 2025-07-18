const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const predefinedTopics = [
  { name: 'JavaScript', description: 'Programming language for web development.' },
  { name: 'Python', description: 'General-purpose programming language.' },
  { name: 'Career Advice', description: 'Guidance on tech careers and growth.' },
  { name: 'System Design', description: 'Best practices for designing scalable systems.' },
  { name: 'Frontend', description: 'UI/UX, React, CSS, and more.' },
  { name: 'Backend', description: 'APIs, databases, Node.js, and more.' },
  { name: 'DevOps', description: 'CI/CD, cloud, and infrastructure.' },
  { name: 'Interview Prep', description: 'Mock interviews and preparation.' }
];

async function main() {
  for (const topic of predefinedTopics) {
    await prisma.topic.upsert({
      where: { name: topic.name },
      update: {},
      create: {
        ...topic,
        isPredefined: true,
        isActive: true
      }
    });
  }
  console.log('Predefined topics seeded.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 