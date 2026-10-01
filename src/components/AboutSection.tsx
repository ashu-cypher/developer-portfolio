import { portfolio, isConfigured } from "../data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

function HintChip({ children }: { children: string }) {
  return (
    <span className="chip border-dashed opacity-80" aria-label={`${children}`}>
      {children}
    </span>
  );
}

/**
 * About section: bio paragraphs + interest pills on the left,
 * education glass card on the right, honest stats grid below.
 */
export default function AboutSection() {
  const { about, interests, education, stats, personal } = portfolio;
  const hasStats = stats.length > 0;

  return (
    <section id="about" aria-label="About me" className="relative z-10 bg-abyss/40 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Who am I?" title="About Me" />

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Bio + interests */}
          <div>
            <Reveal className="space-y-5">
              {about.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-ink/85 sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </Reveal>

            {interests.length > 0 && (
              <Reveal delay={0.1} className="mt-8">
                <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-mist">
                  What I'm into
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2.5" aria-label="Interests">
                  {interests.map((interest) => (
                    <li key={interest} className="chip">
                      <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-neon" aria-hidden="true" />
                      {interest}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>

          {/* Education card */}
          <Reveal delay={0.1}>
            <div className="glass h-full p-8" aria-label="Education">
              <h3 className="section-eyebrow">Education</h3>
              <p className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
                {education.degree}
              </p>
              <p className="mt-2 text-base text-pulse">{education.specialization}</p>

              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex flex-col gap-1.5">
                  <dt className="font-mono text-xs uppercase tracking-widest text-mist">College</dt>
                  <dd>
                    {isConfigured(education.college) ? (
                      <span className="text-ink/90">{education.college}</span>
                    ) : (
                      <HintChip>College — not configured yet</HintChip>
                    )}
                  </dd>
                </div>
                <div className="flex flex-col gap-1.5">
                  <dt className="font-mono text-xs uppercase tracking-widest text-mist">Year of study</dt>
                  <dd>
                    {isConfigured(education.yearOfStudy) ? (
                      <span className="text-ink/90">{education.yearOfStudy}</span>
                    ) : (
                      <HintChip>Year of study — not configured yet</HintChip>
                    )}
                  </dd>
                </div>
                <div className="flex flex-col gap-1.5">
                  <dt className="font-mono text-xs uppercase tracking-widest text-mist">Location</dt>
                  <dd>
                    {isConfigured(personal.location) ? (
                      <span className="text-ink/90">{personal.location}</span>
                    ) : (
                      <HintChip>Location — not configured yet</HintChip>
                    )}
                  </dd>
                </div>
              </dl>

              <p className="mt-8 border-t border-line pt-5 text-xs leading-relaxed text-mist">
                Values marked "not configured" come from <span className="font-mono">src/data/portfolio.ts</span> —
                update the file and they appear here automatically.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Stats grid — only honest values from data */}
        {hasStats && (
          <ul
            className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4"
            aria-label="Key facts"
          >
            {stats.map((stat, i) => (
              <Reveal key={stat.label} as="li" delay={i * 0.08} className="h-full">
                <div className="flex h-full min-h-[11rem] flex-col justify-center rounded-2xl border border-line bg-panel/60 p-6 text-center backdrop-blur-sm">
                  <p className="text-glow-cyan font-display text-4xl font-bold text-neon sm:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-mist">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
