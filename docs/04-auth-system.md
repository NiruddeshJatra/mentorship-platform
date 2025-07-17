# Step 3: Authentication System

## Overview

This document details the implementation of the authentication system for the Intellectify Mentorship Platform. The system provides secure registration, login, logout, OAuth with Google, and role-based access for mentors and mentees, with robust validation, error handling, and comprehensive test coverage.

---

## Features Implemented

### 1. User Registration, Login & Logout
- **Registration**: Users register as either a mentor or mentee. The system enforces strong password requirements and validates all input fields using Joi.
- **Login**: Users authenticate with email and password. On success, a JWT is issued containing the user’s ID and role.
- **Logout**: Users can log out, which invalidates their session or JWT on the client side.

### 2. OAuth with Google
- Users can authenticate using their Google account via OAuth. On successful authentication, a JWT is issued and the user is registered/logged in as appropriate.

### 3. Role-Based Access
- Users are assigned a role (`mentor` or `mentee`) at registration, mapped to a Prisma enum.
- The role is included in the JWT and checked for protected routes.

### 4. Password Security
- Passwords are hashed using bcrypt before storage.
- Custom Joi validation ensures passwords are at least 12 characters, with uppercase, lowercase, number, and symbol.

### 5. Input Validation & XSS Protection
- All registration and login inputs are validated using Joi schemas.
- Custom validators prevent XSS by rejecting script tags in the `name` field.

### 6. Rate Limiting
- General and authentication-specific rate limiting is enforced using `express-rate-limit`.
- Rate limiting is disabled in the test environment to avoid test flakiness.

### 7. Error Handling
- Consistent error codes and messages for validation, authentication, and JWT errors.
- Expired JWTs return a specific error (`Token expired`), and invalid tokens are handled gracefully.

### 8. Comprehensive Testing
- Extensive test suites cover registration, login, OAuth, logout, validation, error cases, and security edge cases.
- Tests ensure correct handling of weak passwords, XSS attempts, duplicate users, JWT expiry, and OAuth flows.

---

## Challenges Faced

### Enum Mapping
- Mapping string roles from user input to Prisma enums required careful handling to avoid invalid data and test failures.

### Rate Limiting in Tests
- Rate limiting middleware interfered with repeated test runs, causing 429 errors. Solution: disable rate limiting when `NODE_ENV=test`.

### JWT Expiry Handling
- Ensuring that expired JWTs are correctly detected and return the expected error message/code required careful error propagation and middleware logic.

### Validation Consistency
- Aligning Joi validation errors with custom error codes (e.g., `WEAK_PASSWORD`) to match test expectations.

### Unique Constraints in Tests
- Tests creating users with the same email caused unique constraint errors. Solution: generate unique emails for each test run.

### OAuth Integration
- Integrating Google OAuth required handling user creation for new OAuth users and linking existing accounts, as well as managing JWT issuance for OAuth logins.

---

## Solutions & Key Decisions

- Used custom Joi validators for password strength and XSS protection.
- Disabled rate limiting in test environment for reliability.
- Standardized error handling for all authentication flows.
- Used unique test data to avoid database constraint issues.
- Added detailed tests for all edge cases and security scenarios.
- Implemented OAuth with Google for streamlined user onboarding and login.
- Provided logout functionality for both JWT and OAuth sessions.

---

## Test Coverage

- **Registration**: Valid and invalid data, duplicate users, XSS in name, weak passwords.
- **Login**: Valid and invalid credentials, rate limiting, JWT issuance.
- **Logout**: Ensures session/JWT is invalidated on the client side.
- **OAuth**: Google login, new user creation, existing user login, error handling.
- **JWT**: Expired and invalid tokens, protected route access.
- **Validation**: All error codes and messages are tested for consistency.

---

## Next Steps

- Implement Mentor & Mentee Onboarding: profile completion, expertise selection, and availability management for mentors; profile and learning goals for mentees.
- Expand test coverage for onboarding and booking flows.
- Document new onboarding API endpoints and validation rules.