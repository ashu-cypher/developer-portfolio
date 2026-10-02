/**
 * AvatarFallback — pure CSS/DOM block figure used as the Suspense
 * fallback and the WebGL-unavailable fallback for the 3D identity scene.
 *
 * A minimal block-style avatar echoing the 3D BlockAvatar: blocky head
 * with two small glowing eyes, dark torso blocks, a faint seam line,
 * and a gentle float animation. aria-hidden: purely decorative.
 */
export function AvatarFallback({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <style>{`
        @keyframes fallback-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fallback-pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        @keyframes fallback-seam {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.8; }
        }
        .fallback-float { animation: fallback-float 5s ease-in-out infinite; }
        .fallback-pulse { animation: fallback-pulse 2.6s ease-in-out infinite; }
        .fallback-seam { animation: fallback-seam 3.4s ease-in-out infinite; }
      `}</style>
      <div className="fallback-float relative flex flex-col items-center">
        {/* Block head with two small glowing eyes */}
        <div className="relative h-24 w-24 border border-white/10 bg-[#141c30] shadow-[0_0_40px_rgba(34,211,238,0.15)]">
          {/* dark glass face plate */}
          <div className="absolute inset-x-3 top-3 bottom-3 bg-[#0a1220]/80" />
          <div className="fallback-pulse absolute left-[30%] top-[42%] h-1.5 w-1.5 rounded-sm bg-neon-glow shadow-[0_0_10px_rgba(103,232,249,0.9)]" />
          <div className="fallback-pulse absolute right-[30%] top-[42%] h-1.5 w-1.5 rounded-sm bg-neon-glow shadow-[0_0_10px_rgba(103,232,249,0.9)]" />
          {/* faint visor line */}
          <div className="fallback-seam absolute inset-x-4 top-[58%] h-px bg-neon/70" />
        </div>
        {/* Neck */}
        <div className="h-4 w-8 bg-[#1a2338]" />
        {/* Broad block torso with chest inlay */}
        <div className="relative h-28 w-36 border border-white/10 bg-[#0d1220] shadow-[0_0_40px_rgba(34,211,238,0.12)]">
          <div className="fallback-seam absolute left-3 top-0 h-full w-px bg-neon/50" />
          <div className="fallback-seam absolute right-3 top-0 h-full w-px bg-neon/50" />
          <div className="fallback-pulse absolute left-1/2 top-6 h-4 w-4 -translate-x-1/2 rotate-45 border border-neon/60 bg-neon/20" />
        </div>
        {/* Block arms */}
        <div className="pointer-events-none absolute left-1/2 top-[7.5rem] flex w-56 -translate-x-1/2 justify-between">
          <div className="h-24 w-8 bg-[#0d1220]" />
          <div className="h-24 w-8 bg-[#0d1220]" />
        </div>
        {/* Block legs */}
        <div className="flex gap-3">
          <div className="h-20 w-10 bg-[#1a2338]" />
          <div className="h-20 w-10 bg-[#1a2338]" />
        </div>
      </div>
    </div>
  );
}

export default AvatarFallback;
