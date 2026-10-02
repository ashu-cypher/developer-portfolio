import { portfolio } from "../data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/**
 * GitHub section: profile link card. The full, filterable repository grid
 * lives in the Projects section ("All Repositories") — this section just
 * points there so the two never drift out of sync.
 */
export default function GithubSection() {
  const profileUrl = `https://github.com/${portfolio.githubUsername}`;

  return (
    <section id="github" aria-label="GitHub" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Code / GitHub"
          title="Open Source & Code"
          subtitle="Everything I build in the open lives here — browse the full repository grid in the Projects section."
        />

        <Reveal className="mt-12">
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="glass flex min-h-[44px] flex-wrap items-center justify-between gap-4 rounded-2xl p-6 transition-colors motion-safe:hover:border-neon/50"
            aria-label={`Visit ${portfolio.githubUsername} on GitHub`}
          >
            <span className="font-mono text-lg text-neon">@{portfolio.githubUsername}</span>
            <span className="text-sm font-medium text-ink">
              View profile <span aria-hidden="true">→</span>
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.1} className="mt-6">
          <a
            href="#projects"
            className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-mist transition-colors hover:text-neon-glow"
          >
            Browse all repositories with filters
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
