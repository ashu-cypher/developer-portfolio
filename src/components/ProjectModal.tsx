import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { isConfigured, type Project } from "../data/portfolio";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

function ModalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-neon">
        {title}
      </h3>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-ink/90 marker:text-neon/70">
      {items.map((item, i) => (
        // Items are static content strings from the data file; index keys are stable here.
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * ArchitectureFlow — renders the architecture string as an elegant
 * stage diagram instead of a code block: INPUT -> PROCESSING -> OUTPUT
 * style nodes connected by arrows (vertical on mobile, flowing grid on
 * desktop). Falls back to plain text when the string has no separators.
 */
function ArchitectureFlow({ architecture }: { architecture: string }) {
  const stages = architecture
    .split(/[·—]/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (stages.length < 2) {
    return (
      <p className="text-sm leading-relaxed text-ink/90">{architecture}</p>
    );
  }

  return (
    <ol
      aria-label="System architecture flow"
      className="flex flex-col gap-0 sm:flex-row sm:flex-wrap sm:items-stretch"
    >
      {stages.map((stage, i) => (
        <li key={i} className="flex flex-1 flex-col sm:min-w-[10rem] sm:flex-row sm:items-center">
          <div className="flex flex-1 flex-col items-center gap-3 py-1">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neon/40 bg-neon/10 font-mono text-xs font-semibold text-neon-glow"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="max-w-[16rem] text-center text-xs leading-relaxed text-ink/90 sm:text-[13px]">
              {stage}
            </p>
          </div>
          {i < stages.length - 1 && (
            <span
              aria-hidden="true"
              className="flex justify-center py-2 sm:px-2 sm:py-0"
            >
              {/* down arrow on mobile, right arrow on desktop */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="rotate-90 text-neon/60 sm:rotate-0"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

function ModalContent({ project, onClose }: { project: Project; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<Element | null>(null);

  // Lock body scroll, focus the close button, restore focus on close.
  useEffect(() => {
    restoreFocusRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      if (restoreFocusRef.current instanceof HTMLElement) {
        restoreFocusRef.current.focus();
      }
    };
  }, []);

  // Esc closes; Tab is trapped inside the dialog.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const hasGithub = isConfigured(project.github);
  const hasDemo = isConfigured(project.demo);
  const anim = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96, y: 16 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 16 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        {...(reduceMotion
          ? {}
          : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } })}
      />
      {/* Dialog */}
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        {...anim}
        className="glass relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line/60 p-6 sm:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 id={titleId} className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {project.name}
              </h2>
              {project.status === "building" && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                  </span>
                  In progress
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-mist">{project.tagline}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-line bg-white/[0.03] text-mist transition-colors duration-200 hover:border-neon/60 hover:text-ink"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-7 overflow-y-auto p-6 sm:p-8">
          <ModalSection title="Overview">
            <p className="text-sm leading-relaxed text-ink/90">{project.description}</p>
          </ModalSection>

          <ModalSection title="Problem">
            <p className="text-sm leading-relaxed text-ink/90">{project.problem}</p>
          </ModalSection>

          <ModalSection title="Solution">
            <p className="text-sm leading-relaxed text-ink/90">{project.solution}</p>
          </ModalSection>

          <ModalSection title="Architecture">
            <ArchitectureFlow architecture={project.architecture} />
          </ModalSection>

          {project.features.length > 0 && (
            <ModalSection title="Key Features">
              <BulletList items={project.features} />
            </ModalSection>
          )}

          {project.technologies.length > 0 && (
            <ModalSection title="Technologies">
              <ul aria-label={`${project.name} technologies`} className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <li key={tech} className="chip">
                    {tech}
                  </li>
                ))}
              </ul>
            </ModalSection>
          )}

          {project.challenges.length > 0 && (
            <ModalSection title="Challenges">
              <BulletList items={project.challenges} />
            </ModalSection>
          )}

          {project.learned.length > 0 && (
            <ModalSection title="What I Learned">
              <BulletList items={project.learned} />
            </ModalSection>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-line/60 p-6 sm:p-8">
          {hasGithub && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="btn-primary min-h-[44px] px-5 py-2.5 text-sm"
            >
              GitHub
            </a>
          )}
          {hasDemo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost min-h-[44px] px-5 py-2.5 text-sm"
            >
              Live Demo
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
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost min-h-[44px] px-5 py-2.5 text-sm"
          >
            Back to portfolio
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Project detail modal. Renders nothing when `project` is null; when open it
 * locks body scroll, focuses the close button, traps Tab, closes on Esc or
 * backdrop click, and restores focus to the invoking element on close.
 */
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <AnimatePresence>
      {project && <ModalContent key="project-modal" project={project} onClose={onClose} />}
    </AnimatePresence>
  );
}
