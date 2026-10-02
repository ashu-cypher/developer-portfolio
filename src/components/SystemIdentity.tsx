/**
 * SystemIdentity — an interactive "digital identity" readout shown in the
 * hero next to the 3D identity. A compact HUD panel: system status rows
 * plus selectable focus areas. Tasteful, keyboard-operable, no fake
 * terminal chatter.
 */
import { useState } from "react";
import { portfolio } from "../data/portfolio";

const FOCUS_AREAS: { label: string; blurb: string }[] = [
  { label: "AI & Intelligent Systems", blurb: "The specialization — systems that perceive, reason and act." },
  { label: "Agentic AI", blurb: "Orchestrated agents with memory, tools and verification." },
  { label: "Full-Stack Development", blurb: "React frontends, FastAPI backends, databases that behave." },
  { label: "Automation", blurb: "Pipelines and agents that remove repetitive work." },
  { label: "Computer Vision", blurb: "Teaching machines to see — the next frontier." },
  { label: "Software Engineering", blurb: "Clean architecture, honest limits, verified behavior." },
];

function StatusRow({ k, v, live = false }: { k: string; v: string; live?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-6 py-1">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist">{k}</span>
      <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider text-ink">
        {live && (
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
          </span>
        )}
        {v}
      </span>
    </div>
  );
}

export function SystemIdentity() {
  const [focus, setFocus] = useState(0);
  const active = FOCUS_AREAS[focus];

  return (
    <div
      className="glass w-full max-w-md rounded-2xl p-5"
      role="region"
      aria-label="Digital identity status"
    >
      <p className="font-mono text-sm font-semibold tracking-[0.25em] text-neon-glow">
        [ ASHUTOSH.DHAGAT ]
      </p>

      <div className="mt-3 border-t border-line pt-3">
        <StatusRow k="System status" v="ONLINE" live />
        <StatusRow k="Role" v="AI Engineer" />
        <StatusRow k="Location" v={portfolio.personal.location.toUpperCase() || "—"} />
        <StatusRow k="Build" v={portfolio.education.graduation || "—"} />
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist">
          Focus areas — select to inspect
        </p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Focus areas">
          {FOCUS_AREAS.map((f, i) => (
            <button
              key={f.label}
              type="button"
              onClick={() => setFocus(i)}
              aria-pressed={focus === i}
              className={`min-h-[36px] rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                focus === i
                  ? "border-neon/70 bg-neon/15 text-neon-glow shadow-neon-glow"
                  : "border-line bg-white/[0.03] text-mist hover:border-neon/40 hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="mt-3 min-h-[2.5rem] text-sm leading-relaxed text-mist">
          <span className="text-ink">{active.label}</span> — {active.blurb}
        </p>
      </div>
    </div>
  );
}
