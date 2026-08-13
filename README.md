# HH Goa 2026 — Builder ID Generator (v2)

Two-screen, single-page-after-upload flow. Fully client-side, no backend.

## Setup

```bash
npm install
npm run dev
```

Open the printed `localhost` URL.

## Structure

```
src/
  components/
    IntroScreen.jsx       Screen 1 — intro + upload
    BuilderWorkspace.jsx  Screen 2 — wires every section together
    PhotoEditor.jsx        drag (Pointer Events) + zoom slider + reset
    BuilderForm.jsx         name/handle/role, inline validation, role chips
    TechStackInput.jsx      tag input, validated against a predefined tech list
    PersonalitySelector.jsx max-3 trait chips
    BuilderTagDisplay.jsx   shows + shuffles the generated Builder Tag
    ThemeSelector.jsx       5 swatch cards
    BuilderPreview.jsx      live canvas preview
    ResultActions.jsx       generate / share / download / reset
  utils/
    titleGenerator.js   rule-based Builder Tag + Builder Type engine
    techSuggestions.js  predefined tech/role lists + prefix matching
    themes.js            5 theme color objects (not CSS — read by canvas)
    imageUtils.js        validation, HEIC conversion, crop/pan/zoom math
    canvasGenerator.js   draws + exports the 1200x1200 PNG
    shareUtils.js         Web Share API with X-intent fallback
  App.jsx     2-screen state machine
  main.jsx
  styles.css  <- the ONE stylesheet, CSS variables at the top
```

## Key implementation notes

- **Photo editor ↔ canvas parity**: `PhotoEditor.jsx` renders the crop
  using the exact same math as the PNG export (`getTransformedCropRect`
  in `imageUtils.js`), converting on-screen drag pixels into source-image
  pixels at drag time. What you see while dragging is what gets exported.
- **Themes are data, not CSS.** `utils/themes.js` holds plain hex values
  the canvas reads directly — the page UI (buttons, cards) stays on the
  `styles.css` variables regardless of which card theme is picked.
- **Tech stack validation**: only exact matches (case-insensitive) against
  `TECH_LIST` become chips; free text alone shows the inline error.
- **Builder Tag** always resolves to something — specific role+trait rule
  → role-only fallback → generic fallback, so it can never come back empty.

## Testing checklist

- [ ] Upload JPG / PNG / HEIC
- [ ] Drag photo — preview and later export match
- [ ] Zoom slider — face stays visible, no gap around the circle
- [ ] Reset — returns to centered, scale 1
- [ ] Name: reject numbers/symbols, accept apostrophes/hyphens
- [ ] Handle: accepts with/without `@`, normalized on the card
- [ ] Role: typing filters chips; picking a chip fills the field
- [ ] Tech stack: typing filters suggestions; only list items become chips; Enter doesn't submit anything else
- [ ] Personality: blocked at 3 selections, counter updates
- [ ] Builder Tag updates when role/traits change; Shuffle cycles to a different valid tag
- [ ] Theme switch updates live preview immediately
- [ ] Generate → Download PNG opens at 1200x1200
- [ ] Share to X: mobile share sheet or download+compose-tab fallback
- [ ] Mobile viewport (375–430px): no horizontal scroll, single column
- [ ] Desktop (900px+): two-column layout, preview sticky on scroll
- [ ] Make Another resets fully

## Deploy

Static build, deploy anywhere:

```bash
npm run build
```

Vercel: `vercel` in the project root (Vite preset, output `dist`).
Netlify: drag-and-drop `dist/` or connect repo with build command `npm run build`, publish dir `dist`.
