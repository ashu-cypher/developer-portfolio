import { portfolio, SKILL_LEVEL_LABEL } from "../data/portfolio";
import type { SkillLevel } from "../data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const LEVEL_DOT: Record<SkillLevel, string> = {
  comfortable: "bg-neon",
  building: "bg-pulse",
  exploring: "bg-amber-400",
};

const LEVELS: SkillLevel[] = ["comfortable", "building", "exploring"];

export default function SkillsSection() {
  const configured = portfolio.skills.filter((c) => c.items.length > 0);

  return (
    <section id="skills" aria-label="Skills" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Tech Stack"
          title="Skills & Tools"
          subtitle="An honest map of what I work with — no percentages, no padding."
        />

        {configured.length === 0 ? (
          <Reveal className="glass mt-12 rounded-2xl p-8 text-center">
            <p className="text-mist">Skills coming soon — this section will fill out as the stack grows.</p>
          </Reveal>
        ) : (
          <>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {configured.map((cat, i) => (
                <Reveal key={cat.category} delay={Math.min(i * 0.08, 0.32)}>
                  <div className="glass h-full rounded-2xl p-6">
                    <h3 className="font-display text-xl font-semibold text-ink">
                      <span className="border-b-2 border-neon pb-1">{cat.category}</span>
                    </h3>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${cat.category} skills`}>
                      {cat.items.map((item) => (
                        <li
                          key={item.name}
                          className="inline-flex items-center gap-2 rounded-full border border-line bg-void/50 px-3 py-2 transition-transform motion-safe:hover:scale-105"
                        >
                          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${LEVEL_DOT[item.level]}`} />
                          <span className="text-sm font-medium text-ink">{item.name}</span>
                          <span className="sr-only">{SKILL_LEVEL_LABEL[item.level]}</span>
                          <span aria-hidden="true" className="text-[11px] text-mist">
                            {SKILL_LEVEL_LABEL[item.level]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-8">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Skill level legend">
                {LEVELS.map((level) => (
                  <li key={level} className="inline-flex items-center gap-2 text-xs text-mist">
                    <span aria-hidden="true" className={`h-2 w-2 rounded-full ${LEVEL_DOT[level]}`} />
                    <span className="font-mono">{SKILL_LEVEL_LABEL[level]}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
