import { isConfigured, portfolio } from "../data/portfolio";

/**
 * Site footer: name + tagline on the left, social links on the right,
 * dynamic copyright year at the bottom. Links render only when configured.
 */
export default function Footer() {
  const { personal, socials } = portfolio;
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="font-display text-lg font-semibold text-ink">{personal.name}</p>
            <p className="mt-1 text-sm text-mist">Built with curiosity, code &amp; caffeine.</p>
          </div>
          <nav aria-label="Social" className="flex flex-wrap items-center gap-2">
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center rounded-full px-3 text-sm text-mist transition-colors hover:text-neon"
            >
              GitHub
            </a>
            {isConfigured(socials.linkedin) && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-full px-3 text-sm text-mist transition-colors hover:text-neon"
              >
                LinkedIn
              </a>
            )}
            {isConfigured(socials.email) && (
              <a
                href={`mailto:${socials.email}`}
                className="inline-flex min-h-[44px] items-center rounded-full px-3 text-sm text-mist transition-colors hover:text-neon"
              >
                Email
              </a>
            )}
          </nav>
        </div>
        <p className="mt-8 text-sm text-mist">
          © {year} {personal.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
