import { portfolio } from "../data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/**
 * Achievements section. Hidden entirely (returns null) when there are no
 * achievements configured — never render an empty or placeholder section.
 */
export default function Achievements() {
  const { achievements } = portfolio;

  if (achievements.length === 0) {
    return null;
  }

  return (
    <section
      id="achievements"
      aria-label="Achievements"
      className="relative z-10 bg-abyss/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Achievements" title="Milestones" />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, i) => (
            <Reveal key={achievement.title} delay={(i % 3) * 0.08} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-line bg-panel/60 p-6 backdrop-blur-sm transition-colors hover:border-pulse/50 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-pulse/30 bg-pulse/10 px-3 py-1 font-mono text-xs tracking-widest text-pulse">
                    {achievement.category}
                  </span>
                  <span className="font-mono text-xs text-mist">{achievement.period}</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-ink sm:text-xl">
                  {achievement.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mist">
                  {achievement.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
