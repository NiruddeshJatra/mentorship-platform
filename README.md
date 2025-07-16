# 🧠 Intellectify Mentorship Platform — Engineering Writeup

## 🚀 Overview

This project is a fullstack mentorship booking platform designed as a take-home assignment for Intellectify. It allows **mentors** to offer 1:1 teaching sessions, and **mentees** to discover, book, and review them. The platform handles core flows like session creation, availability management, bookings, payments (mock), reviews, and basic rescheduling logic.

> Goal: Build a minimal but realistic system that balances simplicity, scalability, and developer productivity.

---

## 🛠️ Tech Stack & Rationale

| Layer     | Tech               | Rationale                                                                |
| --------- | ------------------ | ------------------------------------------------------------------------ |
| Backend   | Node.js + Express  | Rapid development, strong ecosystem                                      |
| Frontend  | React + TypeScript | Type safety, component reusability, mainstream frontend stack            |
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
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

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

> 🎯 Combines session type + pricing + expertise in a clean, normalized way.

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

## 💡 Key Decisions & Tradeoffs

| Question                             | Decision                              | Why                                                          |
| ------------------------------------ | ------------------------------------- | ------------------------------------------------------------ |
| Separate mentors/mentees tables?     | ✅ Yes                                 | Cleaner schema, easier for role-specific data                |
| Topics vs Session Types vs Expertise | ✅ Unified via `mentor_expertise`      | Avoids redundant tables, allows pricing/duration flexibility |
| Timezone handling                    | 🌍 Asia/Dhaka by default              | Simplifies MVP, can be converted later                       |
| Booking confirmation                 | ✅ Manual by mentor                    | Prevents double-booking conflicts                            |
| Recurring slots                      | ✅ Supported via pattern field         | Needed for long-term mentoring                               |
| Double booking prevention            | ✅ Via DB constraints & atomic updates | Ensures data integrity                                       |

---

## 🧪 Testing Strategy

* Unit tests for all core services (booking, auth, etc.)
* Integration tests for booking flow
* Simulated payment logic (mocked)

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

## 🔐 Authentication Flow

* JWT-based
* bcrypt for hashing
* Middleware for protected routes (`/bookings`, `/availability`)

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
