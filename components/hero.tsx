"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HeroStage, type StageMode } from "@/components/hero-stage";
import { ProjectPanel } from "@/components/project-panel";
import type { SceneController } from "@/components/orb-scene";
import { projects } from "@/lib/projects";

const controlClass =
  "inline-flex min-h-11 items-center justify-center rounded-full border-2 border-ice/40 px-5 text-sm font-semibold text-ivory transition-colors hover:border-ice hover:bg-ice/10 disabled:cursor-not-allowed disabled:opacity-50";

export function Hero() {
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState<StageMode>("loading");
  const controller = useRef<SceneController | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) setPaused(true);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setPaused(true);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const handleReady = useCallback((next: SceneController) => {
    controller.current = next;
    setMode("ready");
  }, []);

  const handleFail = useCallback(() => {
    controller.current = null;
    setMode("fallback");
  }, []);

  const selected = projects.find((project) => project.id === selectedId) ?? projects[0];
  const sceneReady = mode === "ready";

  return (
    <section id="top" aria-labelledby="hero-title" className="hero-bg relative isolate overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-ice">
          Anil Kumar · Hands-on AI projects
        </p>
        <h1
          id="hero-title"
          className="max-w-3xl text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-ivory sm:text-6xl lg:text-7xl"
        >
          Turning ideas into useful AI projects.
        </h1>
        <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-ivory-soft sm:text-xl">
          A collection of hands-on experiments by Anil Kumar — from multiplayer
          experiences to everyday automation.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <a
            href="#projects"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-cobalt px-7 text-base font-semibold text-white transition-colors hover:bg-cobalt-bright"
          >
            Explore projects
          </a>
          <a
            href="#about"
            className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-ice/50 px-7 text-base font-semibold text-ivory transition-colors hover:bg-ice hover:text-midnight"
          >
            About this portfolio
          </a>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <div>
            <HeroStage
              projects={projects}
              selectedId={selectedId}
              paused={paused}
              mode={mode}
              onSelect={setSelectedId}
              onReady={handleReady}
              onFail={handleFail}
            />
            <p className="mt-4 text-sm text-ivory-soft">
              {sceneReady
                ? "Drag the scene sideways to rotate it, or select a labelled node. Page scrolling is never blocked."
                : "Select a project to read about it."}
            </p>

            <div role="group" aria-label="Choose a project" className="mt-5 flex flex-wrap gap-2">
              {projects.map((project) => {
                const pressed = project.id === selectedId;
                return (
                  <button
                    key={project.id}
                    type="button"
                    aria-pressed={pressed}
                    onClick={() => setSelectedId(project.id)}
                    className={`min-h-11 rounded-full border-2 px-5 text-sm font-semibold transition-colors ${
                      pressed
                        ? "border-ice bg-ice text-midnight"
                        : "border-ice/40 text-ivory hover:border-ice hover:bg-ice/10"
                    }`}
                  >
                    {project.name}
                  </button>
                );
              })}
            </div>

            <div role="group" aria-label="Scene controls" className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className={controlClass}
                disabled={!sceneReady}
                onClick={() => controller.current?.reset()}
              >
                Reset view
              </button>
              <button
                type="button"
                className={controlClass}
                disabled={!sceneReady}
                onClick={() => setPaused((value) => !value)}
              >
                {paused ? "Resume animation" : "Pause animation"}
              </button>
              <button
                type="button"
                className={controlClass}
                disabled={!sceneReady}
                onClick={() => controller.current?.nudge(-1)}
              >
                <span aria-hidden="true">←</span>
                <span className="sr-only">Rotate scene left</span>
              </button>
              <button
                type="button"
                className={controlClass}
                disabled={!sceneReady}
                onClick={() => controller.current?.nudge(1)}
              >
                <span aria-hidden="true">→</span>
                <span className="sr-only">Rotate scene right</span>
              </button>
            </div>
          </div>

          <ProjectPanel project={selected} />
        </div>
      </div>
    </section>
  );
}
