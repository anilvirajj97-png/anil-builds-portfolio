import { projects } from "@/lib/projects";

const CENTER = { x: 320, y: 240 };

const orbits = [
  { id: "samewave", rx: 210, ry: 70, rot: -18, t: 3.6 },
  { id: "datebridge", rx: 250, ry: 95, rot: 14, t: 5.4 },
  { id: "replypilot", rx: 190, ry: 120, rot: -52, t: 2.2 },
  { id: "ai-builder-weekly", rx: 260, ry: 60, rot: 32, t: 3.9 },
];

function pointOnOrbit(rx: number, ry: number, rot: number, t: number) {
  const radians = (rot * Math.PI) / 180;
  const x = rx * Math.cos(t);
  const y = ry * Math.sin(t);
  return {
    x: CENTER.x + x * Math.cos(radians) - y * Math.sin(radians),
    y: CENTER.y + x * Math.sin(radians) + y * Math.cos(radians),
  };
}

export function StaticOrb({ selectedId }: { selectedId: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 640 480"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <radialGradient id="static-orb-core" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#d6e6ff" />
          <stop offset="35%" stopColor="#4d7bff" />
          <stop offset="100%" stopColor="#0f2a85" />
        </radialGradient>
        <radialGradient id="static-orb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4d7bff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#4d7bff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={CENTER.x} cy={CENTER.y} r="190" fill="url(#static-orb-glow)" />

      {orbits.map((orbit) => (
        <ellipse
          key={orbit.id}
          cx={CENTER.x}
          cy={CENTER.y}
          rx={orbit.rx}
          ry={orbit.ry}
          transform={`rotate(${orbit.rot} ${CENTER.x} ${CENTER.y})`}
          fill="none"
          stroke="#a9cdff"
          strokeOpacity="0.28"
        />
      ))}

      <circle cx={CENTER.x} cy={CENTER.y} r="74" fill="url(#static-orb-core)" />
      <circle
        cx={CENTER.x}
        cy={CENTER.y}
        r="92"
        fill="none"
        stroke="#a9cdff"
        strokeOpacity="0.35"
        strokeDasharray="3 7"
      />

      {orbits.map((orbit) => {
        const point = pointOnOrbit(orbit.rx, orbit.ry, orbit.rot, orbit.t);
        const project = projects.find((entry) => entry.id === orbit.id);
        const selected = orbit.id === selectedId;
        return (
          <g key={orbit.id}>
            <circle
              cx={point.x}
              cy={point.y}
              r={selected ? 13 : 9}
              fill="#f6f1e4"
              stroke="#a9cdff"
              strokeWidth={selected ? 4 : 2}
            />
            <text
              x={point.x}
              y={point.y + 34}
              textAnchor="middle"
              fontSize="16"
              fontWeight="600"
              fill={selected ? "#a9cdff" : "#f6f1e4"}
            >
              {project?.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
