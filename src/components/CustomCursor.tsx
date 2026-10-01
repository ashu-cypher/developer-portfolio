import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE_SELECTOR = "a, button, [data-cursor]";

/**
 * Subtle custom cursor enhancement: a small cyan dot follows the pointer
 * exactly, with a spring-eased ring trailing behind. The ring grows and
 * turns violet over interactive elements. Renders only on fine-pointer
 * devices — touch devices are untouched — and the native cursor stays
 * visible throughout. Hides while the pointer is outside the window.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      setHovering(!!target?.closest?.(INTERACTIVE_SELECTOR));
    };
    const out = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // Only un-hover when moving between elements, not on child swaps.
      const next = e.relatedTarget as HTMLElement | null;
      if (target?.closest?.(INTERACTIVE_SELECTOR) && !next?.closest?.(INTERACTIVE_SELECTOR)) {
        setHovering(false);
      }
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mouseout", out, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const show = visible ? 1 : 0;

  return (
    <>
      {/* Dot: follows the pointer exactly */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] h-2 w-2 rounded-full bg-neon mix-blend-screen"
        style={{ x, y, translateX: "-50%", translateY: "-50%", opacity: show }}
      />
      {/* Ring: spring-eased trailing ring */}
      <motion.div
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[90] h-8 w-8 rounded-full border-2 mix-blend-screen transition-colors duration-200 ${
          hovering ? "border-pulse" : "border-neon/40"
        }`}
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%", opacity: show }}
        animate={{ scale: hovering ? 1.6 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      />
    </>
  );
}
