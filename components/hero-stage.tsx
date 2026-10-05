"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import { StaticOrb } from "@/components/static-orb";
import type { SceneController } from "@/components/orb-scene";

const OrbScene = dynamic(() => import("@/components/orb-scene"), {
  ssr: false,
  loading: () => null,
});

export type StageMode = "loading" | "ready" | "fallback";

class SceneBoundary extends Component<
  { onFail: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type HeroStageProps = {
  projects: { id: string; name: string }[];
  selectedId: string;
  paused: boolean;
  mode: StageMode;
  onSelect: (id: string) => void;
  onReady: (controller: SceneController) => void;
  onFail: () => void;
};

export function HeroStage({
  projects,
  selectedId,
  paused,
  mode,
  onSelect,
  onReady,
  onFail,
}: HeroStageProps) {
  return (
    <div
      role="group"
      aria-label="Scene showing four projects orbiting a central orb. The project buttons below offer the same content as text."
      className="relative h-[22rem] w-full overflow-hidden rounded-3xl border border-ice/15 bg-navy/60 sm:h-[28rem] lg:h-[34rem]"
    >
      {mode !== "ready" && <StaticOrb selectedId={selectedId} />}
      {mode !== "fallback" && (
        <SceneBoundary onFail={onFail}>
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              mode === "ready" ? "opacity-100" : "opacity-0"
            }`}
          >
            <OrbScene
              projects={projects}
              selectedId={selectedId}
              paused={paused}
              onSelect={onSelect}
              onReady={onReady}
              onError={onFail}
            />
          </div>
        </SceneBoundary>
      )}
      {mode === "fallback" && (
        <p
          role="status"
          className="absolute inset-x-4 bottom-4 rounded-xl bg-midnight/80 px-4 py-3 text-sm text-ivory-soft"
        >
          The 3D view is unavailable on this device. The project buttons and details work the same.
        </p>
      )}
    </div>
  );
}
