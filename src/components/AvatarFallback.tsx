/**
 * AvatarFallback — pure CSS/DOM "digital identity" used as the Suspense
 * fallback and the WebGL-unavailable fallback for the 3D identity scene.
 *
 * An abstract holographic scan motif: glowing orb with a sweeping scan
 * ring and orbiting nodes. aria-hidden: purely decorative.
 */
export function AvatarFallback({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <style>{`
        @keyframes fallback-scan {
          0% { top: 8%; opacity: 0; }
          12% { opacity: 1; }
          88% { opacity: 1; }
          100% { top: 88%; opacity: 0; }
        }
        @keyframes fallback-orbit {
          to { transform: rotate(360deg); }
        }
        @keyframes fallback-pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        .fallback-scanline { animation: fallback-scan 3.2s ease-in-out infinite; }
        .fallback-orbit { animation: fallback-orbit 14s linear infinite; }
        .fallback-orbit-rev { animation: fallback-orbit 22s linear infinite reverse; }
        .fallback-pulse { animation: fallback-pulse 2.6s ease-in-out infinite; }
      `}</style>
      <div className="relative flex h-56 w-56 items-center justify-center">
        {/* Core orb */}
        <div className="fallback-pulse relative h-32 w-32 overflow-hidden rounded-full border border-neon/40 bg-neon/10 shadow-[0_0_50px_rgba(34,211,238,0.25)] backdrop-blur-sm">
          {/* wireframe suggestion */}
          <div className="absolute inset-3 rounded-full border border-neon/25" />
          <div className="absolute inset-6 rounded-full border border-neon/20" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(103,232,249,0.35),transparent_60%)]" />
          {/* scanning line */}
          <div className="fallback-scanline absolute left-1 right-1 h-px bg-neon shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
          {/* face dots */}
          <div className="absolute left-[30%] top-[38%] h-1.5 w-1.5 rounded-full bg-neon-glow" />
          <div className="absolute right-[30%] top-[38%] h-1.5 w-1.5 rounded-full bg-neon-glow" />
        </div>
        {/* Orbit rings */}
        <div className="fallback-orbit absolute inset-0 rounded-full border border-dashed border-neon/25">
          <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-neon shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
        </div>
        <div className="fallback-orbit-rev absolute inset-4 rounded-full border border-pulse/25">
          <div className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-pulse shadow-[0_0_8px_rgba(167,139,250,0.9)]" />
        </div>
      </div>
    </div>
  );
}

export default AvatarFallback;
