import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  const titleId = `${project.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className="flex w-full flex-col rounded-3xl border border-line bg-ivory p-7 shadow-[0_1px_0_rgba(31,35,40,0.04)] transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(31,35,40,0.25)] sm:p-9"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-serif text-3xl text-cobalt" aria-hidden="true">
          {project.number}
        </span>
        <span className="rounded-full bg-cobalt-tint px-3 py-1 text-xs font-semibold text-cobalt-dark">
          {project.badge}
        </span>
      </div>

      <h3 id={titleId} className="mt-6 font-serif text-3xl font-semibold tracking-tight">
        {project.name}
      </h3>
      <p className="mt-4 text-pretty leading-relaxed text-charcoal-soft">
        {project.description}
      </p>

      {project.sections && (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Newsletter sections">
          {project.sections.map((section) => (
            <li
              key={section}
              className="rounded-full border border-charcoal/25 px-3 py-1 text-sm text-charcoal"
            >
              {section}
            </li>
          ))}
        </ul>
      )}

      {(project.note || project.link) && (
        <div className="mt-auto flex flex-col gap-4 pt-8">
          {project.note && (
            <p className="flex items-center gap-2 text-sm font-medium text-charcoal">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-cobalt" />
              {project.note}
            </p>
          )}
          {project.link && (
            <a
              href={project.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-charcoal px-6 text-sm font-semibold text-ivory transition-colors hover:bg-cobalt"
            >
              {project.link.label}
              <span className="sr-only">for {project.name} (opens in a new tab)</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 10l6-6M5 4h5v5" />
              </svg>
            </a>
          )}
        </div>
      )}
    </article>
  );
}
