# Ashutosh Dhagat | AI & Computer Engineering

A premium, futuristic personal portfolio for a B.E. Computer Engineering
student specializing in Artificial Intelligence & Intelligent Systems. Built
around a procedural 3D **"digital self"** — a holographic facial
reconstruction (translucent core, wireframe topology, facial point-cloud
with neural connections, sweeping scan ring) that reacts as you scroll —
plus an interactive system-identity readout, real GitHub repository data,
and a "Beyond Code" involvement timeline.

**Concept:** *"AI engineer + digital laboratory + premium interactive portfolio."*

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
- `projects[]` — full detail used by featured builds + the detail modal
  (`problem`, `solution`, `architecture`, `features[]`, `technologies[]`,
  `challenges[]`, `learned[]`, real `github`/`demo` URLs or `""`)
- `githubRepos[]` — **real repositories, verified against the GitHub API**
  (name, url, description, language, stars, updatedAt, categories, featured).
  Refresh with:
  ```bash
  python3 -c "
  import sys; sys.path.insert(0,'/home/hatch/workspace/skills/github/bin')
  from gh_api import req
  repos = req('GET','/users/ashu-cypher/repos?per_page=100&sort=updated')
  [print(r['name'],'|',r['language'],'|',r['stargazers_count'],'|',r['updated_at'][:10],'|',r['description']) for r in repos]
  "
  ```
  then paste the results into `githubRepos`. Categories drive the filter tabs:
  `AI-ML` / `AI-AGENTS` / `WEB` / `AUTOMATION` / `PYTHON` / `OTHER`.
- `experience[]` — involvement & activities (`period`, `role`, `organization`,
  `kind`, `description`, `tags[]`); shown as-is, never inflated
- `skills[]` — categories with `comfortable` / `building` / `exploring` levels
  (no percentages, ever)
- `currentlyBuilding[]` — `BUILDING` / `EXPERIMENTING` / `LEARNING` statuses
- `achievements[]` — **leave `[]` and the whole section hides itself**
- `resumePath` — e.g. `"/resume.pdf"`; `""` shows a clean fallback, no broken link
- `githubUsername`, `socials` — GitHub / LinkedIn / email links

**Live demos:** none of the GitHub repos currently publish a deployment
(no `homepage` set, no GitHub Pages — verified via the GitHub API on
2026-10-02). So every project card links to its real repository with
[ VIEW PROJECT ]. If you later deploy something, set its `demo` URL in
`projects[]` and a [ LIVE DEMO ] button appears automatically — never add
a demo URL you can't open in a browser.

Values marked `TODO` in the file are placeholders. Empty strings (`""`) are
never rendered as facts — the UI shows a subtle "not configured yet" hint
pointing back at this file instead.

### Still placeholder (fill these in)

- **Email domain** — `socials.email` is `"dhagatashutosh"` exactly as provided
  (no domain invented). Replace it with the full address and the contact
  form + mailto links activate automatically.
- Resume PDF path (`public/resume.pdf` → set `resumePath: "/resume.pdf"`)

## The 3D digital self

- **Default:** a procedural "digital human" — a synthetic bust (head, neck,
  shoulders) suggesting a human identity reconstructed by an AI system:
  dark satin core, translucent holo layers, inner wireframe topology,
  ~430-point facial scan with neural-network connections, a neural node
  network around the body, orbiting geometric fragments, subtle eye glows,
  and an **occasional scan sweep** (every ~9s a thin beam passes and the
  wireframe brightens, then fades — like identity being reconstructed).
  Slow rotation, subtle mouse-follow tilt, cursor-reactive particles, a
  gentle scroll-driven yaw, and scroll states (idle, looks-at-content,
  drift, interacting, tech-orbit, facing-the-visitor).
- **Custom model:** drop a GLB at `public/models/avatar.glb` — the scene
  `HEAD`-checks that path and loads it automatically, falling back to the
  procedural identity if it's missing. The app never fails without it.
- **No WebGL / mobile fallback:** a pure-CSS scan-orb motif renders instead;
  particle counts are reduced on small screens. The whole site remains
  fully functional.
- The scene is **lazy-loaded** (`React.lazy` + `Suspense`) so the 3D bundle
  (~900 KB) never blocks first paint. `prefers-reduced-motion` renders a
  static pose and disables reveal transforms.

## Project structure

```
src/
  data/portfolio.ts        # ← edit everything here
  components/
    AvatarScene.tsx        # fixed 3D background canvas + scroll states
    avatarRig.ts           # scroll-state rig (targets + lerp math)
    BlockAvatar.tsx        # original procedural block-style avatar (breathing, seams, particles)
    AvatarFallback.tsx     # CSS block figure (Suspense + no-WebGL fallback)
    Hero.tsx               # full-screen intro + neural particle field
    SystemIdentity.tsx     # sparse floating identity labels around the figure
    SectionDivider.tsx     # quiet hairline transitions between sections
    Navbar.tsx             # floating pill nav, active-section highlight, mobile menu
    ScrollProgress.tsx     # top scroll progress bar
    CustomCursor.tsx       # desktop-only subtle cursor ring
    AboutSection.tsx       # bio, education, interests, stats
    JourneyTimeline.tsx    # scroll-animated timeline
    ProjectShowcase.tsx    # Featured Builds + filterable repo grid + modal state
    ProjectModal.tsx       # detail dialog (architecture flow diagram, Esc, focus trap)
    ExperienceSection.tsx  # "Beyond Code" involvement timeline
    SkillsSection.tsx      # honest skill clusters
    CurrentlyBuilding.tsx  # status-badged work-in-progress cards
    Achievements.tsx       # hidden when data is empty
    ResumeSection.tsx      # view/download with missing-file fallback
    GithubSection.tsx      # profile link (repo grid lives in Projects)
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
