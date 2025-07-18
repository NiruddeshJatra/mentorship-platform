# Step 5: Onboarding System

## Overview

This document details the implementation of the onboarding system for the Intellectify Mentorship Platform. The onboarding system enables mentors and mentees to complete and update their profiles, manage expertise and availability (for mentors), and search for mentors (for mentees). The system enforces robust validation, error handling, and is covered by comprehensive tests.

---

## Features Implemented

### 1. Mentor Onboarding

- **Profile Completion & Update**:  
  Mentors can complete and update their profile with company, experience, hourly rate, bio, profile image, LinkedIn, portfolio, and timezone.
- **Expertise Management**:  
  Mentors can add, update, and delete areas of expertise, each linked to a topic, price, and session duration.
- **Availability Management**:  
  Mentors can create, update, and delete availability slots, including support for recurring slots and validation for overlapping times.
- **Validation**:  
  All profile, expertise, and availability inputs are validated using Joi schemas.

### 2. Mentee Onboarding

- **Profile Completion & Update**:  
  Mentees can complete and update their profile with current role, learning goals, bio, profile image, LinkedIn, portfolio, and timezone.
- **Mentor Search**:  
  Mentees can search for mentors by topic, company, rating, and price, with pagination and sorting options.
- **Validation**:  
  All profile inputs and search queries are validated using Joi schemas.

### 3. Role-Based Access

- All onboarding endpoints are protected and require authentication.
- Mentor-specific endpoints require the `mentor` role; mentee-specific endpoints require the `mentee` role.

### 4. Error Handling

- Consistent error codes and messages for validation, authorization, and business logic errors (e.g., slot overlap, duplicate expertise).
- 404 and 400 errors for missing or invalid resources.

### 5. Comprehensive Testing

- Test suites cover all onboarding flows, including profile completion, expertise and availability management, and mentor search.
- Tests ensure correct handling of validation errors, edge cases, and business rules.

---

## Challenges Faced

### Data Consistency

- Ensuring atomic updates to both user and role-specific tables (mentor/mentee) using Prisma transactions.

### Overlapping Availability

- Preventing mentors from creating overlapping availability slots required careful date validation and querying.

### Expertise Uniqueness

- Preventing duplicate expertise entries for the same topic for a mentor.

### Validation

- Aligning Joi validation with business rules (e.g., session durations, required fields for updates).

---

## Solutions & Key Decisions

- Used Prisma transactions for atomic profile updates.
- Implemented robust Joi schemas for all onboarding-related data.
- Added checks for overlapping slots and duplicate expertise.
- Standardized error handling and response formats.
- Provided comprehensive test coverage for all onboarding scenarios.

---

## API Endpoints

### Mentor Onboarding

- `POST /api/mentors/profile` — Complete mentor profile
- `PUT /api/mentors/profile` — Update mentor profile
- `GET /api/mentors/profile` — Get mentor profile
- `POST /api/mentors/expertise` — Add expertise
- `PUT /api/mentors/expertise/:id` — Update expertise
- `DELETE /api/mentors/expertise/:id` — Delete expertise
- `GET /api/mentors/expertise` — List expertise
- `POST /api/mentors/availability` — Add availability slot
- `PUT /api/mentors/availability/:id` — Update availability slot
- `DELETE /api/mentors/availability/:id` — Delete availability slot
- `GET /api/mentors/availability` — List availability slots

### Mentee Onboarding

- `POST /api/mentees/profile` — Complete mentee profile
- `PUT /api/mentees/profile` — Update mentee profile
- `GET /api/mentees/profile` — Get mentee profile
- `GET /api/mentees/mentors/search` — Search mentors

---

## Validation Rules

- **Mentor Profile**: Company, experience years, hourly rate, bio, image, LinkedIn, portfolio, timezone (all validated, some optional).
- **Expertise**: Topic ID (UUID), price (0–10000), duration (30/45/60/90/120 min), description (optional).
- **Availability**: Start/end datetime (ISO, end > start), recurring options, no overlap.
- **Mentee Profile**: Current role, learning goals, bio, image, LinkedIn, portfolio, timezone (all validated, some optional).
- **Mentor Search**: Topic, company, rating, price, sort, pagination.

---

## Test Coverage

- **Mentor**: Profile completion/update, expertise add/update/delete, availability add/update/delete, validation errors, slot overlap, duplicate expertise.
- **Mentee**: Profile completion/update, mentor search (all filters), validation errors.
- **Edge Cases**: Unauthorized access, missing/invalid resources, business rule violations.

---

## Next Steps

- Expand onboarding to support richer mentor/mentee profiles (e.g., skills, languages).
- Integrate onboarding with booking and session management.
- Enhance mentor search with more filters and recommendations.
- Document onboarding flows in user-facing guides. 