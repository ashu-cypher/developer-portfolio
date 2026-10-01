# Ashutosh Dhagat — Interactive 3D Developer Portfolio

A highly polished, interactive developer portfolio built around a large,
animated blocky 3D avatar that reacts as you scroll through the developer's
journey — from hero to contact. Dark futuristic aesthetic, cyan/violet accents.

**Live concept:** *"This isn't a webpage. This is the developer's interactive world."*

## Tech stack

| Layer      | Choice (pinned, maintained)                                   |
|------------|---------------------------------------------------------------|
| Framework  | React 18 + Vite 5 + TypeScript (strict)                       |
| Styling    | Tailwind CSS 3.4 + custom design tokens                       |
| 3D         | three + `@react-three/fiber` v8 + `@react-three/drei` v9      |
| Animation  | framer-motion 11 (the only animation lib)                     |
| Backend    | None — fully static frontend                                  |

## Quick start

```bash
npm install
npm run dev      # local dev server
npm run build    # typecheck (tsc -b) + production build → dist/
npm run preview  # serve the production build locally
```

Node 18+ / npm 9+ recommended (developed on Node 24).

## Editing your content — one file

**All content lives in `src/data/portfolio.ts`.** The UI renders 100% from it:

- `personal` — name, headline, tagline, location
- `education` — degree, college, year of study, specialization
- `about`, `stats` — bio paragraphs + honest stat strings
- `journey[]` — timeline entries (`period`, `title`, `description`, `tags[]`)
- `projects[]` — full detail used by cards + the detail modal
  (`problem`, `solution`, `architecture`, `features[]`, `technologies[]`,
  `challenges[]`, `learned[]`, real `github`/`demo` URLs or `""`)
- `skills[]` — categories with `comfortable` / `building` / `exploring` levels
  (no percentages, ever)
- `currentlyBuilding[]` — `BUILDING` / `EXPERIMENTING` / `LEARNING` statuses
- `achievements[]` — **leave `[]` and the whole section hides itself**
- `resumePath` — e.g. `"/resume.pdf"`; `""` shows a clean fallback, no broken link
- `githubUsername`, `socials` — GitHub / LinkedIn / email links

Values marked `TODO` in the file are placeholders. Empty strings (`""`) are
never rendered as facts — the UI shows a subtle "not configured yet" hint
pointing back at this file instead.

### Still placeholder (fill these in)

- College / university name, year of study, location
- Email address (activates the contact form's mailto flow)
- LinkedIn URL
- Resume PDF path

## The 3D avatar

- **Default:** a procedural, original blocky character built from three.js
  primitives (no external model, no Roblox branding) with idle breathing,
  blinking, and six scroll-driven states: idle, looks-at-content, walking,
  interacting (floating cubes), tech-orbit, facing-the-visitor.
- **Custom model:** drop a GLB at `public/models/avatar.glb` — the scene
  `HEAD`-checks that path and loads it automatically, falling back to the
  procedural avatar if it's missing. The app never fails without it.
- **No WebGL?** A pure-CSS blocky avatar renders instead; the whole site
  remains fully functional.
- The scene is **lazy-loaded** (`React.lazy` + `Suspense`) so the 3D bundle
  (~900 KB) never blocks first paint. `prefers-reduced-motion` renders a
  static pose and disables reveal transforms.

## Project structure

```
src/
  data/portfolio.ts        # ← edit everything here
  components/
    AvatarScene.tsx        # fixed 3D background canvas + scroll states
    AvatarFallback.tsx     # CSS avatar (Suspense + no-WebGL fallback)
    Hero.tsx               # full-screen intro
    Navbar.tsx             # floating pill nav, active-section highlight, mobile menu
    ScrollProgress.tsx     # top scroll progress bar
    CustomCursor.tsx       # desktop-only subtle cursor ring
    AboutSection.tsx       # bio, education, interests, stats
    JourneyTimeline.tsx    # scroll-animated timeline
    ProjectShowcase.tsx    # project grid (owns modal state)
    ProjectCard.tsx        # tilt card
    ProjectModal.tsx       # detail dialog (Esc, focus trap, scroll lock)
    SkillsSection.tsx      # honest skill clusters
    CurrentlyBuilding.tsx  # status-badged work-in-progress cards
    Achievements.tsx       # hidden when data is empty
    ResumeSection.tsx      # view/download with missing-file fallback
    GithubSection.tsx      # profile link + real repo cards (no fake stats)
    ContactSection.tsx     # validated form → mailto, or clean disabled state
    Footer.tsx             # dynamic copyright year
    Reveal.tsx / SectionHeading.tsx   # shared primitives
  hooks/
    useActiveSection.ts    # scroll-spy driving nav + avatar state
    usePrefersReducedMotion.ts
  App.tsx                  # composition + avatar-state mapping
```

## Accessibility & performance

- Semantic HTML, skip link, visible focus states, keyboard-operable modal
  (Esc closes, focus trapped + restored), `aria-live` form status, alt text,
  contrast-checked palette, touch targets ≥ 44px, no horizontal overflow.
- `prefers-reduced-motion` respected in CSS, framer-motion, and the 3D loop.
- Lazy 3D chunk, lazy project images, animation cleanup on unmount,
  `dpr={[1, 1.5]}` capped rendering.

## Deploy

The build output (`dist/`) is static — deploy anywhere:

- **Vercel / Netlify:** point at the repo, build command `npm run build`,
  output dir `dist`.
- **GitHub Pages:** set `base: "./"` (or your repo name) in `vite.config.ts`
  before building, then publish `dist/`.

## Honesty rules (enforced by design)

- No invented stats, dates, links, or achievements — unknown values stay
  placeholder and render as "not configured".
- Project buttons only appear for URLs actually present in the data.
- Skill levels are `comfortable with` / `building with` / `exploring` —
  never percentages.
