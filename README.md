# 🧠 Intellectify Mentorship Platform — Engineering Writeup

## 🚀 Overview

This project is a fullstack mentorship booking platform designed as a take-home assignment for Intellectify. It allows **mentors** to offer 1:1 teaching sessions, and **mentees** to discover, book, and review them. The platform handles core flows like session creation, availability management, bookings, payments (mock), reviews, and basic rescheduling logic.

> Goal: Build a minimal but realistic system that balances simplicity, scalability, and developer productivity.

---

## 🚀 Core Features

### ✅ Completed
- **Authentication & Authorization**
  - Email/password and Google OAuth
  - JWT with HTTP-only cookies
  - Role-based access control
  - CSRF protection

- **Onboarding System**
  - Role-specific onboarding flows
  - Progress tracking
  - Data validation

- **Dashboard**
  - Mentor dashboard with session management
  - Mentee dashboard with learning progress
  - Upcoming sessions calendar
  - Performance metrics

- **Profile Management**
  - Unified profile interface
  - Role-specific fields
  - Media uploads
  - Social integration

### 🚧 In Progress
- Session booking system
- Video call integration
- Payment processing (Stripe)
- Review and rating system

---

## 🔐 Authentication & User Management (Updated)

- **Unified Authentication**: Combined login/registration flow with email/password and Google OAuth
- **Secure Session Management**: JWT with HTTP-only cookies and CSRF protection
- **Role-Based Access**: Enforced for mentors and mentees throughout the application
- **Onboarding Flows**: Customized, step-by-step onboarding for both mentors and mentees
- **Profile Management**: Comprehensive profile editing with role-specific fields
- **Modern UI/UX**: Clean, responsive interface with accessible components
- **Documentation**: See [`docs/11-auth-frontend-backend.md`](docs/11-auth-frontend-backend.md), [`docs/12-oauth-cors-fixes.md`](docs/12-oauth-cors-fixes.md), and [`docs/13-onboarding-dashboard-profile.md`](docs/13-onboarding-dashboard-profile.md) for detailed documentation.

---

## 🛠️ Tech Stack & Rationale

| Layer     | Tech               | Rationale                                                                |
| --------- | ------------------ | ------------------------------------------------------------------------ |
| Backend   | Node.js + Express  | Rapid development, strong ecosystem                                      |
| Frontend  | React + TypeScript + Tailwind CSS | Type safety, component reusability, modern design system            |
| ORM       | Prisma             | Schema modeling + migrations + strong TS integration                     |
| DB        | PostgreSQL         | ACID-compliant relational DB — ideal for bookings and scheduling systems |
| Auth      | JWT + bcrypt + Google OAuth | Simple, stateless, and user-friendly for demo scope                |
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

## 🧩 Schema Design & Relationships

### 1. `users` (shared)

Stores shared info: `id`, `email`, `password`, `name`, `role`, `bio`, `profile_image_url`.

> Decision: Central table for auth and shared data. Role determines relationship with `mentors` or `mentees`.

### 2. `mentors`

* FK to `users`
* Fields: `company`, `experience`, `base_hourly_rate`, `rating`

### 3. `mentees`

* FK to `users`
* Fields: `current_role`, `learning_goals`

### 4. `topics`

* Predefined list (e.g., "JavaScript", "Career Advice")
* Can be extended by mentors

### 5. `mentor_expertise`

* Many-to-many between `mentors` and `topics`
* Extra fields: `duration`, `price`

> Combines session type + pricing + expertise in a clean, normalized way.

### 6. `availability_slots`

* FK to `mentor`
* Fields: `start_time`, `end_time`, `is_recurring`, `recurrence_pattern`, `status`

> Handles both recurring and one-time slots.

### 7. `bookings`

* FK to `mentor`, `mentee`, `mentor_expertise`, `availability_slot`
* Fields: `status` (`pending`, `confirmed`, `completed`, `cancelled`), `payment_status`

> Includes atomic status transitions to avoid double-booking.

### 8. `reviews`

* FK to `booking`
* Fields: `rating`, `comment`

### 9. `reschedule_requests` (optional)

* FK to `booking`
* Fields: proposed new time(s), status (`pending`, `accepted`, `rejected`)

---

## 🔄 Booking Flow

**Mentee Journey:**

1. Browse mentors by topic, rating, company, price.
2. View session types & time slots.
3. Book a slot → booking status becomes `pending`.
4. Wait for mentor approval.
5. After session → leave review.

**Mentor Journey:**

1. Sign up, complete profile.
2. Select expertise and pricing → `mentor_expertise`
3. Set availability → `availability_slots`
4. Approve/reject booking requests
5. View reviews

---

## 🖌️ Frontend Homepage & Design System

- The homepage is built with a custom theme (deep green, neural accent, cream backgrounds, gradients) and a modular, accessible component system.
- All sections (Navigation, Hero, Mentor Discovery, How It Works, Benefits, Testimonials, CTA, Footer) are implemented as self-contained components.
- UI primitives (Button, Card, Input, etc.) are used throughout for consistency.
- Responsive, accessible, and visually balanced layouts.
- Custom scroll-triggered animations and interactive effects.
- See [docs/10-frontend-homepage.md](docs/10-frontend-homepage.md) for a detailed breakdown of the homepage, theme, and design system.

---

## 🧑‍💼 Onboarding System

