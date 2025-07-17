# Step 1: Database Schema Design

## Approach

Used Prisma to model relationships between core entities with normalized structure.

## Final Tables

- `users` — Shared user info
- `mentors` — Mentor-specific data
- `mentees` — Mentee-specific data
- `topics` — Predefined or mentor-created topics
- `mentor_expertise` — Core table mapping expertise + price + duration
- `availability_slots` — Recurring/one-time slots
- `bookings` — Booking record with status and payment info
- `reviews` — Post-session feedback
- `reschedule_requests` — (Optional) change of session time

## Relationship Diagram (WIP)
> Diagram will be added using DBML or dbdiagram.io once schema matures.

## Key Design Insights

- Avoided redundant `session_types` table by merging pricing into `mentor_expertise`
- Booking prevents double-book via DB constraint and atomic status change
- Separate `users`, `mentors`, `mentees` enables role-specific fields
