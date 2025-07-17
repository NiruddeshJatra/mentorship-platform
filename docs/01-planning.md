# Step 0: Planning

## Interview Brief Summary

Core requirement: build a functional mentorship booking platform with basic features like registration, session types, availability, bookings, and review.

### Key Role Flows

#### Mentor
- Register/Login
- Define session offerings (price, duration, topic)
- Set availability (recurring or one-time)
- Approve or decline booking requests
- View reviews
- Handle reschedule requests (optional)

#### Mentee
- Register/Login
- Browse/search mentors by topic, price, rating
- Book sessions and leave reviews
- Accept/reject reschedule proposals (optional)

---

### Design Questions & Decisions

| Topic | Question | Decision |
|-------|----------|----------|
| Roles | Can one user be both mentor & mentee? | ❌ No — strictly one role per user |
| Auth | OAuth or JWT? | ✅ JWT for simplicity |
| Topics | Predefined or custom? | ✅ Predefined list, extendable |
| Timezones | Use UTC or local time? | ✅ Asia/Dhaka for now |
| Booking approval | Auto or manual? | ✅ Manual approval by mentor |
