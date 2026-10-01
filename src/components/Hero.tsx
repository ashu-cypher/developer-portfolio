/**
 * Hero — full-screen introduction. The fixed 3D AvatarScene canvas shows
 * through (this section sits at z-10); the right column is intentionally
 * empty on desktop so the avatar has room, and collapses on mobile.
 */
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { isConfigured, portfolio } from "../data/portfolio";

const RESUME_TITLE = "Resume not configured yet — see src/data/portfolio.ts";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const parallaxY = useTransform(scrollYProgress, [0, 0.85], [0, 90]);

  const resumeConfigured = isConfigured(portfolio.resumePath);
  const [firstName, ...restName] = portfolio.personal.name.split(" ");
  const lastName = restName.join(" ");

  const leftBlocks = [
    <p key="eyebrow" className="section-eyebrow">
      Hello, I&rsquo;m
    </p>,
    <h1
      key="name"
      className="mt-4 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
    >
      {firstName}{" "}
      <span className="bg-gradient-to-r from-neon to-pulse bg-clip-text text-transparent text-glow-cyan">
        {lastName}
      </span>
    </h1>,
    <p
      key="headline"
      className="mt-5 font-display text-xl font-medium sm:text-2xl"
    >
      <span className="bg-gradient-to-r from-neon-glow via-neon to-pulse bg-clip-text text-transparent">
        {portfolio.personal.headline}
      </span>
    </p>,
    <p
      key="tagline"
      className="mt-4 max-w-xl text-base leading-relaxed text-mist sm:text-lg"
    >
      {portfolio.personal.tagline}
    </p>,
    <div key="cta" className="mt-9 flex flex-wrap items-center gap-4">
      <a href="#projects" className="btn-primary">
        Explore My Work
      </a>
      {resumeConfigured ? (
        <a
          href={portfolio.resumePath}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost"
        >
          View Resume
        </a>
      ) : (
        <button
          type="button"
          disabled
          aria-disabled="true"
          title={RESUME_TITLE}
          className="btn-ghost btn-disabled"
        >
          View Resume
        </button>
      )}
    </div>,
  ];

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Introduction"
      className="relative z-10 flex min-h-screen items-center overflow-hidden"
    >
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="bg-grid bg-grid-fade absolute inset-0" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-neon/10 blur-[120px]" />
        <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-pulse/10 blur-[120px]" />
        {/* Mobile-only scrim: keeps headline readable over the 3D avatar */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-void/10 to-void/80 lg:hidden" />
      </div>

      {reduce ? (
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-24 lg:grid-cols-2">
          <div className="flex flex-col items-start">{leftBlocks}</div>
          {/* Intentionally empty: the fixed 3D avatar shows through here on desktop */}
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      ) : (
        <motion.div
          style={{ opacity: parallaxOpacity, y: parallaxY }}
          className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-24 lg:grid-cols-2"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-start"
          >
            {leftBlocks.map((block) => (
              <motion.div
                key={block.key}
                variants={itemVariants}
                className="flex w-full flex-col items-start"
              >
                {block}
              </motion.div>
            ))}
          </motion.div>
          {/* Intentionally empty: the fixed 3D avatar shows through here on desktop */}
          <div className="hidden lg:block" aria-hidden="true" />
        </motion.div>
      )}

      {/* Scroll indicator */}
      <div className="absolute inset-x-0 bottom-8 flex justify-center">
        <span className="sr-only">Scroll to explore</span>
        <div aria-hidden="true" className="animate-bounce text-mist">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4v14" />
            <path d="m6 12 6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
