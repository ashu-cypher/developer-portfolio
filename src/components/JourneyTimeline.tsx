import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { portfolio } from "../data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/**
 * Journey timeline: center line on md+ (alternating cards), left rail on
 * mobile. Rendered as an <ol>. A scroll-linked progress line grows down the
 * rail, and each node dot flares cyan as it enters the viewport.
 */
export default function JourneyTimeline() {
  const railRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.75", "end 0.55"],
  });

  const entries = portfolio.journey;

  return (
    <section id="journey" aria-label="My journey" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="My Journey"
          title="The Road So Far"
          subtitle="A chronological look at how I got here — every entry is real. Scroll to walk through it."
        />

        <div className="relative mt-14">
          {/* Rail: faint track + scroll progress line */}
          <div
            className="pointer-events-none absolute bottom-0 left-5 top-0 w-px bg-line md:left-1/2"
            aria-hidden="true"
          />
          <motion.div
            className="pointer-events-none absolute bottom-0 left-5 top-0 w-px origin-top bg-gradient-to-b from-neon to-pulse md:left-1/2"
            aria-hidden="true"
            style={reduce ? undefined : { scaleY: scrollYProgress }}
          />

          <ol ref={railRef} className="relative space-y-12 md:space-y-0">
            {entries.map((entry, i) => {
              const leftSide = i % 2 === 0;
              return (
                <Reveal
                  key={`${entry.period}-${entry.title}`}
                  as="li"
                  className="relative pl-14 md:grid md:grid-cols-2 md:gap-16 md:pl-0 md:pb-16 md:last:pb-0"
                >
                  {/* Node dot — flares cyan when in view (static for reduced motion) */}
                  {reduce ? (
                    <span
                      className="absolute left-5 top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-neon bg-neon shadow-[0_0_12px_rgba(34,211,238,0.7)] md:left-1/2"
                      aria-hidden="true"
                    />
                  ) : (
                    <motion.span
                      className="absolute left-5 top-1 h-4 w-4 rounded-full border-2 md:left-1/2"
                      aria-hidden="true"
                      initial={{
                        x: "-50%",
                        scale: 0.6,
                        backgroundColor: "#0a0f22",
                        borderColor: "rgba(147,160,189,0.5)",
                      }}
                      whileInView={{
                        x: "-50%",
                        scale: 1.15,
                        backgroundColor: "#22d3ee",
                        borderColor: "#22d3ee",
                      }}
                      viewport={{ once: true, margin: "-30% 0px -30% 0px" }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                  )}

                  {/* Spacer column on desktop so cards alternate sides */}
                  {leftSide && <div className="hidden md:block" aria-hidden="true" />}

                  <article
                    className={`rounded-2xl border border-line bg-panel/60 p-6 backdrop-blur-sm sm:p-7 ${
                      leftSide ? "md:col-start-1 md:text-right" : "md:col-start-2"
                    }`}
                  >
                    <p className="inline-block rounded-full border border-neon/30 bg-neon/10 px-3 py-1 font-mono text-xs tracking-widest text-neon">
                      {entry.period}
                    </p>
                    <h3 className="mt-4 font-display text-xl font-bold text-ink sm:text-2xl">
                      {entry.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">
                      {entry.description}
                    </p>
                    {entry.tags.length > 0 && (
                      <ul
                        className={`mt-4 flex flex-wrap gap-2 ${leftSide ? "md:justify-end" : ""}`}
                        aria-label={`Tags for ${entry.title}`}
                      >
                        {entry.tags.map((tag) => (
                          <li key={tag} className="chip text-xs">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>

                  {!leftSide && <div className="hidden md:block" aria-hidden="true" />}
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
