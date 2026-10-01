import { portfolio, isConfigured } from "../data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export default function ResumeSection() {
  const configured = isConfigured(portfolio.resumePath);

  return (
    <section id="resume" aria-label="Resume" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="glass rounded-3xl p-8 text-center sm:p-10">
            <SectionHeading align="center" eyebrow="Resume" title="Want the complete picture?" />

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {configured ? (
                <>
                  <a
                    href={portfolio.resumePath}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary inline-flex min-h-[44px] items-center justify-center px-8"
                  >
                    View Resume
                  </a>
                  <a
                    href={portfolio.resumePath}
                    download
                    className="btn-ghost inline-flex min-h-[44px] items-center justify-center px-8"
                  >
                    Download Resume
                  </a>
                </>
              ) : (
                <>
                  <p className="max-w-md text-sm leading-relaxed text-mist">
                    My resume isn&apos;t attached yet — check back soon, or reach out via the contact
                    section below.
                  </p>
                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <button
                      type="button"
                      disabled
                      className="btn-disabled inline-flex min-h-[44px] items-center justify-center px-8"
                      title="Set resumePath in src/data/portfolio.ts"
                    >
                      View Resume
                    </button>
                    <button
                      type="button"
                      disabled
                      className="btn-disabled inline-flex min-h-[44px] items-center justify-center px-8"
                      title="Set resumePath in src/data/portfolio.ts"
                    >
                      Download Resume
                    </button>
                  </div>
                </>
              )}
            </div>

            {configured && (
              <p className="mt-6 font-mono text-xs text-mist">PDF · updated when I update it</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
