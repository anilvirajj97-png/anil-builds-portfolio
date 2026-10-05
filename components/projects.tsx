"use client";

import { useState } from "react";
import { filters, projects, type Filter } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";

export function Projects() {
  const [active, setActive] = useState<Filter>("All");

  const visible =
    active === "All"
      ? projects
      : projects.filter((project) => project.category === active);

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="border-t border-line bg-navy"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-ice">
          Projects
        </p>
        <h2
          id="projects-title"
          className="max-w-2xl text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-ivory sm:text-5xl"
        >
          Four things I&apos;ve been building.
        </h2>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const pressed = filter === active;
              return (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setActive(filter)}
                  className={`min-h-11 rounded-full border-2 px-5 text-sm font-semibold transition-colors ${
                    pressed
                      ? "border-ice bg-ice text-midnight"
                      : "border-ice/40 bg-transparent text-ivory hover:border-ice hover:bg-ice/10"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
          <p role="status" aria-live="polite" className="text-sm font-medium text-ivory-soft">
            Showing {visible.length} of {projects.length} projects
          </p>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {visible.map((project) => (
            <li key={project.id} className="flex">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
