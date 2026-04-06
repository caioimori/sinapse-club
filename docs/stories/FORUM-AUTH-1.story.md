# Story AUTH-1: Login/Register UI Redesign — 50/50 Split with Visual Hero

## Overview

Redesign the authentication pages (login and register) from single-column centered cards to a modern 50/50 split layout: left side (50%) for form inputs, right side (50%) for platform copy + animated background. Follows market-standard UX pattern used by Stripe, GitHub, Vercel, etc.

**Source:** Forum Launch Polish (UX/UI Phase)

## Acceptance Criteria

### Layout Structure
- [x] **Given** a user navigates to `/login` or `/register`, **Then** on desktop (≥1024px) they see a full-height grid split: 50% form (left), 50% visual hero (right)
- [x] **Given** the layout on mobile (<1024px), **Then** it stacks vertically: form on top, visual hero hidden (responsive)
- [x] **Given** the split layout, **Then** both sides have equal height (full viewport height `min-h-dvh`)

### Left Side (Form)
- [x] **Given** the left form side, **Then** form is centered vertically and horizontally within its 50% column
- [x] **Given** the form layout, **Then** it maintains the existing UI: logo + login/register title, Google OAuth button, divider, email/password/username inputs, submit button, link to other form
- [x] **Given** the form, **Then** max-width is 400px to keep form readable
- [x] **Given** the form, **Then** padding is appropriate for white space (12-16px on left column for responsiveness)

### Right Side (Visual Hero)
- [x] **Given** a user views the right hero side, **Then** they see: platform tagline, 3 key feature cards (Forum, Courses, Gamification), member count avatar group
- [x] **Given** the hero side background, **Then** it uses a dark gradient (foreground → foreground/80)
- [x] **Given** the hero side, **Then** it has animated background shapes: 3 blurred circles (blue, purple, cyan) with staggered pulse animations
- [x] **Given** the feature cards, **Then** each has: icon (SVG), title (h3), description (small text), semi-transparent background with border and backdrop blur
- [x] **Given** the member count, **Then** it shows "Junte-se a mais de 1.000+ profissionais" with 3 avatar placeholders + "+998" badge

### Animations
- [x] **Given** the background shapes, **Then** they animate with CSS `animate-pulse` at staggered intervals (0s, 1s, 2s)
- [x] **Given** the animations, **Then** they are smooth and loop continuously without JavaScript (CSS-only)

### Responsive Behavior
- [x] **Given** viewport width < 1024px, **Then** the right hero side is `hidden` (using `hidden lg:flex`)
- [x] **Given** viewport width ≥ 1024px, **Then** both sides are visible and equal width

## Scope

### IN
- Component: `src/components/auth/auth-side-visual.tsx` (NEW) — Right hero side with copy + animations
- Update: `src/app/(auth)/login/page.tsx` — Use new split layout wrapper
- Update: `src/app/(auth)/register/page.tsx` — Use new split layout wrapper
- CSS animations for background shapes (using Tailwind `animate-pulse` + animation-delay)
- Responsive grid layout (50/50 on desktop, stack on mobile)

### OUT
- Changes to existing auth logic (keep Supabase auth as-is)
- Logo or branding changes
- Animation library dependencies (use CSS-only)

## Dependencies
- None (purely UI/UX enhancement)

## Complexity
**S (Small)** — Layout restructure + new visual component, no complex logic

## Assigned Agent
@developer (Dex)

## Technical Notes
- Use CSS Grid (`grid grid-cols-1 lg:grid-cols-2`) for 50/50 split
- Hero component should be client-rendered (`"use client"`) for animation setup
- Use Tailwind's `hidden lg:flex` for responsive visibility
- SVG icons can use Lucide React or inline SVG
- Animation delays in Tailwind: use inline `style={{ animationDelay: "1s" }}`
- Test responsive breakpoints: mobile (375px), tablet (768px), desktop (1024px)

## File List
- [x] `src/components/auth/auth-side-visual.tsx` (NEW)
- [x] `src/app/(auth)/login/page.tsx` (MODIFIED)
- [x] `src/app/(auth)/register/page.tsx` (MODIFIED)

## Status
- [ ] Draft
- [x] Ready
- [x] InProgress
- [ ] InReview
- [ ] Done

## Change Log
- **2026-04-05**: Story created for auth UI redesign (50/50 split layout with visual hero)
- **2026-04-05**: Validated and marked Ready for implementation
- **2026-04-05**: Implementation completed — 50/50 split layout, AuthSideVisual component with animations, responsive design
