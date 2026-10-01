import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Pixels of vertical travel (ignored when reduced motion is on) */
  y?: number;
  /** Delay in seconds */
  delay?: number;
  className?: string;
  /** Render as a different element, e.g. "li" */
  as?: "div" | "li" | "article" | "span";
}

/**
 * Shared scroll-reveal wrapper: fades/slides content in when it enters the
 * viewport. Renders statically (no transform) when the user prefers
 * reduced motion, so content is never hidden from anyone.
 */
export function Reveal({ children, y = 28, delay = 0, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = (motion as any)[as] ?? motion.div;

  if (reduce) {
    const Static = as as any;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
