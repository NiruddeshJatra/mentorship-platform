# Step 7: Reviews & Rescheduling System

## Overview

This document details the implementation of the Reviews and Rescheduling systems for the Intellectify Mentorship Platform. The Reviews system enables mentees to leave feedback after completed sessions, while the Rescheduling system (planned) will allow users to propose and manage changes to booking times. Both systems enforce robust validation, error handling, and are covered by comprehensive tests.

---

## Features Implemented

### Reviews System
- **Review Creation**: Mentees can leave a review (rating and comment) after a booking is marked as completed.
- **One Review per Booking**: Enforced at the application and database level.
- **Mentor Ratings**: Mentor's average rating and total reviews are updated automatically.
- **Public Mentor Reviews**: Anyone can view reviews for a mentor profile.
- **Booking Review Detail**: Mentor or mentee can view the review for a specific booking.
- **Validation**: All review data is validated using Joi schemas.

### Rescheduling System (Planned)
- **Reschedule Requests**: Mentees or mentors can propose new times for a booking (to be implemented).
- **Status Tracking**: Requests can be accepted or rejected (to be implemented).
- **Validation**: All reschedule data will be validated using Joi schemas.

---

## API Endpoints

### Reviews
- `POST /api/reviews` — Create a review (mentee, after completed booking)
- `GET /api/reviews/mentor/:id` — List reviews for a mentor (public)
- `GET /api/reviews/booking/:id` — Get review for a booking (mentor or mentee)

### Rescheduling (Planned)
- `POST /api/reschedule-requests` — Propose a new time for a booking
- `PATCH /api/reschedule-requests/:id/accept` — Accept a reschedule request
- `PATCH /api/reschedule-requests/:id/reject` — Reject a reschedule request

---

## Validation Rules

### Reviews
- **bookingId**: Must be a valid UUID and reference a completed booking for the mentee
- **rating**: Integer, 1–5
- **comment**: Optional, up to 1000 characters
- **One review per booking**: Enforced

### Rescheduling (Planned)
- **bookingId**: Must reference an existing booking
- **proposed times**: Must be valid ISO datetimes, not in the past
- **Status**: Only pending requests can be accepted/rejected

---

## Error Handling
- **Consistent error codes/messages** for validation, authorization, and business logic errors (e.g., duplicate review, invalid status)
- **409 Conflict** for duplicate reviews
- **400 Bad Request** for validation errors
- **403 Forbidden** for unauthorized actions
- **404 Not Found** for missing resources

---

## Challenges Faced

### Reviews
- **Booking Completion**: Ensuring reviews can only be left after a session is completed
- **Authorization**: Only the mentee for a booking can leave a review
- **Atomic Updates**: Updating mentor ratings and total reviews atomically
- **Test Isolation**: Ensuring each test creates its own users, bookings, and reviews

### Rescheduling
- **Status Transitions**: Ensuring only valid transitions (pending → accepted/rejected)
- **Time Validation**: Preventing reschedules to past times or overlapping slots

---

## Solutions & Key Decisions
- Used Prisma transactions for atomic review creation and mentor rating updates
- Enforced one review per booking at both application and DB level
- Standardized error handling and response formats
- Comprehensive Joi validation for all review data
- Provided comprehensive test coverage for all review scenarios
- Planned rescheduling system to follow similar patterns for validation and atomicity

---

## Test Coverage

### Reviews
- Review creation (mentee, after completed booking)
- Duplicate review prevention
- Validation errors (invalid rating, missing fields)
- Authorization (only mentee can review)
- Mentor/mentee can view booking review
- Public can view mentor reviews

### Rescheduling (Planned)
- Reschedule request creation, acceptance, rejection
- Validation errors and edge cases
- Role-based access and permissions

---

## Next Steps
- Implement rescheduling endpoints and business logic
- Integrate rescheduling with booking and notification flows
- Expand review system with reporting and moderation
- Enhance test coverage for rescheduling scenarios 