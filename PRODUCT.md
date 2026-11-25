# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Primary: hiring teams.** Hiring managers and recruiters for forward deployed engineer, AI engineering and software engineering roles. They usually arrive from an application, a LinkedIn profile or a referral, and spend a few minutes deciding whether to reach out. Success means they contact Andrew or move him forward.
- **Secondary: client and community contacts.** Nonprofits, mission-driven organizations and community peers (CodePath, MESA, SHPE) who might want to collaborate or hire him for AI or consulting work. Success means they send an inquiry.

## Product Purpose
A personal site that shows who Andrew is, what he is doing now and what he has built, so a visitor can judge fit quickly and get in touch.

## Positioning
- **Embedded AI builder.** Andrew works on-site with a mission-driven organization: as a Claude Corps Fellow he is placed with Foundation for Puerto Rico, and he ships AI tools for the people who use them. This is forward-deployed work, not tutorial projects.
- **Costa Rica → US → Puerto Rico.** He went from a networking technical degree in Costa Rica, to community college and CSU Sacramento, to an AI fellowship in San Juan. This cross-cultural path is part of his story.

## Operating Context
- Visitors usually open the site on a desktop browser during a hiring review, often in a tab next to LinkedIn or a resume. Mobile visits from LinkedIn links also happen.
- The site is static, hosted on GitHub Pages and deployed by GitHub Actions on pushes to `master`.

## Capabilities and Constraints
- **Stack:** React + TypeScript + Vite. All content lives in `src/data/content.ts`.
- **Contact:** the contact form posts to Formspree (`https://formspree.io/f/xayreogk`). The email address is shown; the phone number is **never** shown.
- **Claude Corps description:** keep it minimal: "Claude Corps Fellow · Foundation for Puerto Rico". Do not name partner organizations.
- **Layout:** browser-first, but designed so it works well on mobile.
- **Themes:** three. Dark is the default. The three are a red-dark theme (a red accent, possibly a different shade from the old `#ff004f`), a blue-dark theme, and a light theme.
- **Open decisions:**
  - whether to add a profile photo (none is in the repo now)
  - whether to add a Spanish version (English only for now)

## Brand Commitments
- Name: Andrew Solbjor. Title: Software Engineer · Forward Deployed Engineer · Claude Corps Fellow.
- The old site's red accent is history, not a binding constraint. The record of the old design is in `docs/legacy-design.md`.

## Evidence on Hand
- **Roles and dates** from the LinkedIn export (Nov 2026), already in `src/data/content.ts`.
- **Project images:** `public/projects/caneyouseeme.png` and `public/projects/medipal.png`.
- **Award:** CaneYouSeeMe won 1st place in the Health Hack track at Cruz Hacks 2026.
- **Missing, and must not be invented:**
  - impact metrics for the Claude Corps work, SparSafe or Asakana
  - testimonials
  - screenshots for LiNKFiiT and SparSafe
  - client details beyond the organization's name

## Product Principles
1. Lead with the current, real work: the Claude Corps placement comes first.
2. Show evidence, not adjectives. Every claim ties to a role, project or award that exists.
3. Make getting in touch easy from anywhere on the page.
4. Tell a person's story, not a template's: the path from Costa Rica to Puerto Rico is part of what makes him distinct.

## Accessibility & Inclusion
WCAG 2.2 AA contrast in all three themes, full keyboard navigation, and respect for `prefers-reduced-motion`.
