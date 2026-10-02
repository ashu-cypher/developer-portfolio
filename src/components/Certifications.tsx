/**
 * Certifications — a premium certificate wall.
 *
 * Data comes from `portfolio.certifications` in src/data/portfolio.ts.
 * LinkedIn blocks automated reads of its certifications, so entries are
 * maintained by hand. NEVER invent certifications: when the array is
 * empty the section shows an elegant empty state explaining exactly
 * where to add real data — no fake Google/Microsoft/IBM cards.
 */
import { isConfigured, portfolio, type Certification } from "../data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

function Seal() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="text-neon/70"
    >
      <circle cx="22" cy="22" r="20" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <circle cx="22" cy="22" r="14.5" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <circle cx="22" cy="22" r="9" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M22 17.5l1.4 2.9 3.2.4-2.3 2.2.6 3.1-2.9-1.6-2.9 1.6.6-3.1-2.3-2.2 3.2-.4 1.4-2.9z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function CertificateCard({ cert }: { cert: Certification }) {
  const href = isConfigured(cert.credentialUrl)
    ? cert.credentialUrl
    : isConfigured(cert.assetPath)
      ? cert.assetPath
      : undefined;

  const inner = (
    <>
      {/* fine double border = certificate feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 rounded-xl border border-line/70"
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mist">
            Certificate
          </p>
          <h3 className="mt-2 font-display text-lg font-bold leading-snug text-ink">
            {cert.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-neon-glow">{cert.organization}</p>
        </div>
        <Seal />
      </div>

      <dl className="mt-5 space-y-2 text-sm">
        {isConfigured(cert.issueDate) && (
          <div className="flex items-center justify-between gap-4">
            <dt className="font-mono text-[11px] uppercase tracking-widest text-mist">
              Issued
            </dt>
            <dd className="text-ink/90">{cert.issueDate}</dd>
          </div>
        )}
        {isConfigured(cert.credentialId) && (
          <div className="flex items-center justify-between gap-4">
            <dt className="font-mono text-[11px] uppercase tracking-widest text-mist">
              Credential ID
            </dt>
            <dd className="truncate font-mono text-xs text-ink/90">{cert.credentialId}</dd>
          </div>
        )}
      </dl>

      {isConfigured(cert.credentialUrl) && (
        <span className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-neon/40 bg-neon/10 px-4 py-2 text-sm font-semibold text-neon-glow transition-colors duration-200 group-hover:border-neon/70 group-hover:bg-neon/15">
          Verify credential
          <span aria-hidden="true">→</span>
        </span>
      )}
    </>
  );

  const cls =
    "group glass relative flex h-full flex-col overflow-hidden rounded-2xl p-6 pt-7 transition-all duration-300 motion-safe:hover:-translate-y-1.5 motion-safe:hover:border-neon/40 motion-safe:hover:shadow-panel-glow";

  return (
    <Reveal className="h-full">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${cert.name} — ${cert.organization}${
            isConfigured(cert.credentialUrl) ? " (verify credential)" : ""
          }`}
          className={cls}
        >
          {inner}
        </a>
      ) : (
        <article aria-label={`${cert.name} — ${cert.organization}`} className={cls}>
          {inner}
        </article>
      )}
    </Reveal>
  );
}

function EmptyState() {
  return (
    <Reveal className="glass mx-auto mt-12 max-w-2xl rounded-2xl p-8 text-center sm:p-10">
      <div className="mx-auto w-fit opacity-80">
        <Seal />
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold text-ink">
        Certifications live here
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-mist">
        LinkedIn doesn&apos;t allow automated reads of its Licenses &amp;
        Certifications section, so this wall stays empty until real
        credentials are added — no placeholders, no invented certificates.
      </p>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-mist">
        To add one, open{" "}
        <span className="font-mono text-ink/90">src/data/portfolio.ts</span> and
        append to the{" "}
        <span className="font-mono text-ink/90">certifications</span> array:
      </p>
      <pre className="mx-auto mt-4 max-w-xl overflow-x-auto rounded-xl border border-line/60 bg-void/60 p-4 text-left font-mono text-xs leading-relaxed text-mist">
{`{
  name: "Certificate name",
  organization: "Issuing organization",
  issueDate: "Mar 2026",
  credentialId: "ABC-123",      // "" if none
  credentialUrl: "https://…",   // "" hides Verify
  assetPath: "",                // e.g. "/certs/name.pdf"
},`}
      </pre>
    </Reveal>
  );
}

export default function Certifications() {
  const certs = portfolio.certifications;

  return (
    <section
      id="certifications"
      aria-label="Certifications"
      className="relative z-10 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Credentials"
          title="Certifications"
          subtitle="Verified credentials only — every entry links to its real issuer or verification page."
        />

        {certs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certs.map((cert) => (
              <CertificateCard key={`${cert.organization}-${cert.name}`} cert={cert} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
