import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { isConfigured, type Project } from "../data/portfolio";
import { Reveal } from "./Reveal";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  index: number;
}

const ACCENT_GRADIENT: Record<Project["accent"], string> = {
  cyan: "from-cyan-500/30 via-cyan-400/10",
  violet: "from-violet-500/30 via-violet-400/10",
  amber: "from-amber-500/30 via-amber-400/10",
};

const ACCENT_RING: Record<Project["accent"], string> = {
  cyan: "hover:border-cyan-400/40",
  violet: "hover:border-violet-400/40",
  amber: "hover:border-amber-400/40",
};

function GitHubIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

/**
 * Large interactive project card. The card itself is not a link — buttons
 * inside it (Details / GitHub / Demo) carry the actions so keyboard focus
 * order stays sane and predictable.
 */
export function ProjectCard({ project, onSelect, index }: ProjectCardProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setCoarsePointer(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCoarsePointer(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const enableTilt = !reduceMotion && !coarsePointer;
  const extraTech = Math.max(project.technologies.length - 4, 0);
  const hasGithub = isConfigured(project.github);
  const hasDemo = isConfigured(project.demo);

  return (
    <Reveal delay={(index % 3) * 0.08} className="h-full">
      <div className="h-full" style={{ perspective: 1200 }}>
        <motion.article
          aria-label={`${project.name} project`}
          whileHover={enableTilt ? { rotateX: -4, rotateY: 4 } : undefined}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className={`glass group flex h-full flex-col overflow-hidden rounded-2xl transition-colors duration-300 ${ACCENT_RING[project.accent]}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Visual header */}
          <div className="relative h-48 shrink-0 overflow-hidden">
            {isConfigured(project.image) ? (
              <img
                src={project.image}
                alt={`${project.name} screenshot`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${ACCENT_GRADIENT[project.accent]} to-transparent`}
              >
                {/* subtle grid overlay */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <span className="font-display text-7xl font-bold text-ink/80">
                  {project.name.charAt(0)}
                </span>
              </div>
            )}
            {project.status === "building" && (
              <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                </span>
                In progress
              </span>
            )}
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-3 p-6">
            <div>
              <h3 className="font-display text-xl font-bold text-ink">{project.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-mist">{project.tagline}</p>
            </div>

            {project.technologies.length > 0 && (
              <ul aria-label={`${project.name} technologies`} className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 4).map((tech) => (
                  <li key={tech} className="chip">
                    {tech}
                  </li>
                ))}
                {extraTech > 0 && <li className="chip">+{extraTech}</li>}
              </ul>
            )}

            {/* Footer actions */}
            <div className="mt-auto flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => onSelect(project)}
                className="btn-primary min-h-[44px] px-5 py-2.5 text-sm"
              >
                Details
              </button>
              {hasGithub && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${project.name} on GitHub`}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-line bg-white/[0.03] text-mist transition-colors duration-200 hover:border-neon/60 hover:text-neon-glow"
                >
                  <GitHubIcon />
                </a>
              )}
              {hasDemo ? (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost min-h-[44px] px-5 py-2.5 text-sm"
                >
                  Demo
                </a>
              ) : (
                <span
                  role="button"
                  aria-disabled="true"
                  title="No live demo published yet"
                  className="btn-disabled min-h-[44px] cursor-not-allowed px-5 py-2.5 text-sm"
                >
                  Demo unavailable
                </span>
              )}
            </div>
          </div>
        </motion.article>
      </div>
    </Reveal>
  );
}
