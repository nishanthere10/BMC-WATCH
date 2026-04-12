# BMC Watch — Premium Government Civic App Design System

## Design Goal

The product should feel:
- Trustworthy
- Official
- Clean
- Modern but government-friendly
- Easy to understand for all age groups
- Mobile-first
- Slightly premium without looking flashy

The visual direction should feel like a mix of:
- Government digital portals
- Modern civic dashboards
- Premium fintech trust UI
- Public infrastructure monitoring platform

The design should not feel startup-generic, neon, dark cyberpunk, or overly playful.

Instead, it should feel reliable, calm, official, and premium.

---

# Core Design Language

## New Visual Direction

The UI should feel like:
- A next-generation government platform
- Premium, interactive, and modern
- Strong UX4G influence
- Guided, intuitive, and highly visual
- Serious and trustworthy, but not boring
- Like the government finally invested in good design

Think of a mix between:
- Stripe dashboard polish
- Uber maps experience
- Linear spacing and motion
- Modern Indian fintech UX
- Smart city control center

The experience should feel alive.
The user should always know what to do next.
Every page should guide the user naturally with strong hierarchy, cards, highlights, chips, quick actions, and contextual prompts.

---

# Modern Government UX Principles

## Design Philosophy

The app should not look like an old government portal.

Avoid:
- Plain white pages
- Tiny text
- Too many tables
- Flat layouts
- Boring forms
- Too many borders
- Dense dashboard clutter
- Old-style sidebar admin panel feel

Instead use:
- Large rounded cards
- Strong spacing
- Large typography
- Layered panels
- Soft gradients
- Glassmorphism where useful
- Floating quick actions
- Interactive chips
- Hover states
- Skeleton loaders
- Progressive disclosure
- Smooth transitions
- Context-aware empty states

---

# Updated Color Direction

## Base Palette

```text
Background: #F4F7FB
Surface: rgba(255,255,255,0.75)
Primary Navy: #0F172A
Accent Blue: #2563EB
Accent Cyan: #38BDF8
Success Green: #16A34A
Danger Red: #DC2626
Warning Amber: #F59E0B
Muted Slate: #64748B
```

## Premium Surface Styles

Use layered backgrounds:

```text
bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100
```

Glass card style:

```text
bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_10px_40px_rgba(15,23,42,0.08)]
```

---

# Balanced UX4G Usage Strategy

Use UX4G utilities only where they genuinely improve spacing, responsiveness, and reusable patterns.

Do not make the UI feel like it was built entirely around utility presets.

The design should feel custom, premium, and intentional.

Use UX4G mostly for:
- Layout wrappers
- Section spacing
- Responsive grids
- Sticky panels
- Floating action areas

Recommended UX4G usage:

```text
ux4g-page-container
ux4g-section-spacing
ux4g-content-width
ux4g-dashboard-grid
ux4g-split-layout
ux4g-sticky-panel
ux4g-mobile-stack
```

Avoid overusing:

```text
ux4g-hover-glow
ux4g-hover-ring
ux4g-card-highlight
ux4g-progress-glow
ux4g-action-card
```

Most of the premium feel should come from:
- Strong layouts
- Clean spacing
- Large rounded cards
- Great typography
- Subtle motion
- Better hierarchy
- Guided interactions
- Smart empty states

---

# Navigation Design

The app should guide the user instead of making them think.

## Sticky Navbar

Use a floating sticky navbar with:
- Logo
- Nearby Works
- Scan QR
- Dashboard
- Report Issue
- Search bar
- Profile/ward selector

Style:

```text
sticky top-4 z-50 mx-auto max-w-7xl rounded-2xl border border-white/40 bg-white/75 backdrop-blur-xl shadow-lg
```

## Floating Quick Actions

Each page should have quick actions such as:
- Scan QR
- Nearby Works
- Report Problem
- View Dashboard

Use floating pills or chips.

---

# Homepage Redesign

## Hero Section

Use a premium split layout.

Left:
- Headline
- Subheadline
- CTA buttons
- Trust indicators

Right:
- Floating dashboard preview cards
- Mini map preview
- Project status widgets
- Delayed project alert card

Hero cards should overlap and animate slightly.

## Hero Motion

Use floating card animation:

```ts
animate={{ y: [0, -6, 0] }}
transition={{ repeat: Infinity, duration: 4 }}
```

---

# Nearby Works Page Redesign

This should be the strongest page visually.

## Layout

Top:
- Large page title
- Search input
- Filter chips
- Stat cards

Middle:
- Large map panel
- Floating project cards over the map
- Interactive filters on left or top

Bottom:
- Premium project card grid

## Project Card Style

Each project card should include:
- Large image header
- Status chip
- Completion progress ring
- Budget spent
- Contractor avatar/icon
- Location chip
- Quick action buttons

Card style:

```text
rounded-3xl bg-white/80 backdrop-blur-lg border border-white/50 shadow-[0_10px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300
```

---

# Project Details Page Redesign

The detail page should feel like a premium intelligence dashboard.

## Top Hero Panel

Large summary card with:
- Project title
- Status badge
- Ward
- Completion percent
- Timeline
- Budget spent
- Contractor info

## Layout Below

Left column:
- Timeline
- Reports
- Updates

Right column:
- Budget card
- Contractor card
- Mini map
- Quick actions

Use sticky side panel on desktop.

---

# Dashboard Redesign

Dashboard should feel like a command center.

## Use
- Large KPI cards
- Interactive charts
- Heatmap cards
- Ward rankings
- Delayed project feed
- Report activity feed

KPI cards should be visually rich with:
- Large number
- Icon background
- Trend indicator
- Supporting text

---

# Framer Motion Strategy

Animations should make the app feel premium and alive.

## Card Hover

```ts
whileHover={{ y: -6, scale: 1.01 }}
```

## Staggered Reveal

```ts
variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
    },
  },
}
```

## Map Card Floating Effect

```ts
animate={{ y: [0, -4, 0] }}
transition={{ repeat: Infinity, duration: 5 }}
```

## Page Transition

```ts
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.35 }}
```

---

# Interaction Design

The UI should always help users know what to do next.

Examples:
- Empty state should suggest nearby works
- Nearby page should suggest scanning QR
- Project page should suggest reporting issue
- Dashboard should suggest viewing delayed wards

Always include:
- Clear CTA buttons
- Secondary supporting action
- Helpful helper text
- Smart empty states

---

# Final Design Goal

The app should feel like:

"The government finally hired a world-class product design team and rebuilt their civic platform for 2026."

It should feel:
- Premium but approachable
- Official but modern
- Guided and interactive
- Trustworthy and polished
- Easy for non-technical users
- Visually rich without being overwhelming

Think:
- Modern fintech onboarding flow
- Premium map-based civic app
- Strong card hierarchy
- Context-aware actions
- Cleaner, friendlier government UX

The user should never feel lost.
Every page should naturally guide the user toward the next best action.

