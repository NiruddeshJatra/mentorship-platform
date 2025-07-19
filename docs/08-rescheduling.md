# Step 8: Rescheduling System

## Overview
The rescheduling system allows mentors and mentees to propose new times for confirmed bookings. Either party can propose a new time, and the other party can accept or reject the request. Only one pending reschedule request is allowed per booking at a time.

---

## API Endpoints

### Propose a Reschedule
- **POST** `/api/reschedule-requests`
- **Description:** Propose a new time for a booking (mentor or mentee)
- **Body:**
  ```json
  {
    "bookingId": "<booking-uuid>",
    "proposedStart": "2025-07-20T15:00:00.000Z",
    "proposedEnd": "2025-07-20T16:00:00.000Z"
  }
  ```
- **Response:**
  - `201 Created` with the new reschedule request object

### Accept a Reschedule
- **PATCH** `/api/reschedule-requests/:id/accept`
- **Description:** Accept a pending reschedule request (only the non-proposing party)
- **Response:**
  - `200 OK` with the updated booking and request

### Reject a Reschedule
- **PATCH** `/api/reschedule-requests/:id/reject`
- **Description:** Reject a pending reschedule request (only the non-proposing party)
- **Response:**
  - `200 OK` with a message

---

## Validation & Authorization
- Only the mentor or mentee of the booking can propose, accept, or reject.
- Only one pending reschedule request per booking is allowed.
- Proposed times must be in the future and end after start.
- Only the non-proposing party can accept or reject.

## Database Constraints
- Foreign key with `onDelete: Cascade` ensures reschedule requests are deleted with their booking.
- Unique constraint: only one pending request per booking at a time (enforced in logic).

## Test Coverage
- Propose, accept, reject flows
- Validation and authorization errors
- Only one pending request per booking
- Booking time updates on accept

## Future Improvements
- Add notifications for reschedule events
- Allow reason/message with requests
- Admin/moderation tools for disputes 