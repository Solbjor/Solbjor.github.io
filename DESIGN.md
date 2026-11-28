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

<!-- impeccable:design-map -->
Name: Andrew Solbjor
Colors: primary: mars-phos #ffb24a; secondary: mars-signal #ff4d3a; neutral: mars-room #121410; primary: mars-phos-dim #c98d45; primary: neptune-phos #7fe0ff; primary: neptune-phos-dim #5aaecb (+39 more in the sidecar)
Fonts: Archivo Variable (display, headline, title, title-sm, body, placard, label); Martian Mono Variable (data, data-body)
Spacing: space-1 4px, space-2 8px, space-3 12px, space-4 16px, space-5 24px, space-6 32px, space-7 48px, space-8 72px, bezel 3px, gutter clamp(16px, 3vw, 40px)
Radius: plate 3px, key 4px, console 6px, scene 10px, glass 12px, lamp 50%
North Star: "The Back Row of Mission Control"
Rules:
- The Room Lighting Rule. A watch is a lighting change, not a theme skin: every colour role exists in all three watches, components use only role variables, and adding a colour means adding it to all three blocks in `src/index.css`.
- The Rare Signal Rule. Signal red marks only what is live (landed, alert, failure), what is planted (flags, beacon, reticle), the primary action, and focus.
- The Phosphor Belongs to Glass Rule. Phosphor colours are the glass's own light.
- (+6 more)
Elevation:
- Console stand-off: 0 22px 44px -30px rgba(0,0,0,0.7)
- Glass recess: inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 40px rgba(0,0,0,0.55)
- Key travel: inset 0 1px 0 color-mix(in srgb, var(--text) 18%, transparent), 0 3px 0 color-mix(in srgb, var(--enamel-edge) 72%, black), 0 4px 4px rgba(0,0,0,0.35)
- Station set-in: 0 0.2cqw 0.5cqw -0.1cqw rgba(0,0,0,0.5)
Don't:
- Don't hard-code a hex value in a component; planet hues and the No downlink test bars are the only sanctioned literals.
- Don't put white or light text on signal, or use signal for decoration, section accents or hover states.
- Don't lift elements on hover or add drop shadows beyond the four in the shadow vocabulary; hover changes the face colour, and a press moves down 1px.
- Don't bring back the legacy hot pink-red, gradient image overlays or underline-grow nav of `docs/legacy-design.md`.
- Don't let `cqw` type go unfloored, or position a room overlay with page flow, flex or grid instead of canvas coordinates.
- Don't add scanlines in the Day watch; paper has none (`scan` is transparent).
- Don't convey state with a lamp or colour alone; every lamp has a text label next to it.
Map: docs/legacy-design.md
Map: src/index.css
Map: package.json
Map: src/components/Planet.tsx
Map: src/lib/missions.ts
Full: .impeccable/design-full.md (read a section when you need its detail)
