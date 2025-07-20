# 🧠 Intellectify Mentorship Platform — Engineering Writeup

## 🚀 Overview

This project is a fullstack mentorship booking platform designed as a take-home assignment for Intellectify. It allows **mentors** to offer 1:1 teaching sessions, and **mentees** to discover, book, and review them. The platform handles core flows like session creation, availability management, bookings, payments (mock), reviews, and basic rescheduling logic.

> Goal: Build a minimal but realistic system that balances simplicity, scalability, and developer productivity.

---

## 🛠️ Tech Stack & Rationale

| Layer     | Tech               | Rationale                                                                |
| --------- | ------------------ | ------------------------------------------------------------------------ |
| Backend   | Node.js + Express  | Rapid development, strong ecosystem                                      |
| Frontend  | React + TypeScript + Tailwind CSS | Type safety, component reusability, modern design system            |
| ORM       | Prisma             | Schema modeling + migrations + strong TS integration                     |
| DB        | PostgreSQL         | ACID-compliant relational DB — ideal for bookings and scheduling systems |
| Auth      | JWT + bcrypt       | Simple and stateless; fine for this scope                                |
| Container | Docker (optional)  | Dev parity and consistency across environments                           |
| Testing   | Jest               | Unit and integration tests for critical paths                            |

---

## 🧱 Project Structure

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
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navigation.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── MentorDiscoverySection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── BenefitsSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ui/
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── input.tsx
│   │   │       └── ... (other UI primitives)
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── .gitignore
│   ├── README.md
│   └── eslint.config.js
├── docker-compose.yml
└── README.md
```

---

## 🖌️ Frontend Homepage & Design System

- The homepage is built with a custom theme (deep green, neural accent, cream backgrounds, gradients) and a modular, accessible component system.
- All sections (Navigation, Hero, Mentor Discovery, How It Works, Benefits, Testimonials, CTA, Footer) are implemented as self-contained components.
- UI primitives (Button, Card, Input, etc.) are used throughout for consistency.
- Responsive, accessible, and visually balanced layouts.
- Custom scroll-triggered animations and interactive effects.
- See [docs/10-frontend-homepage.md](docs/10-frontend-homepage.md) for a detailed breakdown of the homepage, theme, and design system.

---

## 📚 Documentation

- [00-overview.md](docs/00-overview.md): Project overview and goals
- [01-planning.md](docs/01-planning.md): Planning and design decisions
- [02-schema-design.md](docs/02-schema-design.md): Database schema
- [03-project-setup.md](docs/03-project-setup.md): Project structure and setup
- [04-auth-system.md](docs/04-auth-system.md): Authentication system
- [05-onboarding-system.md](docs/05-onboarding-system.md): Onboarding system (mentor/mentee onboarding, expertise, availability)
- [06-booking-and-topics.md](docs/06-booking-and-topics.md): Booking and topics system (booking flow, topics management)
- [07-reviews.md](docs/07-reviews.md): Reviews system (review flow)
- [08-rescheduling.md](docs/08-rescheduling.md): Rescheduling system (rescheduling logic)
- [09-frontend-setup.md](docs/09-frontend-setup.md): Frontend setup and structure
- [10-frontend-homepage.md](docs/10-frontend-homepage.md): Frontend homepage, theme, and design system

---

## Roadmap

See [docs/roadmap.md](docs/roadmap.md) for the full development roadmap. Homepage and design system are now complete and API integration is next.

---

## License

MIT