import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { isConfigured, portfolio } from "../data/portfolio";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

type FormState = "idle" | "sending" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputCls =
  "w-full rounded-xl border border-line bg-white/5 px-4 py-3 text-ink placeholder:text-mist/60 outline-none transition-colors duration-200 focus:border-neon/60 focus:ring-2 focus:ring-neon/20";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

function ContactCard({
  label,
  value,
  href,
  configured,
  hint,
}: {
  label: string;
  value: string;
  href?: string;
  configured: boolean;
  hint?: string;
}) {
  const body = (
    <>
      <span className="font-mono text-xs tracking-widest text-neon">{label}</span>
      {configured ? (
        <span className="break-all text-sm text-ink">{value}</span>
      ) : (
        <span className="text-sm text-mist">{hint ?? `${value} — not configured yet`}</span>
      )}
    </>
  );

  if (configured && href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="glass flex min-h-[44px] flex-col justify-center gap-1 rounded-2xl p-5 transition-colors duration-200 hover:border-neon/40"
      >
        {body}
      </a>
    );
  }

  return (
    <div className="glass flex min-h-[44px] flex-col justify-center gap-1 rounded-2xl p-5 opacity-70">
      {body}
    </div>
  );
}

/**
 * Contact section: method cards (driven by portfolio.socials, honest about
 * anything not configured) + a backend-less form that hands off to the
 * visitor's email client via mailto.
 */
export default function ContactSection() {
  const { socials } = portfolio;
  const emailConfigured = isConfigured(socials.email);
  const linkedinConfigured = isConfigured(socials.linkedin);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<FormState>("idle");
  const [statusNote, setStatusNote] = useState("");
  const timerRef = useRef<number | undefined>(undefined);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = "Please enter your name (at least 2 characters).";
    if (!EMAIL_RE.test(email.trim())) next.email = "Please enter a valid email address.";
    if (message.trim().length < 10)
      next.message = "Please write a message of at least 10 characters.";
    return next;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setState("error");
      setStatusNote("Please fix the highlighted fields and try again.");
      return;
    }
    if (!emailConfigured) {
      setState("error");
      setStatusNote("Email isn't configured yet — set it in src/data/portfolio.ts.");
      return;
    }
    setState("sending");
    setStatusNote("Opening your email client…");
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const subject = encodeURIComponent(`Portfolio contact from ${name.trim()}`);
      const body = encodeURIComponent(`${message.trim()}\n\n— ${name.trim()}`);
      window.location.href = `mailto:${socials.email}?subject=${subject}&body=${body}`;
      setState("success");
      setStatusNote("Opening your email client…");
    }, 900);
  };

  const reset = () => {
    window.clearTimeout(timerRef.current);
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
    setState("idle");
    setStatusNote("");
  };

  const errId = (field: keyof FieldErrors) => `contact-${field}-error`;

  return (
    <section id="contact" aria-label="Contact" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something."
          subtitle="Have a project, internship opportunity, collaboration or interesting idea? Let's talk."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {/* Left: contact method cards */}
          <Reveal>
            <div className="flex flex-col gap-4">
              <ContactCard
                label="EMAIL"
                value={emailConfigured ? socials.email : "Email"}
                href={emailConfigured ? `mailto:${socials.email}` : undefined}
                configured={emailConfigured}
                hint="Email — not configured yet"
              />
              <ContactCard
                label="GITHUB"
                value={socials.github}
                href={socials.github}
                configured={isConfigured(socials.github)}
              />
              <ContactCard
                label="LINKEDIN"
                value={linkedinConfigured ? socials.linkedin : "LinkedIn"}
                href={linkedinConfigured ? socials.linkedin : undefined}
                configured={linkedinConfigured}
                hint="LinkedIn — not configured yet"
              />
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={0.1}>
            {state === "success" ? (
              <div className="glass flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl p-8 text-center">
                <p className="font-display text-xl font-semibold text-ink">Message on its way.</p>
                <p className="text-sm text-mist">{statusNote}</p>
                <button
                  type="button"
                  onClick={reset}
                  className="btn-ghost inline-flex min-h-[44px] items-center justify-center rounded-xl px-6"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="glass flex flex-col gap-5 rounded-2xl p-6 sm:p-8">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-ink">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    aria-describedby={errors.name ? errId("name") : undefined}
                    aria-invalid={errors.name ? "true" : undefined}
                    className={`${inputCls} min-h-[44px]`}
                  />
                  {errors.name && (
                    <p id={errId("name")} role="alert" className="mt-2 text-sm text-pulse-glow">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-ink">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-describedby={errors.email ? errId("email") : undefined}
                    aria-invalid={errors.email ? "true" : undefined}
                    className={`${inputCls} min-h-[44px]`}
                  />
                  {errors.email && (
                    <p id={errId("email")} role="alert" className="mt-2 text-sm text-pulse-glow">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-ink">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    minLength={10}
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What would you like to build together?"
                    aria-describedby={errors.message ? errId("message") : undefined}
                    aria-invalid={errors.message ? "true" : undefined}
                    className={inputCls}
                  />
                  {errors.message && (
                    <p id={errId("message")} role="alert" className="mt-2 text-sm text-pulse-glow">
                      {errors.message}
                    </p>
                  )}
                </div>

                <p aria-live="polite" className="min-h-[1.5rem] text-sm text-mist">
                  {state === "sending" || state === "error" ? statusNote : ""}
                </p>

                {!emailConfigured ? (
                  <button
                    type="button"
                    disabled
                    title="Email isn't configured yet — set it in src/data/portfolio.ts."
                    className="btn-disabled inline-flex min-h-[44px] items-center justify-center rounded-xl px-6"
                  >
                    Contact email not configured
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="btn-primary inline-flex min-h-[44px] items-center justify-center rounded-xl px-6"
                  >
                    {state === "sending" ? "Opening email…" : "Send message"}
                  </button>
                )}
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
