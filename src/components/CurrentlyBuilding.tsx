import { portfolio, BUILD_STATUS_LABEL } from "../data/portfolio";
import type { BuildStatus } from "../data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const STATUS_BADGE: Record<BuildStatus, string> = {
  BUILDING: "border-neon/40 bg-neon/10 text-neon",
  EXPERIMENTING: "border-pulse/40 bg-pulse/10 text-pulse",
  LEARNING: "border-amber-400/40 bg-amber-400/10 text-amber-400",
};

export default function CurrentlyBuilding() {
  const items = portfolio.currentlyBuilding;

  return (
    <section id="building" aria-label="Currently building" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Currently Building"
          title="What I'm Working On Now"
          subtitle="Honest statuses — nothing here is claimed finished before it is."
        />

        {items.length === 0 ? (
          <Reveal className="glass mt-12 rounded-2xl p-8 text-center">
            <p className="text-mist">Nothing in progress at the moment — check back soon.</p>
          </Reveal>
        ) : (
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {items.map((item, i) => (
              <Reveal key={item.title} as="li" delay={Math.min(i * 0.08, 0.32)}>
                <article className="glass flex h-full flex-col rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span aria-hidden="true" className="text-3xl leading-none">
                      {item.emoji}
                    </span>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${STATUS_BADGE[item.status]}`}
                    >
                      {BUILD_STATUS_LABEL[item.status]}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-mist">{item.description}</p>
                  {item.technologies.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${item.title} technologies`}>
                      {item.technologies.map((tech) => (
                        <li key={tech} className="chip text-xs">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
