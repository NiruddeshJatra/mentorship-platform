# Step 8: Frontend Homepage & Design System

## Overview

The Intellectify frontend is built with Vite, React, TypeScript, and Tailwind CSS, using a custom theme and a modular, accessible component system. The homepage is designed for clarity, visual balance, and a modern, professional feel, with a focus on mentorship discovery and conversion.

---

## Theme & Design System

### Colors & Gradients

- **Primary:** Deep forest green (`#064E3B`)
- **Accent:** Neural teal/green (`#10B981`), soft orange (`#FB923C`)
- **Backgrounds:** Cream (`#FEF7ED`), white, and subtle gradients
- **Neural palette:** Custom CSS variables for primary, accent, growth, highlight, etc.
- **Gradients:** Used for hero, cards, and CTA backgrounds, always left-to-right or diagonal, with lighter tones on the left.

### Typography

- **Headers:** Poppins (bold, friendly, rounded)
- **Body:** Inter (high readability)
- **Line heights:** 1.3 for headers, 1.6 for body
- **Letter spacing:** 0.02em for body, slightly more for animated topics
- **Font weights:** 600+ for headers, 400–500 for body

### Spacing & Layout

- **Section padding:** 6–8rem vertical, consistent across all sections
- **Grid system:** Responsive, using Tailwind’s grid and flex utilities
- **Card radius:** Large, soft corners for all cards and buttons
- **Box shadows:** Subtle, for depth without distraction

---

## Component & File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── HeroSection.tsx
│   │   ├── MentorDiscoverySection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── CTASection.tsx
│   │   ├── Footer.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ... (other UI primitives)
│   ├── assets/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
```

- **UI primitives** in `components/ui/` are used throughout for consistency.
- **Section components** are modular, each responsible for a single homepage section.

---

## Homepage Section Breakdown

### 1. Navigation Bar
- Sticky, with scroll-triggered background and color change
- Logo and brand link to homepage
- Single “Login/Register” button, always visible

### 2. Hero Section
- Tabbed interface (Mentor/Mentee)
- Animated topic headline with typing effect
- “Mentorship” on a separate line
- CTA button with green gradient, arrow, and route

### 3. Mentor Discovery
- Search/filter bar (static for now)
- Responsive grid of mentor cards, each routes to `/mentor/:id`

### 4. How It Works
- 3-step process, icons, horizontal on desktop, vertical on mobile

### 5. Benefits
- Two-column layout: mentee and mentor benefits, minimal icons

### 6. Testimonials
- Grid of testimonial cards, company logos, stats

### 7. CTA Section
- Two routed CTA buttons, trust indicators, final message

### 8. Footer
- Company info, platform/support links, social, newsletter

---

## Routing & Navigation

- Uses `react-router-dom` for all navigation
- All homepage buttons/links route to correct pages
- Placeholder pages for `/login`, `/mentors`, `/mentors/apply`, etc.

---

## Animation & Effects

- Custom scroll-triggered fade/slide-in for each section (Intersection Observer + CSS)
- Typing animation for hero topics
- Animated underline for “Become a Mentor” CTA

---

## Accessibility & Responsiveness

- All interactive elements are keyboard accessible
- Color contrast meets WCAG 2.1 AA
- Responsive layouts for all breakpoints
- Focus indicators and ARIA labels where needed

---

## Design Rationale

- **Theme:** Chosen for trust, clarity, and modern appeal
- **Typography:** Poppins for approachability, Inter for readability
- **Spacing:** Generous, to avoid crowding and improve scanability
- **Componentization:** Each section is a self-contained, reusable component
- **Animation:** Used for engagement, but never at the expense of performance or accessibility

---

## Extending & Maintaining

- Add new sections as new components in `src/components/`
- Extend the theme in `tailwind.config.ts` and `index.css`
- Use UI primitives for all new UI
- Keep all navigation and data logic in sync with backend contracts

---

## Next Steps

- Integrate real API data for mentors, testimonials, etc.
- Implement authentication and onboarding flows
- Add error/loading states and further polish 