import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Fixed 3px gradient progress bar pinned to the top of the viewport.
 * Fills left → right as the page scrolls. Renders nothing when the user
 * prefers reduced motion.
 */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-neon via-neon-glow to-pulse"
      style={{ scaleX }}
    />
  );
}
