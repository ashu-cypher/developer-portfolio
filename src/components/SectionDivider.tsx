/**
 * SectionDivider — a quiet visual breath between sections: a hairline
 * that fades in from the edges toward a soft central node. Keeps the
 * page feeling like one continuous narrative rather than stacked pages.
 */
export function SectionDivider() {
  return (
    <div aria-hidden="true" className="relative z-10 mx-auto w-full max-w-6xl px-6">
      <div className="flex items-center gap-4 opacity-70">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-line to-line/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-neon/50 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-line to-line/40" />
      </div>
    </div>
  );
}
