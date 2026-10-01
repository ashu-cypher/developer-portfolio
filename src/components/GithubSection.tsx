import { portfolio, isConfigured } from "../data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export default function GithubSection() {
  const profileUrl = `https://github.com/${portfolio.githubUsername}`;
  const featured = portfolio.projects.filter((p) => isConfigured(p.github));

  return (
    <section id="github" aria-label="GitHub" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Code / GitHub" title="Open Source & Code" />

        <Reveal className="mt-12">
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="glass flex min-h-[44px] flex-wrap items-center justify-between gap-4 rounded-2xl p-6 transition-colors motion-safe:hover:border-neon/50"
            aria-label={`Visit ${portfolio.githubUsername} on GitHub`}
          >
            <span className="font-mono text-lg text-neon">@{portfolio.githubUsername}</span>
            <span className="text-sm font-medium text-ink">
              View profile <span aria-hidden="true">→</span>
            </span>
          </a>
        </Reveal>

        <div className="mt-12">
          <h3 className="font-display text-xl font-semibold text-ink">Featured repositories</h3>

          {featured.length === 0 ? (
            <Reveal className="glass mt-6 rounded-2xl p-8 text-center">
              <p className="text-mist">
                Repositories haven&apos;t been linked yet — they&apos;ll appear here once the GitHub
                URLs are added.
              </p>
            </Reveal>
          ) : (
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {featured.map((project, i) => (
                <Reveal key={project.id} as="li" delay={Math.min(i * 0.08, 0.32)}>
                  <article className="glass flex h-full flex-col rounded-2xl p-6">
                    <h4 className="font-display text-lg font-semibold text-ink">{project.name}</h4>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-mist">{project.tagline}</p>
                    {project.technologies.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${project.name} technologies`}>
                        {project.technologies.slice(0, 3).map((tech) => (
                          <li key={tech} className="chip text-xs">
                            {tech}
                          </li>
                        ))}
                      </ul>
                    )}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex min-h-[44px] w-fit items-center gap-1 text-sm font-medium text-neon transition-colors motion-safe:hover:text-neon-glow"
                      aria-label={`View ${project.name} on GitHub`}
                    >
                      View on GitHub <span aria-hidden="true">→</span>
                    </a>
                  </article>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
