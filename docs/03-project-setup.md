# Step 2: Project Setup

## Structure

Inspired by Django architecture — clearly separated concerns.

```
mentorship-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/         ← Prisma models
│   │   ├── routes/
│   │   ├── services/       ← Business logic
│   │   ├── utils/
│   │   └── app.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Git

- Repo initialized
- Meaningful commits per task
- README scaffolded

## Docker

- Setup ready with `docker-compose.yml` for PostgreSQL container
- Prisma schema connected to Dockerized DB

## Next Step

- Implement auth flow
- Build basic mentor/mentee onboarding
- Create seed data for testing
