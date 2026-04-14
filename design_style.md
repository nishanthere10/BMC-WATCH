my-app\.agents\skills\frontend-design\SKILL.md# UX4G Design System: UI Style Guide

This document captures the core design language, styling paradigms, and reusable component classes used in the `jansamadhan-ai` platform. The platform employs the **UX4G (Unified Experience for Government)** standard, mixing semantic CSS variables, custom `.cr-*` component abstractions, and standard Tailwind utilities. 

Provide this file to an AI agent to perfectly replicate this specific UI style in a new project without breaking existing application schemas or requiring ad-hoc Tailwind.

---

## 1. Core Visual Pillars

- **Thematic Goal:** Official, premium, and accessible government interface.
- **Light Mode ("Government White"):** Clean surfaces, deep blue accents, and subtle borders with noise filter textures.
- **Dark Mode ("Deep Neelam"):** Midnight blue (`#0A0F1E` to `#141929`), distinct dark-mode glass borders.

### Typography
- **Headings (`h1` - `h6`):** `Merriweather`, `DM Sans`, `system-ui`, `serif`.
- **Base Sans:** `IBM Plex Sans`, `system-ui`, `sans-serif`.
- **Mono:** `JetBrains Mono`, `Courier New`, `monospace`.

### Core Color Palette
- **Primary (Blue):** `#003366` -> `#0055A4` (var `--cr-blue-mid`)
- **Accent (Saffron/Orange):** `#F47920`
- **Success (India Green):** `#1A7A3E`
- **Danger (Alert Red):** `#B91C1C`
- **Warning (Amber):** `#92400E`

---

## 2. System Architecture

The styling does **not** rely purely on lengthy inline Tailwind classes. Instead, it relies heavily on custom CSS scope (`index.css`):
1. **Design Tokens:** Mapped to `:root` and `.dark` scoped under `--cr-*` variables.
2. **Shadcn Overrides:** Standard tailwind structural variables (e.g., `--primary`, `--background`) are strictly bound to `--cr-*` values.
3. **Class Components (`.cr-*`):** Specific structural DOM elements rely on encapsulated `.cr-*` classes (e.g. `.cr-card`, `.cr-btn`) to maintain consistency and enforce hover states, border radiuses, and complex transitions (like glassmorphism and inset shadows). 

Micro-layouts (spacing, flex alignment, max-widths) still use Tailwind utility classes (e.g., `flex items-center gap-2 max-w-7xl`).

---

## 3. Key Component Classes Reference

When creating UI layouts, aim to use these specific classes over raw tailwind classes:

### Layouts & Headings
- `.cr-page-header`: Wrapper for page intro.
- `.cr-page-title`: Large, bold header (`DM Sans` tight tracking).
- `.cr-page-subtitle`: Lightly muttered text beneath the title (`IBM Plex Sans`).
- `.cr-section-title`: Small uppercase Eyebrow text indicating table segments or section groups.

### Cards & Surfaces
- `.cr-card`: Default elevated surface. Has a built-in `12px` radius, borders, and a smooth `translateY(-2px)` hover effect with expanded shadow.
- `.cr-card-flat`: A non-interactive version of `.cr-card` without the hover movement.
- `.cr-glass`: Aggressive frosted glass effect with a backdrop filter (`blur(12px)`) and slightly opaque white/dark border.
- `.cr-glass-subtle`: Softer glass effect, good for navbars or secondary sticky tabs.
- `.cr-auth-bg`: Specific textured pattern for login pages (applies an SVG noise filter + tricolor radial gradients).
- `.cr-auth-panel`: A raised container specifically for Authentication forms inside the `.cr-auth-bg`.

### Interactive Elements (Buttons)
Buttons use the base `.cr-btn` combined with a variant:
- `.cr-btn-primary`: Solid blue.
- `.cr-btn-accent`: Solid saffron/orange (for CTAs).
- `.cr-btn-secondary`: Transparent with blue outline.
- `.cr-btn-ghost`: Invisible outline, muted text, great for tables or icon buttons.
- `.cr-btn-danger`: Solid Red.

### Forms & Inputs
- `.cr-label`: `13px` bold font label.
- `.cr-input`: Base text/select/textarea input. Uses `box-shadow: inset` and an animated blue outline when focused.

### Status Indicators (Badges & Alerts)
- **Badges:** Combine `.cr-badge` with a status variant: `.cr-badge-pending`, `.cr-badge-assigned`, `.cr-badge-progress`, `.cr-badge-resolved`, `.cr-badge-rejected`, `.cr-badge-low`, `.cr-badge-high`, `.cr-badge-critical`.
- **Alert Boxes:** Display contextual blocks: `.cr-info-box`, `.cr-error-box`, `.cr-success-box`, `.cr-warning-box`.

### Tables
- `.cr-table`: The root table tag wrapper. Gives auto-bordered rows, hover-states (light blue transparent background), and standardized padding.

---

## 4. Implementation Rules for New Projects

To port this style perfectly without messing up your UI logic pipeline:

1. **Copy the Root Stylesheet:** Take the `index.css` from the previous project completely. Incorporate it into your build. It handles the `@import` of the core Google Fonts and SVG Noise overlays. 
2. **Stick to `.cr-*` classes:** For UI elements you build, avoid using raw Shadcn or raw Tailwind unless it's strictly for spacing (`p-4`, `flex`, `gap-2`). For aesthetic parts, you **must substitute** your normal target DOM with classes like `<div className="cr-card p-6">`.
3. **Use Shadcn Sparingly:** Only use Shadcn UI components where complex logic dictates it (like accessible Modals/Dialogs or Tabs). For things like buttons, cards, tags, tables, swap them directly for the raw HTML tags tagged with `.cr-btn` or `.cr-badge`.
4. **Combine with Framer Motion:** The `.cr-*` components look best when orchestrated with entry animations (e.g. `<motion.div className="cr-card">`).
5. **Dark Mode Toggle:** Ensure `next-themes` or equivalent is used to toggle the root `.dark` HTML wrapper class, so the `var(--cr-*)` seamlessly switches over.
