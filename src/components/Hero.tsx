/**
 * Hero — full-screen introduction. The fixed 3D AvatarScene canvas shows
 * through (this section sits at z-10); the right column is intentionally
 * empty on desktop so the digital identity has room, and collapses on mobile.
 *
 * Layered over the scene: a lightweight neural-particle canvas (pointer
 * reactive, reduced-motion aware) + the interactive SystemIdentity panel.
 */
import { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { isConfigured, portfolio } from "../data/portfolio";
import { SystemIdentity } from "./SystemIdentity";

const RESUME_TITLE = "Resume not configured yet — see src/data/portfolio.ts";

/* ------------------------------------------------------------------ */
/* NeuralField — lightweight canvas: drifting nodes + connections,     */
/* gently attracted to the pointer. No libraries, ~70 nodes desktop.    */
/* ------------------------------------------------------------------ */
function NeuralField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      cyan: boolean;
    }
    let nodes: Node[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 768 ? 28 : 64;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.8,
        cyan: Math.random() > 0.3,
      }));
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const LINK = 130;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        // gentle pointer attraction
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 220 && dist > 1) {
          n.vx += (dx / dist) * 0.012;
          n.vy += (dy / dist) * 0.012;
        }
        n.vx *= 0.985;
        n.vy *= 0.985;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.cyan
          ? "rgba(103, 232, 249, 0.5)"
          : "rgba(167, 139, 250, 0.5)";
        ctx.fill();
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            const alpha = (1 - d / LINK) * 0.16;
            ctx.strokeStyle = `rgba(103, 232, 249, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    if (reduce) {
      draw(); // single static frame
    } else {
      const loop = () => {
        draw();
        raf = requestAnimationFrame(loop);
      };
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    />
  );
}

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
      B.E. Computer Engineering — Class of 2028
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
      className="mt-5 font-display text-xl font-medium text-mist sm:text-2xl"
    >
      {portfolio.personal.headline}
    </p>,
    <p
      key="tagline"
      className="mt-4 max-w-xl font-display text-2xl font-semibold leading-snug sm:text-3xl"
    >
      <span className="bg-gradient-to-r from-neon-glow via-neon to-pulse bg-clip-text text-transparent">
        {portfolio.personal.tagline}
      </span>
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
    <div key="identity" className="mt-10 w-full">
      <SystemIdentity />
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
        <NeuralField />
        <div className="bg-grid bg-grid-fade absolute inset-0" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-neon/10 blur-[120px]" />
        <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-pulse/10 blur-[120px]" />
        {/* Mobile-only scrim: keeps headline readable over the 3D identity */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-void/10 to-void/80 lg:hidden" />
      </div>

      {reduce ? (
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-24 lg:grid-cols-2">
          <div className="flex flex-col items-start">{leftBlocks}</div>
          {/* Intentionally empty: the fixed 3D identity shows through here on desktop */}
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
          {/* Intentionally empty: the fixed 3D identity shows through here on desktop */}
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
