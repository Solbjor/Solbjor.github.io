---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface brief: Home (single-page portfolio)

**Scope:** the whole one-page site (`src/App.tsx` and its components). **Visitor mode:** Experience.

**Audience and job:** a hiring team, usually on desktop with LinkedIn open in another tab, deciding whether to reach out. Secondary visitors are client and community contacts.
**Action:** contact Andrew, via the email or the Formspree form.
**Proof:** real roles, dates and work bullets from content.ts; the CaneYouSeeMe and MediPal images; the Cruz Hacks award. Metrics and screenshots are missing and must not be invented.
**Constraints:** dark by default, with three themes (red-dark, blue-dark, light); no phone number; minimal Claude Corps wording; browser-first but works well on mobile; WCAG AA; reduced motion respected.

## Direction contract

THESIS: The site is a 1970s mission control room watching Andrew's career, which refuses the usual sticky-sidebar developer portfolio. Every section is a console on the floor, and the big front screen tracks the mission currently in progress.

OWN-WORLD: The consoles are a mission-room hardware palette:
- a warm grey-green enamel console body
- a black CRT glass screen with phosphor text
- amber and white status lamps, a red only for live or alert states
- 70s grotesk caps for console placards

There are three room-lighting states: red-dark ("Mars watch", red phosphor accents, the default), blue-dark ("Neptune watch", cyan phosphor) and light ("Day shift", a cream-paper flight plan with ink). It's recognizable with all content removed: placarded console bezels surround glass screens, with lamps beside them.

STORY: The visitor sees right away that Andrew is landed on his current mission, Claude Corps at Foundation for Puerto Rico. They see the earlier planets he's visited, each with a flag and a base whose modules are the work he did. They browse the payloads (projects), then open the COMMS console and send a message.

FIRST VIEWPORT: The whole first screen is a one-point-perspective view of the room from the back console row. It is drawn in SVG and fills the viewport, scaling as one picture.
- **Front wall:** one large screen plots the trajectory from Sol through every visited planet to the current one. That planet is drawn landed, with a lander, a flag and a blinking beacon.
- **Side screens:** the left one shows the selected mission's readout. The right one lists every mission as selectable lines, and selecting one moves the reticle on the big screen.
- **Console tiers:** they recede toward the wall, and each carries a lit placard naming its station (Missions, Payloads, Systems, Training, Comms). The placards are the real navigation links.
- **Your console:** your own flight console runs across the bottom edge, with the name in large display caps, the three-part title and the lit "Open comms" key, which is the primary action.

Below the first screen, each station opens as a close-up console. The mission log shows every visited planet's surface, with the flag planted and numbered base modules matching the work done.

FORM: The room composition was chosen in a surface round: "From the Back Row", position 1 on my grounded list. Surface seed: seed:93ca03d04d9c6865. The world itself is a user-pinned direction (seed: none (pinned)). In the user's words: "take the mission control idea, and expand on it, my "Now"/"Current Mission" shows me landed on a planet, and my prior missions are planets ive already been to with maybe a flag planted and a base built to show the work i did. Keep the 70s style, and instead of patches maybe make it different screens/consoles in mission control". It builds on the Mission Control card from the safer round, which was steered from the user's earlier note: "space themed... Sol System would be Home, and about me and so on".

Signature interaction: selecting a planet on the front screen swaps the mission console to that mission's base readout, and the planet zooms to show its flag and base modules. The project payload console rotates on a timer, with a visible HOLD key and keyboard support. Motion grammar: a CRT warm-up flicker happens once on load, trajectories plot by drawing their line, and all of it is off under reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Impact metrics, plus SparSafe and LiNKFiiT screenshots: the user will supply them.
- Profile photo: not decided.
