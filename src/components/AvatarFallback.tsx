/**
 * AvatarFallback — pure CSS/DOM blocky avatar used as the Suspense fallback
 * and the WebGL-unavailable fallback for the 3D avatar scene.
 *
 * Mirrors the 3D avatar's colors (dark slate body, cyan accents, violet
 * details) and bobs gently. aria-hidden: purely decorative.
 */
export function AvatarFallback({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <style>{`
        @keyframes avatar-blink {
          0%, 91%, 100% { transform: scaleY(1); }
          94.5% { transform: scaleY(0.08); }
        }
        .avatar-eye { animation: avatar-blink 3.4s ease-in-out infinite; transform-origin: center; }
      `}</style>
      <div className="animate-floaty flex w-44 flex-col items-center">
        {/* Antenna */}
        <div className="flex flex-col items-center">
          <div className="h-2.5 w-2.5 rounded-full bg-pulse shadow-[0_0_10px_rgba(167,139,250,0.9)]" />
          <div className="h-5 w-[3px] bg-[#2b3a5f]" />
        </div>
        {/* Head */}
        <div className="relative flex h-20 w-24 items-center justify-center rounded-xl bg-[#1b2540] shadow-[0_0_30px_rgba(34,211,238,0.15)]">
          {/* Headphone cups */}
          <div className="absolute -left-1.5 top-1/2 h-10 w-2.5 -translate-y-1/2 rounded-full bg-neon/80" />
          <div className="absolute -right-1.5 top-1/2 h-10 w-2.5 -translate-y-1/2 rounded-full bg-neon/80" />
          {/* Eyes */}
          <div className="absolute left-1/2 top-5 flex -translate-x-1/2 gap-4">
            <div className="avatar-eye h-3.5 w-2.5 rounded-sm bg-[#05070f]" />
            <div className="avatar-eye h-3.5 w-2.5 rounded-sm bg-[#05070f]" style={{ animationDelay: "0.06s" }} />
          </div>
          {/* Smile */}
          <div className="absolute bottom-4 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-neon shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        </div>
        {/* Torso */}
        <div className="relative mt-1.5 h-24 w-28 rounded-xl bg-[#1b2540]">
          <div className="absolute left-1/2 top-3 h-12 w-10 -translate-x-1/2 rounded-md border border-neon/50 bg-neon/15" />
          <div className="absolute bottom-0 left-0 right-0 h-2.5 rounded-b-xl bg-pulse/70" />
        </div>
        {/* Legs + boots */}
        <div className="mt-1.5 flex gap-3">
          <div className="flex flex-col items-center">
            <div className="h-10 w-7 rounded-md bg-[#1b2540]" />
            <div className="mt-1 h-3 w-8 rounded-md bg-neon/80" />
          </div>
          <div className="flex flex-col items-center">
            <div className="h-10 w-7 rounded-md bg-[#1b2540]" />
            <div className="mt-1 h-3 w-8 rounded-md bg-neon/80" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvatarFallback;
