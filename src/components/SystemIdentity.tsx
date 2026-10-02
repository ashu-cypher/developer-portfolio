/**
 * SystemIdentity — minimal floating identity labels around the 3D figure.
 * A few elegant technical annotations, deliberately sparse: no fake
 * terminal, no dashboard. Purely decorative (the same information lives
 * in the hero copy), so it's hidden from assistive tech.
 */
import { motion, useReducedMotion } from "framer-motion";
import { portfolio } from "../data/portfolio";

function Label({
  k,
  v,
  className = "",
  delay = 0,
  line = false,
}: {
  k: string;
  v?: string;
  className?: string;
  delay?: number;
  line?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-none select-none ${className}`}
    >
      <div className="flex items-center gap-2.5">
        {line && <span aria-hidden="true" className="h-px w-8 bg-neon/40" />}
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-mist/80">
          {k}
        </span>
        {v && (
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/90">
            {v}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function SystemIdentity() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden select-none lg:block"
    >
      {/* Top-right: identity handle */}
      <Label
        k="[ ASHUTOSH.DHAGAT ]"
        delay={0.5}
        line
        className="absolute right-[8%] top-[16%]"
      />
      {/* Mid-right: what it is */}
      <div className="absolute right-[6%] top-[46%] flex flex-col items-end gap-2">
        <Label k="Digital identity" delay={0.7} line />
        <Label k="AI · Intelligent Systems" delay={0.85} />
      </div>
      {/* Bottom-right: status + location */}
      <div className="absolute bottom-[14%] right-[10%] flex flex-col items-end gap-2">
        <Label k="Status" v="Building" delay={1} line />
        <Label k="Location" v={portfolio.personal.location.toUpperCase()} delay={1.1} />
      </div>
      {/* Left edge, low: quiet annotation near the copy */}
      <Label
        k="Block avatar — rendered in real time"
        delay={1.25}
        className="absolute bottom-[10%] left-[4%] opacity-70"
      />
    </div>
  );
}
