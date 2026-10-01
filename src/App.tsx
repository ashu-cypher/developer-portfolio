import { portfolio } from "./data/portfolio";

/**
 * Phase 1 shell — sections are wired up in later phases.
 * Temporary placeholder so `tsc` + `vite build` stay green between phases.
 */
function App() {
  return (
    <div className="min-h-screen bg-void text-ink">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <main id="main" className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="section-eyebrow">Phase 1 — foundation</p>
        <h1 className="font-display text-4xl font-bold">
          {portfolio.personal.name} — Portfolio
        </h1>
        <p className="text-mist">
          Design system, data file and build pipeline are live. Sections land in
          the next phases.
        </p>
      </main>
    </div>
  );
}

export default App;
