import type { Project } from "@/lib/projects";

export function ProjectPanel({ project }: { project: Project }) {
  return (
    <div
      aria-live="polite"
      className="flex h-full flex-col rounded-3xl border border-ice/15 bg-navy/80 p-7 sm:p-8"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ice">
        Project {project.number} of 04
      </p>
      <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ivory sm:text-4xl">
        {project.name}
      </h2>
      <p className="mt-4 w-fit rounded-full border border-ice/30 px-3 py-1 text-xs font-semibold text-ice">
        {project.badge}
      </p>
      <p className="mt-6 text-pretty leading-relaxed text-ivory-soft">{project.description}</p>

      {project.sections && (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Newsletter sections">
          {project.sections.map((section) => (
            <li
              key={section}
              className="rounded-full border border-ice/25 px-3 py-1 text-sm text-ivory"
            >
              {section}
            </li>
          ))}
        </ul>
      )}

      {project.note && (
        <p className="mt-6 flex items-center gap-2 text-sm font-medium text-ivory">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ice" />
          {project.note}
        </p>
      )}

      {project.link && (
        <a
          href={project.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-ivory px-6 text-sm font-semibold text-midnight transition-colors hover:bg-ice"
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
  );
}
