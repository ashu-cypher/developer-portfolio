import { useState } from "react";
import { portfolio, type Project } from "../data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";

/**
 * Projects section: heading, card grid, and the detail modal.
 * Everything renders from `portfolio.projects` — never fabricated.
 */
export default function ProjectShowcase() {
  const [selected, setSelected] = useState<Project | null>(null);
  const projects = portfolio.projects;

  return (
    <section id="projects" aria-label="Projects" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Things I've Built"
          title="Projects"
          subtitle="Real projects, real code — select any project for the full story."
        />

        {projects.length === 0 ? (
          <Reveal className="mt-12">
            <div className="glass rounded-2xl p-8 text-center sm:p-12">
              <p className="font-display text-xl font-semibold text-ink">Projects coming soon</p>
              <p className="mt-2 text-sm text-mist">
                Add your projects in <span className="font-mono">src/data/portfolio.ts</span> and
                they&apos;ll show up here.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onSelect={setSelected}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
