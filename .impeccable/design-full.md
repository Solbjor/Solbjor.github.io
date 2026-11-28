---
name: Andrew Solbjor
description: A 1970s mission control room watching Andrew's career, lit in three watches.
colors:
  mars-room: "#121410"
  mars-enamel: "#282b24"
  mars-enamel-hi: "#33372e"
  mars-enamel-edge: "#4a5043"
  mars-plate: "#d8cfbb"
  mars-plate-ink: "#1a1512"
  mars-glass: "#0b0807"
  mars-phos: "#ffb24a"
  mars-phos-dim: "#c98d45"
  mars-signal: "#ff4d3a"
  mars-signal-ink: "#1a0a07"
  mars-text: "#ede5d6"
  mars-muted: "#b3a894"
  mars-orbit: "rgba(255, 178, 74, 0.16)"
  mars-scan: "rgba(0, 0, 0, 0.28)"
  neptune-room: "#0a0f15"
  neptune-enamel: "#1c242d"
  neptune-enamel-hi: "#26303b"
  neptune-enamel-edge: "#374452"
  neptune-plate: "#cdd6de"
  neptune-plate-ink: "#0b1118"
  neptune-glass: "#04080c"
  neptune-phos: "#7fe0ff"
  neptune-phos-dim: "#5aaecb"
  neptune-signal: "#ff6b5e"
  neptune-signal-ink: "#1a0807"
  neptune-text: "#e4ebf1"
  neptune-muted: "#a1afbc"
  neptune-orbit: "rgba(127, 224, 255, 0.16)"
  neptune-scan: "rgba(0, 0, 0, 0.3)"
  day-room: "#e4e4d6"
  day-enamel: "#cfd1bd"
  day-enamel-hi: "#d9dbc9"
  day-enamel-edge: "#a5a891"
  day-plate: "#2a2621"
  day-plate-ink: "#f3ecdc"
  day-glass: "#f7f2e6"
  day-phos: "#1f1b16"
  day-phos-dim: "#5b5346"
  day-signal: "#b8261a"
  day-signal-ink: "#fff6ef"
  day-text: "#1f1b16"
  day-muted: "#554d40"
  day-orbit: "rgba(31, 27, 22, 0.16)"
  day-scan: "transparent"
typography:
  display:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "4.6cqw"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 112"
  headline:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 2.6rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)"
    fontWeight: 750
    lineHeight: 1.15
    fontVariation: "'wdth' 108"
  title-sm:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.08rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  placard:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.14em"
    fontVariation: "'wdth' 125"
  label:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: "0.1em"
    fontVariation: "'wdth' 112"
  data:
    fontFamily: "'Martian Mono Variable', ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.08em"
  data-body:
    fontFamily: "'Martian Mono Variable', ui-monospace, monospace"
    fontSize: "0.8rem"
    fontWeight: 600
    lineHeight: 1.3
    fontFeature: "'tnum' 1"
rounded:
  plate: "3px"
  key: "4px"
  console: "6px"
  scene: "10px"
  glass: "12px"
  lamp: "50%"
spacing:
  space-1: "4px"
  space-2: "8px"
  space-3: "12px"
  space-4: "16px"
  space-5: "24px"
  space-6: "32px"
  space-7: "48px"
  space-8: "72px"
  bezel: "3px"
  gutter: "clamp(16px, 3vw, 40px)"
