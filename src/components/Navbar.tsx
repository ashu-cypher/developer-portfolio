import { useEffect, useRef, useState } from "react";
import { portfolio } from "../data/portfolio";

interface NavbarProps {
  activeSection: string;
}

const LINKS: { label: string; href: string; id: string }[] = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Contact", href: "#contact", id: "contact" },
];

const linkCls = (active: boolean) =>
  `inline-flex min-h-[44px] items-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
    active ? "bg-neon/15 text-neon-glow" : "text-mist hover:text-ink"
  }`;

/**
 * Fixed floating pill navigation. Desktop (md+) shows inline links;
 * mobile shows the name + a hamburger opening a stacked menu panel.
 */
export default function Navbar({ activeSection }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open ]);

  useEffect(() => {
    if (open) firstLinkRef.current?.focus();
  }, [open]);

  const close = () => setOpen(false);

  return (
    <nav aria-label="Primary" className="fixed left-1/2 top-4 z-40 -translate-x-1/2">
      <div className="glass relative rounded-full px-2 py-2">
        {/* Desktop links */}
        <div className="hidden items-center md:flex">
          {LINKS.map((link) => {
            const active = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={linkCls(active)}
                aria-current={active ? "true" : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Mobile compact bar */}
        <div className="flex items-center justify-between gap-2 md:hidden">
          <a
            href="#home"
            className="inline-flex min-h-[44px] items-center rounded-full px-4 font-display text-sm font-semibold text-ink"
          >
            {portfolio.personal.name}
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-3 text-ink transition-colors hover:text-neon"
          >
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div
            id="mobile-menu"
            className="glass absolute left-0 right-0 top-[calc(100%+8px)] flex flex-col gap-1 rounded-2xl p-3 md:hidden"
          >
            {LINKS.map((link, i) => {
              const active = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  onClick={close}
                  className={`${linkCls(active)} w-full`}
                  aria-current={active ? "true" : undefined}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