The onboarding system enables mentors and mentees to complete and update their profiles, manage expertise and availability (for mentors), and search for mentors (for mentees). Key features include:

- **Mentor onboarding**: Profile completion/update, expertise management (add/update/delete), and availability management (add/update/delete, recurring slots, overlap validation).
- **Mentee onboarding**: Profile completion/update and mentor search (by topic, company, rating, price, with pagination and sorting).
- **Role-based access**: All onboarding endpoints require authentication; mentor/mentee-specific endpoints require the correct role.
- **Validation**: Joi schemas for all onboarding data (profile, expertise, availability, search queries).
- **Error handling**: Consistent error codes/messages for validation, authorization, and business logic errors (e.g., slot overlap, duplicate expertise).
- **Comprehensive tests**: All onboarding flows, validation errors, edge cases, and business rules.

See [`docs/05-onboarding-system.md`](docs/05-onboarding-system.md) for a detailed writeup, including challenges faced and solutions.

---

## 📚 Booking & Topics System

The booking system enables mentees to book sessions with mentors, and mentors to approve, reject, or cancel bookings. The topics system allows mentors to create new topics and all users to browse available topics. Both systems enforce robust validation, error handling, and are covered by comprehensive tests.

- **Booking**: Creation, approval, rejection, cancellation, listing, and detail endpoints. Double-booking is prevented by atomic checks and status transitions.
- **Topics**: Mentors can create new topics (with unique names), and all users can view the list of active topics. Duplicate topic names are blocked at both the application and database level.
- **Validation & Error Handling**: Joi schemas for all booking and topic data, consistent error codes/messages, and comprehensive test coverage.

See [`docs/06-booking-and-topics.md`](docs/06-booking-and-topics.md) for a detailed writeup, including challenges faced and solutions.

---

## 📝 Reviews & Rescheduling System

The reviews system enables mentees to leave feedback after completed sessions, and mentors to display public reviews on their profiles. The rescheduling system (planned) will allow users to propose and manage changes to booking times. Both systems enforce robust validation, error handling, and are (or will be) covered by comprehensive tests.

- **Reviews**: Mentees can leave one review per completed booking. Mentor ratings are updated automatically. Reviews are public on mentor profiles.
- **Rescheduling**: (Planned) Mentees or mentors can propose new times for a booking, with status tracking and validation.

See [`docs/07-reviews.md`](docs/07-reviews.md) for a detailed writeup, including challenges faced and solutions.

See [`docs/08-rescheduling.md`](docs/08-rescheduling.md) for a detailed writeup, including challenges faced and solutions.

---

## 💡 Key Decisions & Tradeoffs

See [docs/01-planning.md](docs/01-planning.md) for key design decisions and tradeoffs.

---

## 🧪 Testing Strategy

This project includes comprehensive unit and integration tests for authentication, JWT, password utilities, and validation logic.

### Running Tests

1. Ensure your test database is configured in your `.env` file (see `backend/tests/setup.js` for details).
2. From the `backend/` directory, run:

```bash
npm install
npm test
```

### Test Coverage
- **Authentication**: Registration, login, duplicate email, and invalid credentials.
- **JWT Utility**: Token signing, verification, and error handling.
- **Password Utility**: Hashing, verification, and negative cases.
- **Validation Utility**: Email validation (positive and negative cases).

### Adding More Tests
- Place new test files in `backend/tests/`.
- Use the provided setup/cleanup utilities for database isolation.

### Interpreting Results
- All tests should pass. Failures will be reported with details.
- For database-related errors, check your test DB connection and migrations.

---

## 📦 Setup & Deployment

```bash
git clone https://github.com/yourusername/intellectify-mentorship.git
cd mentorship-platform

# Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# Frontend
cd ../frontend
npm install
npm run dev
```

> Optional: `docker-compose up` to spin up DB and services.

---

## 📌 Logging & Error Handling

* API logs key actions: booking requests, rejections, reschedule proposals
* Uses proper HTTP status codes + error messages

---

## 📓 Final Thoughts

This assignment was approached as if I were building a lightweight, maintainable platform that could evolve over time. I tried to think like both a product manager (user flow), a backend engineer (data consistency), and a system designer (extensibility).

Some potential V2 features:

* Calendar integration
* Notifications
* Stripe integration for real payments
* Group sessions

---

## 📚 Documentation

- [Project Overview](docs/00-overview.md)
- [Planning](docs/01-planning.md)
- [Schema Design](docs/02-schema-design.md)
- [Project Setup](docs/03-project-setup.md)
- [Authentication System](docs/04-auth-system.md)
- [Onboarding System](docs/05-onboarding-system.md)
- [Booking & Topics](docs/06-booking-and-topics.md)
- [Reviews](docs/07-reviews.md)
- [Rescheduling](docs/08-rescheduling.md)
- [Frontend Setup](docs/09-frontend-setup.md)
- [Frontend Homepage](docs/10-frontend-homepage.md)
- [Auth: Frontend-Backend Integration](docs/11-auth-frontend-backend.md)
- [OAuth & CORS Fixes](docs/12-oauth-cors-fixes.md)
- [Onboarding, Dashboard & Profile](docs/13-onboarding-dashboard-profile.md)

---

## Roadmap

See [docs/roadmap.md](docs/roadmap.md) for the full development roadmap. Homepage, design system, and authentication are now complete. Next up: dashboard and onboarding UIs.

---

## License

MIT