components:
  placard:
    backgroundColor: "{colors.mars-plate}"
    textColor: "{colors.mars-plate-ink}"
    typography: "{typography.placard}"
    rounded: "{rounded.plate}"
    padding: "7px 22px"
  plate-home:
    backgroundColor: "{colors.mars-plate}"
    textColor: "{colors.mars-plate-ink}"
    typography: "{typography.placard}"
    rounded: "{rounded.plate}"
    padding: "10px 26px"
  key:
    backgroundColor: "{colors.mars-enamel-hi}"
    textColor: "{colors.mars-text}"
    typography: "{typography.label}"
    rounded: "{rounded.key}"
    padding: "10px 16px"
    height: "44px"
  key-pressed:
    backgroundColor: "{colors.mars-phos}"
    textColor: "{colors.mars-glass}"
    rounded: "{rounded.key}"
  key-lit:
    backgroundColor: "{colors.mars-signal}"
    textColor: "{colors.mars-signal-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.key}"
    padding: "10px 16px"
    height: "44px"
  key-large:
    backgroundColor: "{colors.mars-signal}"
    textColor: "{colors.mars-signal-ink}"
    rounded: "{rounded.key}"
    padding: "14px 24px"
  key-small:
    backgroundColor: "{colors.mars-enamel-hi}"
    textColor: "{colors.mars-text}"
    rounded: "{rounded.key}"
    padding: "8px 12px"
  lamp:
    backgroundColor: "{colors.mars-phos-dim}"
    rounded: "{rounded.lamp}"
    size: "9px"
  lamp-landed:
    backgroundColor: "{colors.mars-signal}"
    rounded: "{rounded.lamp}"
    size: "9px"
  lamp-active:
    backgroundColor: "{colors.mars-phos}"
    rounded: "{rounded.lamp}"
    size: "9px"
  console:
    backgroundColor: "{colors.mars-enamel}"
    textColor: "{colors.mars-text}"
    rounded: "{rounded.console}"
    padding: "16px 24px 24px"
  glass:
    backgroundColor: "{colors.mars-glass}"
    textColor: "{colors.mars-text}"
    rounded: "{rounded.glass}"
    padding: "24px"
  station:
    backgroundColor: "{colors.mars-plate}"
    textColor: "{colors.mars-plate-ink}"
    typography: "{typography.placard}"
    rounded: "{rounded.plate}"
  station-hover:
    backgroundColor: "{colors.mars-phos}"
    textColor: "{colors.mars-glass}"
  station-lit:
    backgroundColor: "{colors.mars-signal}"
    textColor: "{colors.mars-signal-ink}"
  mission-line-selected:
    backgroundColor: "{colors.mars-phos}"
    textColor: "{colors.mars-glass}"
    rounded: "{rounded.plate}"
  tag:
    textColor: "{colors.mars-text}"
    rounded: "{rounded.plate}"
    padding: "4px 10px"
  field:
    textColor: "{colors.mars-text}"
    rounded: "{rounded.key}"
    padding: "12px 14px"
---

# Design System: Andrew Solbjor

