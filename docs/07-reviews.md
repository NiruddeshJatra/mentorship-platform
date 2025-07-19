# Step 7: Reviews System

## Overview
The reviews system enables mentees to leave feedback (rating and comment) for mentors after completed sessions. Reviews help maintain quality and trust on the platform. Each booking can have only one review, and mentor ratings are updated automatically.

---

## API Endpoints

### Create a Review
- **POST** `/api/reviews`
- **Description:** Mentee leaves a review for a completed booking
- **Body:**
  ```json
  {
    "bookingId": "<booking-uuid>",
    "rating": 5,
    "comment": "Great session!"
  }
  ```
- **Response:**
  - `201 Created` with the new review object

### List Reviews for a Mentor
- **GET** `/api/reviews/mentor/:id`
- **Description:** List all reviews for a mentor (public)
- **Response:**
  - `200 OK` with an array of reviews

### Get Review for a Booking
- **GET** `/api/reviews/booking/:id`
- **Description:** Get the review for a specific booking (mentor or mentee)
- **Response:**
  - `200 OK` with the review object

---

## Validation & Authorization
- Only the mentee of a completed booking can leave a review
- Only one review per booking (enforced at DB and application level)
- Rating must be an integer between 1 and 5
- Comment is optional, up to 1000 characters

## Database Constraints
- Unique constraint on `bookingId` in reviews table
- Foreign keys to mentee, mentor, and booking

## Test Coverage
- Review creation (mentee, after completed booking)
- Duplicate review prevention
- Validation errors (invalid rating, missing fields)
- Authorization (only mentee can review)
- Mentor/mentee can view booking review
- Public can view mentor reviews

## Future Improvements
- Add review reporting/moderation
- Allow mentors to respond to reviews
- Notification for new reviews 