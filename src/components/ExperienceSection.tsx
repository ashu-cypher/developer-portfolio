/**
 * ExperienceSection — "Beyond Code": extracurricular involvement and
 * community activities, presented as a timeline. Only what was actually
 * provided is shown — no invented titles, durations or responsibilities.
 * The data structure in portfolio.ts is ready for future additions
 * (certificates, hackathons, workshops, communities, leadership).
 */
import { portfolio } from "../data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export default function ExperienceSection() {
  const entries = portfolio.experience;

  return (
    <section
      id="experience"
      aria-label="Experience and involvement"
      className="relative z-10 bg-abyss/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Beyond Code"
          title="Experience & Involvement"
          subtitle="Communities I'm part of and the roles I hold in them — the human side of the work."
        />

        {entries.length === 0 ? (
          <Reveal className="glass mt-12 rounded-2xl p-8 text-center sm:p-12">
            <p className="font-display text-xl font-semibold text-ink">More to come</p>
            <p className="mt-2 text-sm text-mist">
              Add involvement entries in <span className="font-mono">src/data/portfolio.ts</span>{" "}
              and they&apos;ll appear here.
            </p>
          </Reveal>
        ) : (
          <ol className="relative mt-12 space-y-8 before:absolute before:bottom-4 before:left-[7px] before:top-4 before:w-px before:bg-gradient-to-b before:from-neon/60 before:via-line before:to-transparent sm:before:left-[9px]">
            {entries.map((entry, i) => (
              <Reveal as="li" key={`${entry.role}-${i}`} delay={Math.min(i * 0.08, 0.32)} className="relative pl-10 sm:pl-12">
                {/* Timeline node */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center sm:h-5 sm:w-5"
                >
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-40 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon shadow-neon-glow sm:h-3 sm:w-3" />
                </span>

                <div className="glass rounded-2xl p-6 transition-colors duration-300 motion-safe:hover:border-neon/40">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-mono text-sm font-semibold tracking-widest text-neon">
                      {entry.period}
                    </p>
                    <p className="chip">{entry.kind}</p>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold text-ink sm:text-2xl">
                    {entry.role}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-pulse">{entry.organization}</p>
                  <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">
                    {entry.description}
                  </p>
                  {entry.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${entry.role} tags`}>
                      {entry.tags.map((tag) => (
                        <li key={tag} className="chip">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
