/**
 * Projects section.
 *
 * - "Featured Builds": large case-study cards for the strongest projects
 *   (curated write-ups with detail modals — only verifiable information).
 * - "All Repositories": every real public repo from GitHub, rendered from
 *   `portfolio.githubRepos` (verified against the GitHub API), with
 *   category filter tabs. Each card links straight to the repository —
 *   no fabricated URLs anywhere.
 */
import { useMemo, useState } from "react";
import {
  formatRepoDate,
  isConfigured,
  portfolio,
  REPO_CATEGORY_LABEL,
  type GithubRepo,
  type Project,
  type RepoCategory,
} from "../data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ProjectModal } from "./ProjectModal";

type Filter = RepoCategory | "ALL";
const FILTERS: Filter[] = ["ALL", "AI-ML", "AI-AGENTS", "WEB", "AUTOMATION", "PYTHON", "OTHER"];

const LANGUAGE_COLOR: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
};

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Featured build: case-study card                                     */
/* ------------------------------------------------------------------ */
function FeaturedBuild({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (project: Project) => void;
}) {
  const hasGithub = isConfigured(project.github);
  const hasDemo = isConfigured(project.demo);
  // Demo-only projects (no GitHub repo) link the title to the live project.
  const primaryLink = hasGithub ? project.github : project.demo;
  return (
    <Reveal className="h-full">
      <article
        aria-label={`${project.name} — featured build`}
        className="glass group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-neon/40 motion-safe:hover:shadow-panel-glow"
      >
        <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
          <div>
            <p className="font-mono text-xs tracking-[0.25em] text-neon">FEATURED BUILD</p>
            <h3 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
              <a
                href={primaryLink}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-neon-glow"
              >
                {project.name}
              </a>
            </h3>
            <p className="mt-2 text-base leading-relaxed text-mist">{project.tagline}</p>
          </div>

          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-void/40 p-4">
              <dt className="font-mono text-[11px] uppercase tracking-widest text-neon">Problem</dt>
              <dd className="mt-2 line-clamp-4 text-sm leading-relaxed text-mist">
                {project.problem}
              </dd>
            </div>
            <div className="rounded-xl border border-line bg-void/40 p-4">
              <dt className="font-mono text-[11px] uppercase tracking-widest text-neon">Architecture</dt>
              <dd className="mt-2 line-clamp-4 text-sm leading-relaxed text-mist">
                {project.architecture}
              </dd>
            </div>
            <div className="rounded-xl border border-line bg-void/40 p-4">
              <dt className="font-mono text-[11px] uppercase tracking-widest text-neon">Stack</dt>
              <dd className="mt-2 text-sm leading-relaxed text-mist">
                {project.technologies.slice(0, 5).join(" · ")}
              </dd>
            </div>
          </dl>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
            {hasGithub ? (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="btn-primary min-h-[44px] px-5 py-2.5 text-sm"
              >
                <GitHubIcon size={16} />
                View on GitHub
              </a>
            ) : (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="btn-primary min-h-[44px] px-5 py-2.5 text-sm"
              >
                Open live project <span aria-hidden="true">→</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => onSelect(project)}
              className="btn-ghost min-h-[44px] px-5 py-2.5 text-sm"
            >
              Case study
            </button>
            {hasGithub && hasDemo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center px-2 text-sm font-medium text-mist transition-colors hover:text-neon-glow"
              >
                Live demo <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Repository card: the whole card links to the real repo              */
/* ------------------------------------------------------------------ */
function RepoCard({ repo }: { repo: GithubRepo }) {
  const langColor = LANGUAGE_COLOR[repo.language] ?? "#8b93a7";
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`${repo.name} on GitHub${repo.description ? ` — ${repo.description}` : ""}`}
      className="repo-card glass group flex h-full min-h-[44px] flex-col rounded-2xl p-6 transition-all duration-300 motion-safe:hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-neon-glow">
          {repo.name}
        </h4>
        <span className="shrink-0 text-mist transition-colors group-hover:text-neon">
          <GitHubIcon />
        </span>
      </div>

      {repo.description && (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-mist line-clamp-3">
          {repo.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-mist">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: langColor }}
            />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span className="inline-flex items-center gap-1" aria-label={`${repo.stars} stars`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.3l7.1-.7L12 2z" />
            </svg>
            {repo.stars}
          </span>
        )}
        <span>Updated {formatRepoDate(repo.updatedAt)}</span>
      </div>

      {repo.categories.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${repo.name} categories`}>
          {repo.categories.map((c) => (
            <li key={c} className="chip">
              {REPO_CATEGORY_LABEL[c]}
            </li>
          ))}
        </ul>
      )}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function ProjectShowcase() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState<Filter>("ALL");

  const featured = useMemo(
    () => portfolio.projects.filter((p) => isConfigured(p.github) || isConfigured(p.demo)),
    []
  );

  const repos = useMemo(() => {
    if (filter === "ALL") return portfolio.githubRepos;
    return portfolio.githubRepos.filter((r) => r.categories.includes(filter));
  }, [filter]);

  return (
    <section id="projects" aria-label="Projects" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Things I've Built"
          title="Projects"
          subtitle="Real repositories, real code — every card links to the actual project. Select a featured build for the full case study."
        />

        {/* Featured builds */}
        {featured.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-xl font-semibold text-ink">
              <span className="border-b-2 border-neon pb-1">Featured Builds</span>
            </h3>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {featured.map((project) => (
                <FeaturedBuild key={project.id} project={project} onSelect={setSelected} />
              ))}
            </div>
          </div>
        )}

        {/* All repositories */}
        <div className="mt-16">
          <h3 className="font-display text-xl font-semibold text-ink">
            <span className="border-b-2 border-pulse pb-1">All Repositories</span>
          </h3>
          <p className="mt-3 text-sm text-mist">
            Pulled from{" "}
            <a
              href={`https://github.com/${portfolio.githubUsername}`}
              target="_blank"
              rel="noreferrer"
              className="text-neon underline-offset-4 hover:underline"
            >
              github.com/{portfolio.githubUsername}
            </a>{" "}
            — verified live data, never fabricated.
          </p>

          <div
            className="mt-6 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter repositories by category"
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  filter === f
                    ? "border-neon/70 bg-neon/15 text-neon-glow shadow-neon-glow"
                    : "border-line bg-white/[0.03] text-mist hover:border-neon/40 hover:text-ink"
                }`}
              >
                {f === "ALL" ? "All" : REPO_CATEGORY_LABEL[f]}
              </button>
            ))}
          </div>

          {repos.length === 0 ? (
            <div className="glass mt-6 rounded-2xl p-8 text-center">
              <p className="text-mist">No repositories in this category yet.</p>
            </div>
          ) : (
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {repos.map((repo) => (
                <li key={repo.name} className="h-full">
                  <RepoCard repo={repo} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