<!-- This world replaced the legacy look recorded in docs/legacy-design.md (the 2023-2025 hand-written site: #181515 ground, #ff004f hot pink-red accent, default sans-serif, lift-on-hover cards and gradient overlays). None of those values carry forward. -->

## Overview

**Creative North Star: "The Back Row of Mission Control"**

The site is a 1970s mission control room, seen from the back console row, watching Andrew's career as a flight in progress. Every section is a console: a warm enamel body, a screwed-on cream placard naming the station, a recessed CRT glass screen, and status lamps. The first viewport is not a hero layout but a single picture: a one-point-perspective SVG room whose front-wall screen plots the trajectory from Sol through every past mission to the planet Andrew is landed on now.

The system is built from hardware, not from cards. Depth comes from enamel sitting on the room and glass sinking into enamel. Colour is room lighting: three watches (Mars, Neptune, Day) swap the whole palette through one `data-watch` attribute on the root, and no component carries a colour of its own. Type is two voices: a wide grotesk (Archivo) for placards, names and controls, and a monospace instrument face (Martian Mono) for dates, statuses and readouts.

This world replaced the legacy look recorded in `docs/legacy-design.md`. The old hot pink-red accent, its gradient hover overlays and its lift-on-hover cards are history, not inheritance.

**Key Characteristics:**
- One-point-perspective SVG room on a 1440x900 canvas, with HTML overlays placed in canvas percentages.
- Consoles (enamel) hold glass (CRT); glass holds phosphor text and scanlines.
- Every section is named by a screwed cream placard; the placards in the room are the real navigation.
- Three watches swap every colour token at once: Mars (red-dark, default), Neptune (blue-dark), Day (light, cream-paper flight plan).
- Signal red is reserved for what is live, what is planted, the primary key, and focus.
- Planets, flags and base modules turn the work history into geography.
- Motion is instrumental and rare: a CRT warm-up, the trajectory plotting in, a beacon, a planet zoom. All of it is off under reduced motion.

## Colors

The palette is room lighting: the same fifteen roles exist in every watch, and only their values change.

Each frontmatter key is `<watch>-<role>`. In code each role is one CSS custom property (`--room`, `--enamel`, `--phos`, and so on) defined three times in `src/index.css`: on `:root` and `[data-watch='mars']`, on `[data-watch='neptune']`, and on `[data-watch='day']`. Components only ever reference the role variable, never a watch value.

### Primary
- **Phosphor** (`phos`; Mars amber, Neptune cyan, Day ink): the light of the glass. Trajectory line, Sol, lander and module ink, data headings on glass, field labels, pressed keys, the hovered station, the selected mission line.
- **Dim Phosphor** (`phos-dim`): secondary phosphor. Plot labels, mission dates and sites in readouts, the idle lamp, the "Full trajectory" key border.

### Secondary
- **Signal** (`signal`; Mars warning red, Neptune coral, Day oxblood): the one alert colour. The landed lamp and status, the planted flags, the landed planet's beacon, the selection reticle, the "Now" plot label, the lit Comms station, lit keys (Open comms, Transmit, Open project), the HOLD flag, link failure text, the focus ring and text selection.
- **Signal Ink** (`signal-ink`): the text colour on any signal fill. Always paired with signal, never with anything else.

### Neutral
- **Room** (`room`): the page ground and the darkest scene planes (ceiling, floor are mixes of room and enamel).
- **Enamel / Enamel High / Enamel Edge** (`enamel`, `enamel-hi`, `enamel-edge`): the console body, the key face and the desk tops, and every 1px console border, bezel rule and tag outline.
- **Plate / Plate Ink** (`plate`, `plate-ink`): placards, the header home plate, the stations and the bottom flight console. In Day the plate inverts to a dark plate with cream ink.
- **Glass** (`glass`): the CRT screen fill. Near-black in the dark watches, cream paper in Day.
- **Text / Muted** (`text`, `muted`): body copy on enamel and glass; muted for organisations, descriptions, metadata and the footer.
- **Orbit** (`orbit`, phosphor at 16%): orbit rings on the plot and the dashed dividers between log rows and training lines.
- **Scan** (`scan`): the scanline stripe on glass. Transparent in Day, so paper has no scanlines.

Planet bodies are the one colour family outside the tokens: each mission is assigned a hue from a fixed list (28, 200, 140, 260, 45, 175, 320, 12) and drawn as `hsl(hue 32% 46%)` with a `hsl(hue 38% 28%)` terminator. They are the same in every watch.

### Named Rules
**The Room Lighting Rule.** A watch is a lighting change, not a theme skin: every colour role exists in all three watches, components use only role variables, and adding a colour means adding it to all three blocks in `src/index.css`.

**The Rare Signal Rule.** Signal red marks only what is live (landed, alert, failure), what is planted (flags, beacon, reticle), the primary action, and focus. Text on a signal fill is always `signal-ink`, never white.

**The Phosphor Belongs to Glass Rule.** Phosphor colours are the glass's own light. On enamel they appear only as a lit key face (pressed, hovered station, selected line), never as body text.

## Typography

**Display Font:** Archivo Variable (with Helvetica Neue, Arial, sans-serif)
**Body Font:** Archivo Variable
**Label/Mono Font:** Martian Mono Variable (with ui-monospace, monospace)

Both variable families are self-hosted. The Fontsource packages are declared in `package.json`, and `src/index.css` imports their width-axis stylesheets.

**Character:** Archivo, stretched wide on its width axis, is the 70s console grotesk: engraved placards and bold capitals. Martian Mono is the instrument readout: every date, status, channel number and plot label speaks in it.

### Hierarchy
- **Display** (800, 4.6cqw, 0.95, width 112%, uppercase, -0.015em): the name on the flight console only. Below 900px it becomes `clamp(2.2rem, 8vw, 3.6rem)`.
- **Headline** (800, clamp(1.8rem, 3vw, 2.6rem), 1, width 112%, uppercase): the payload (project) name.
- **Title** (750, clamp(1.5rem, 2.6vw, 2.1rem), 1.15, width 108%, balanced): the comms lead line. The side-screen role readout uses the same weight at max(1.2cqw, 15px).
- **Title small** (700, 1.08rem, 1.3): mission log row headings, stepping to 1.35rem for featured missions and 1.6rem for the landed one.
- **Body** (400, 1rem, 1.6): all running copy. Summaries cap at 70ch, module lists at 72ch, payload descriptions at 52ch.
- **Placard** (700, 0.8rem, width 125%, 0.14em, uppercase): placards, the home plate (0.95rem) and stations (max(1.05cqw, 11px)).
- **Label** (650, 0.78rem, width 112%, 0.1em, uppercase): keys and watch-switch positions.
- **Data** (Martian Mono 600, 0.72rem, 0.08em, uppercase): statuses, list heads, channel indicator, field labels, system headings. Dates use tabular numerals.

### Named Rules
**The Two Voices Rule.** Archivo names things and asks for action; Martian Mono reports measurements. A date, status, count or coordinate is always mono; a name, role or control is always Archivo.

**The Floored Scale Rule.** Type inside the room scales with the scene in `cqw` and always carries a px floor: `max(<n>cqw, <px>)`, with 11px the minimum for labels and 12px for side-screen copy.

## Layout

The page is a single column of consoles inside `.room` (max 1440px, gutter `clamp(16px, 3vw, 40px)`), stacked with a 48px gap: the flight scene, the mission log, payloads, a two-column bank of Systems and Training, and Comms. Spacing follows a 4/8/12/16/24/32/48/72px scale (`--space-1` to `--space-8`); console bezels and the header and footer rules are 3px.

**The scene grammar.** The first viewport is one SVG drawn on a fixed 1440x900 canvas in one-point perspective: ceiling, two side walls and a floor converge on a front wall (140,56 to 1300,470). The front wall holds the main glass (the trajectory plot, its own 960x495 viewBox nested at 400,84). Two side glasses flank it. Two console tiers recede toward the wall, and the bottom 164px is your own flight console. The scene element is a container (`container-type: inline-size`) with `aspect-ratio: 1440 / 900` and width `min(100%, (100svh - 84px) * 1.6)`, so the whole room fits the viewport and scales as one picture.

HTML that must be real (station links, side-screen readouts, the name and the Open comms key) is overlaid in absolute position using canvas coordinates converted to percentages (`x / 1440`, `y / 900`), so it stays registered to the drawing at any size. Overlay type and padding are in `cqw`, floored in px.

### Responsive (desktop-first)
- **> 1180px:** the full room. The header console keys are hidden (`visibility: hidden` above 720px); the stations in the scene are the navigation.
- **≤ 1180px:** the side-screen overlays and the in-scene zoom-out key drop out; the readout and mission list move below the scene as two glass panels (`.scene-fallback`).
- **≤ 1100px:** mission log rows go from three columns (200px / text / 260px surface) to two, with the surface under the text.
- **≤ 900px:** single column for the bank, comms and payload bay. The scene loses its fixed aspect ratio: the SVG keeps 1440/900 and the flight console becomes a static plate strip under it, with rem-based display type.
- **≤ 720px:** the phone crop. The SVG viewBox narrows to `300 40 840 540` (the front wall), stations are hidden, only the "Now" and Sol plot labels remain (Now enlarged to 34px), the fallback panels stack, header keys reappear as a horizontally scrolling strip, consoles and glass tighten to 12-16px padding, and Open comms goes full width.
- **≤ 560px:** the header stacks and the watch switch compresses.

### Named Rules
**The One Picture Rule.** The first viewport is a single drawing that scales as a whole. Every overlay in the room is positioned in canvas coordinates; flex and grid are used only inside an overlay, never to place one.

## Elevation & Depth

Depth is physical: enamel stands off the room, glass sinks into enamel. There is no card-lift vocabulary.

### Shadow Vocabulary
- **Console stand-off** (`box-shadow: 0 22px 44px -30px rgba(0,0,0,0.7)`): every console section; a long, soft, low shadow.
- **Glass recess** (`box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 40px rgba(0,0,0,0.55)`): CRT vignette on every glass panel. In Day: `inset 0 0 0 1px rgba(0,0,0,0.05), inset 0 0 24px rgba(60,45,20,0.12)`.
- **Key travel** (`box-shadow: inset 0 1px 0 color-mix(in srgb, var(--text) 18%, transparent), 0 3px 0 color-mix(in srgb, var(--enamel-edge) 72%, black), 0 4px 4px rgba(0,0,0,0.35)`, pressing to `0 1px 2px -1px` with a 1px drop): physical key presses.
- **Station set-in** (`box-shadow: 0 0.2cqw 0.5cqw -0.1cqw rgba(0,0,0,0.5)`): placards set into the console tiers.

Glass also carries scanlines: a 2px-transparent / 1px-`scan` repeating stripe over every glass panel and an SVG pattern over the scene screens.

### Named Rules
**The Enamel and Glass Rule.** Surfaces are either enamel (raised, soft drop shadow) or glass (recessed, inset vignette, scanlines). Nothing floats, and hover never lifts an element.

## Shapes

Small, machined radii: plates 3px, keys and fields 4px, consoles 6px, the scene 10px, glass 12px (the softest corner, as a CRT tube is). Plates and placards carry two 5px screw heads, one at each end. Lamps are 9px circles: filled for a state, an empty 1.5px ring for "complete" and for unselected watch positions. Base modules are arches (40x27 domes on the surface view; `10px 10px 2px 2px` numbered badges in lists). The reticle is four corner brackets, not a circle. Dividers inside glass are dashed `orbit` lines.

## Components

### Placard and Plate
Engraved, screwed-on name plates. **Shape:** 3px corners with two screw heads (5px dots mixed from plate-ink at 45%). **Colour:** plate on plate-ink, placard type, 7px 22px padding. Every console section's `h2` is a placard. The header home plate is a larger plate (0.95rem, 10px 26px) with a 12px signal sun disc: "Sol · Home".

### Keys
Tactile console keys. **Shape:** 4px corners, 1px enamel-edge border, minimum 44px tall. **Default:** enamel-high face, text colour, label type. **Hover:** face mixes 20% toward text. **Active:** drops 1px with a shorter shadow. **Pressed (`aria-pressed=true`):** phosphor face, glass-colour text. **Lit (`key-lit`):** signal face, signal-ink text; used for the primary action only (Open comms, Transmit, Open project). **Sizes:** small (0.72rem, 8px 12px) and large (0.9rem, 14px 24px). **Disabled:** 60% opacity, progress cursor. Transitions run 160ms on `cubic-bezier(0.16, 1, 0.3, 1)`.

### Lamps
9px status lights, always `aria-hidden` beside a text label. Base lamp is dim phosphor (idle); `landed` and `alert` are signal; `active` is phosphor; `complete` is an empty ring in the current text colour. Inside the SVG, lamps are 4-5px circles in on (phos), off (phos at 22% over glass) or alert (signal).

### Consoles
Every section is a console: enamel body, 1px enamel-edge border, 6px corners, padding 16px 24px 24px (12px 12px 16px at phones), console stand-off shadow, with a placard first and glass inside.

### Glass
CRT screens: glass fill, phosphor colour, 2px border mixed from enamel-edge and black, 12px corners, recess shadow, scanline overlay. Content variants (paper, readout, form) set text colour and 24px padding (16px on phones). The payload glass is 4:3. When a project has no image, the glass shows **No downlink**: 7-colour test bars at 32% opacity above mono caps "No downlink yet / Screenshot pending". The CH n/N channel tag sits top-left on glass at 82% opacity, with a signal HOLD flag when held.

### Stations
The placards set into the room's console tiers, and the real primary navigation on desktop: five anchor links (Missions, Payloads, Systems, Training on the tiers; Comms lit in signal). Placard type at max(1.05cqw, 11px), min-height 2.6cqw, 0.25cqw corners. **Hover:** phosphor face with glass text.

### Side screens and the mission list
The left side screen is the selected mission's readout (status lamp line, role in phosphor, org, mono date window and site, a "Base report" link). The right lists every mission as a selectable line: lamp, call sign, mono `'YY`. **Hover:** phosphor at 14%. **Selected (`aria-pressed`):** full phosphor face, glass text. The same two components render as glass panels in the fallback below 1180px.

### Watch switch
A fieldset of three radio positions on an enamel strip (Mars watch, Neptune watch, Day shift). Each position is a label with a ring lamp; the checked position gets the enamel-high face and a filled signal lamp. The choice is stored in `localStorage` and applied before first paint by an inline script, defaulting to Mars.

### Fields
Inputs on glass: transparent fill, 1px border of phosphor at 45%, 4px corners, 12px 14px padding, mono uppercase field labels in phosphor. **Focus:** 2px signal outline, border cleared. The link status line above the form reports Ready, Transmitting, Received or Failed, with a lamp, in a `role=status` region.

### Tags
Small outlined chips: 1px enamel-edge border (phosphor at 35% on glass), 3px corners, 4px 10px, 0.82rem.

### Planets, flags and base modules
The career as geography (`src/components/Planet.tsx`, positions from `src/lib/missions.ts`). Missions sit on concentric orbits around Sol, ordered by start date, the earliest innermost (radius 140 to 800, angle -42° to 8°), joined by a smooth Catmull-Rom trajectory. Each planet is a hue disc with a terminator shading the half facing away from Sol.
- **Landed (current mission):** radius 44, carrying a lander in phosphor ink, a signal flag and a blinking signal beacon; labelled "NOW · CALLSIGN" in signal.
- **Past missions:** radius 22 if featured, 15 otherwise, carrying a planted signal flag and up to three phosphor base modules; labelled "CALLSIGN 'YY" in dim phosphor.
- **Selection:** corner-bracket reticle in signal around the selected planet.
- **Surface view:** in the mission log, each mission shows its surface as a 360x110 curve of the planet's hue, with the flag planted and one numbered dome module per work bullet; the bullets below are numbered with matching arch badges.

### Named Rules
**The Placard Names It Rule.** Every station is named by a placard and only by a placard. Status lines and list heads are mono data, not headings.

**The Lamp Never Speaks Alone Rule.** A lamp is decoration for a text state beside it; it is always `aria-hidden` and never the only signal of status.

## Do's and Don'ts

### Do:
- **Do** reference colour only through the role variables (`--phos`, `--signal`, `--enamel`...) so all three watches work, and add any new role to all three `data-watch` blocks.
- **Do** place anything inside the room in 1440x900 canvas coordinates converted to percentages, with `cqw` type floored by `max(…, 11px)` or more.
- **Do** put signal-ink text on every signal fill, and reserve signal for live state, planted markers, the primary key and focus.
- **Do** name every new section with a placard on an enamel console and put its content on glass.
- **Do** use Martian Mono for dates, statuses and counts, with tabular numerals for dates.
- **Do** gate every animation and transition of movement inside `@media (prefers-reduced-motion: no-preference)`; the CRT warm-up (520ms, 4 steps, once), the trajectory plot-in (1.8s after 560ms), the beacon (1.6s, 2 steps, infinite) and the planet zoom (700ms, 2.4x, clamped to the plot) are the only authored motion.
- **Do** keep keys at least 44px tall (40px for fallback mission lines and watch positions), and give every focusable element the 2px signal focus ring at 3px offset (1px on fields, 2px on watch positions).
- **Do** meet WCAG 2.2 AA contrast in all three watches, keep the skip link to `#main` first in the tab order, label every new-tab link with a visually hidden "(opens in a new tab)", and give the room SVG one `role="img"` description while its real controls live in HTML overlays.
- **Do** keep a keyboard path for every pointer shortcut: planets on the plot are pointer-only because the mission list buttons do the same thing.
- **Do** keep the payload carousel holdable: a visible HOLD key, pause on hover and focus and when the tab is hidden, arrow-key support, polite announcements, and held by default under reduced motion.

### Don't:
- **Don't** hard-code a hex value in a component; planet hues and the No downlink test bars are the only sanctioned literals.
- **Don't** put white or light text on signal, or use signal for decoration, section accents or hover states.
- **Don't** lift elements on hover or add drop shadows beyond the four in the shadow vocabulary; hover changes the face colour, and a press moves down 1px.
- **Don't** bring back the legacy hot pink-red, gradient image overlays or underline-grow nav of `docs/legacy-design.md`.
- **Don't** let `cqw` type go unfloored, or position a room overlay with page flow, flex or grid instead of canvas coordinates.
- **Don't** add scanlines in the Day watch; paper has none (`scan` is transparent).
- **Don't** convey state with a lamp or colour alone; every lamp has a text label next to it.
