# Step 11: Authentication System (Frontend & Backend)

## Overview

This document details the implementation of the authentication system for the Intellectify Mentorship Platform, covering both backend and frontend. The system supports secure registration and login via email/password and Google OAuth, with robust validation, error handling, and a modern, accessible UI.

---

## Features Implemented

### 1. Email/Password Authentication
- **Registration**: Users register as mentor or mentee. Passwords are validated (min 8 chars) and securely hashed with bcrypt.
- **Login**: Users authenticate with email and password. On success, a JWT is issued and stored in the frontend.
- **Role-based Access**: JWT includes user role; backend middleware enforces access control.

### 2. Google OAuth Integration
- **Login/Register with Google**: Users can sign in or register using their Google account. If new, a user record is created with a placeholder password hash.
- **JWT Issuance**: After Google authentication, the backend generates a JWT and redirects the user to the frontend with the token.
- **Frontend Callback Handling**: The frontend captures the token, logs the user in, and updates the UI.

### 3. UI/UX
- **Dedicated Auth Layout**: Login and Register pages have a separate, gradient background and creamy card design, distinct from the main app.
- **Accessible Forms**: All fields are labeled, keyboard accessible, and provide clear error feedback.
- **OAuth Button**: Google login is visually distinct and accessible.

### 4. Security & Validation
- **Password Security**: Bcrypt hashing, minimum length enforced.
- **Input Validation**: Joi schemas for all auth endpoints; custom XSS protection for names.
- **CORS**: Backend configured to allow requests from the frontend origin.
- **Rate Limiting**: General and auth-specific rate limiting to prevent abuse.
- **Consistent Error Handling**: Standardized error codes/messages for validation, authentication, and JWT expiry.

---

## Key Decisions & Rationale

| Decision | Rationale |
|----------|-----------|
| JWT for session | Stateless, scalable, easy to use with frontend SPAs |
| Google OAuth | Lowers friction for new users, industry standard |
| Password min 8 chars | Balances security and usability for demo |
| Separate Auth Layout | Focused, distraction-free login/register experience |
| Placeholder password for OAuth users | Satisfies DB constraint, avoids password confusion |
| CORS enabled for dev | Allows local frontend-backend integration |

---

## Design Patterns & Extensibility

- **Context-based Auth State**: Frontend uses React Context to manage user state and JWT, making it easy to protect routes and update UI.
- **Modular Middleware**: Backend uses modular middleware for validation, error handling, and logging.
- **OAuth Extensibility**: Additional providers (GitHub, Facebook) can be added by extending the Passport strategy and frontend button.
- **Role-based Routing**: Navigation and dashboard links update based on user role, making the app easily extensible for more roles.

---

## Challenges & Solutions

### 1. CORS & API Connection
- **Challenge**: Frontend and backend on different ports caused CORS errors.
- **Solution**: Added CORS middleware to backend, configured allowed origin for dev.

### 2. Prisma User Creation for OAuth
- **Challenge**: Prisma schema required a password hash for all users, but OAuth users don't have a password.
- **Solution**: Store a placeholder hash for OAuth users (e.g., 'oauth_user_no_password').

### 3. Token Handling After OAuth
- **Challenge**: Passing the JWT from backend to frontend after Google login.
- **Solution**: Backend redirects to a dedicated frontend callback route with the token in the URL; frontend captures and stores it.

### 4. UI Consistency & Accessibility
- **Challenge**: Ensuring the auth pages were visually distinct but consistent with the main app, and fully accessible.
- **Solution**: Used a separate layout, creamy card, and accessible form components.

---

## How It Works (Flow)

1. **User visits /login or /register**
2. **Fills out form or clicks 'Continue with Google'**
3. **Frontend sends request to backend**
4. **Backend validates, creates user if needed, issues JWT**
5. **Frontend stores JWT, updates UI, and redirects to dashboard/home**
6. **For Google OAuth:**
   - User is redirected to Google, then back to backend
   - Backend creates user if needed, issues JWT, redirects to frontend callback
   - Frontend captures token, logs user in

---

## Extensibility & Next Steps

- Add more OAuth providers (GitHub, Facebook)
- Allow users to set a password after OAuth registration
- Add email verification and password reset flows
- Improve error messages and edge-case handling
- Add more granular role-based dashboards

---

## References
- [docs/04-auth-system.md](./04-auth-system.md) — Backend auth details
- [docs/09-frontend-setup.md](./09-frontend-setup.md) — Frontend setup
- [README.md](../README.md) — Project overview 