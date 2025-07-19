# Step 6: Booking and Topics System

## Overview

This document details the implementation of the Booking and Topics systems for the Intellectify Mentorship Platform. The Booking system enables mentees to book sessions with mentors, and mentors to approve, reject, or cancel bookings. The Topics system allows mentors to create new topics and all users to browse available topics. Both systems enforce robust validation, error handling, and are covered by comprehensive tests.

---

## Features Implemented

### Booking System
- **Booking Creation**: Mentees can book available slots with mentors for specific expertise and time.
- **Approval & Rejection**: Mentors can approve or reject pending bookings.
- **Cancellation**: Both mentors and mentees can cancel bookings.
- **Listing & Detail**: Both parties can view their bookings and booking details.
- **Double-Booking Prevention**: Atomic checks and status transitions prevent double-booking.
- **Validation**: All booking data is validated using Joi schemas.

### Topics System
- **Topic Listing**: All users can view the list of active topics.
- **Topic Creation**: Mentors can create new topics (with unique names).
- **Duplicate Prevention**: Duplicate topic names are blocked at both the application and database level.
- **Validation**: All topic data is validated using Joi schemas.

---

## API Endpoints

### Booking
- `POST /api/bookings` — Create a booking (mentee)
- `PATCH /api/bookings/:id/approve` — Approve a booking (mentor)
- `PATCH /api/bookings/:id/reject` — Reject a booking (mentor)
- `PATCH /api/bookings/:id/cancel` — Cancel a booking (mentor or mentee)
- `GET /api/bookings` — List bookings for current user
- `GET /api/bookings/:id` — Get booking detail for current user

### Topics
- `GET /api/topics` — List all active topics (public)
- `POST /api/topics` — Create a new topic (mentor only)

---

## Validation Rules

### Booking
- **Required fields**: mentorId, mentorExpertiseId, availabilitySlotId, startDatetime, endDatetime, totalPrice
- **Slot availability**: Slot must be available and not already booked
- **Expertise**: Must match mentor and exist
- **Status transitions**: Only pending bookings can be approved/rejected/cancelled

### Topics
- **Name**: 2–100 characters, unique
- **Description**: Optional, up to 500 characters

---

## Error Handling
- **Consistent error codes/messages** for validation, authorization, and business logic errors (e.g., double booking, duplicate topic, invalid status)
- **409 Conflict** for duplicate topics
- **400 Bad Request** for validation errors
- **403 Forbidden** for unauthorized actions
- **404 Not Found** for missing resources

---

## Challenges Faced

### Booking
- **Atomicity**: Preventing double-booking required atomic DB checks and status updates
- **Role-based access**: Ensuring only mentors/mentees can perform certain actions
- **Edge cases**: Handling slot status, booking status transitions, and cancellations

### Topics
- **Race conditions**: Preventing duplicate topics even with concurrent requests
- **Unique constraint**: Enforcing uniqueness at both application and DB level

---

## Solutions & Key Decisions
- Used Prisma transactions and unique constraints for atomicity and data integrity
- Standardized error handling and response formats
- Comprehensive Joi validation for all booking and topic data
- Added duplicate topic check in both application logic and DB error handling
- Provided comprehensive test coverage for all booking and topics scenarios

---

## Test Coverage

### Booking
- Booking creation, approval, rejection, cancellation (mentor/mentee)
- Double-booking prevention
- Validation errors and edge cases
- Role-based access and permissions

### Topics
- Topic listing, creation (mentor only)
- Duplicate topic prevention
- Validation errors (invalid name, etc.)
- Role-based access (mentee cannot create)

---

## Next Steps
- Integrate booking with payment and review flows
- Expand topics with categorization and search
- Enhance booking notifications and reminders 