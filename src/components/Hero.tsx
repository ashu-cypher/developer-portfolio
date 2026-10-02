/**
 * Hero — full-screen introduction. The fixed 3D AvatarScene canvas shows
 * through (this section sits at z-10); the right column is intentionally
 * empty on desktop so the digital identity has room, and collapses on mobile.
 *
 * Layered over the scene: a lightweight neural-particle canvas (pointer
 * reactive, reduced-motion aware) + sparse floating identity labels.
 * No grid background, no radar/HUD dressing — the 3D figure is the hero.
 */
import { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { portfolio } from "../data/portfolio";
import { SystemIdentity } from "./SystemIdentity";

/* ------------------------------------------------------------------ */
/* NeuralField — lightweight canvas: drifting nodes + connections,     */
/* gently attracted to the pointer. No libraries, ~60 nodes desktop.    */
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
      const count = w < 768 ? 24 : 56;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1 + Math.random() * 1.6,
        cyan: Math.random() > 0.35,
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

    const LINK = 120;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        // gentle pointer attraction
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 200 && dist > 1) {
          n.vx += (dx / dist) * 0.01;
          n.vy += (dy / dist) * 0.01;
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
          ? "rgba(103, 232, 249, 0.4)"
          : "rgba(167, 139, 250, 0.4)";
        ctx.fill();
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            const alpha = (1 - d / LINK) * 0.12;
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
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
    />
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
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

  const [firstName, ...restName] = portfolio.personal.name.split(" ");
  const lastName = restName.join(" ");
  const { degree, specialization } = portfolio.education;

  const leftBlocks = [
    <p key="degree" className="section-eyebrow">
      {degree}
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
      key="specialization"
      className="mt-5 font-display text-xl font-medium text-mist sm:text-2xl"
    >
      {specialization}
    </p>,
    <p key="intro" className="mt-4 max-w-xl text-base leading-relaxed text-ink/80 sm:text-lg">
      Building intelligent systems, AI agents and interactive digital
      experiences.
    </p>,
    <div key="cta" className="mt-9 flex flex-wrap items-center gap-4">
      <a href="#projects" className="btn-primary">
        View Projects
      </a>
      <a
        href={portfolio.socials.github}
        target="_blank"
        rel="noreferrer"
        className="btn-ghost"
        aria-label="Ashutosh Dhagat on GitHub"
      >
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
        GitHub
      </a>
    </div>,
  ];

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Introduction"
      className="relative z-10 flex min-h-screen items-center overflow-hidden"
    >
      {/* Background accents — particles + soft glows only, no grid/HUD */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <NeuralField />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-neon/[0.07] blur-[130px]" />
        <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-pulse/[0.07] blur-[130px]" />
        {/* Mobile-only scrim: keeps headline readable over the 3D identity */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-void/10 to-void/80 lg:hidden" />
      </div>

      {/* Sparse floating identity labels around the 3D figure */}
      <SystemIdentity />

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
