import type { SceneMode } from "@/lib/sceneStore";
import { WAVEGUIDES, X_END, X_START, waveguidePoints } from "@/components/landing/meshLayout";

// Lightweight animated SVG/CSS backgrounds used on phones, with reduced
// motion (animations are disabled globally there), and while WebGL loads.
const W = 1400, H = 900;
const sx = (x: number) => ((x - X_START) / (X_END - X_START)) * 1500 - 50;
const sy = (y: number) => H / 2 - y * 110;
const paths = Array.from({ length: WAVEGUIDES }, (_, w) =>
  waveguidePoints(w, 120).map(([x, y], i) => `${i ? "L" : "M"}${sx(x).toFixed(0)},${sy(y).toFixed(0)}`).join(""),
);

const GOLD = "hsl(43 74% 55%)";
const BLUE = "hsl(208 88% 64%)";

function Lattice() {
  return (
    <g transform={`rotate(-8 ${W / 2} ${H / 2})`}>
      {paths.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke={GOLD} strokeOpacity="0.4" strokeWidth="1.6" />
          <path d={d} fill="none" stroke={BLUE} strokeWidth="3.5" strokeLinecap="round"
            className="mb-dash" style={{ animationDelay: `${-i * 0.7}s`, animationDuration: `${4 + (i % 3)}s` }} />
        </g>
      ))}
    </g>
  );
}

function Stack() {
  return (
    <g transform={`translate(${W * 0.62} ${H * 0.5})`}>
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} className="mb-float" style={{ animationDelay: `${-i * 0.5}s` }}>
          <polygon
            points="-260,0 0,-120 260,0 0,120"
            transform={`translate(0 ${(i - 2.5) * 62})`}
            fill={i % 2 ? "hsl(208 88% 60% / 0.06)" : "hsl(43 74% 55% / 0.07)"}
            stroke={i % 2 ? BLUE : GOLD}
            strokeOpacity="0.55"
          />
        </g>
      ))}
    </g>
  );
}

function Timeline() {
  return (
    <g>
      <line x1="0" y1={H * 0.55} x2={W} y2={H * 0.45} stroke={BLUE} strokeOpacity="0.35" strokeWidth="2" />
      {[0.22, 0.5, 0.78].map((f, i) => (
        <circle key={f} cx={W * f} cy={H * (0.55 - f * 0.1)} r="14" fill={GOLD} className="mb-pulse" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
      <circle r="7" fill={BLUE} className="mb-travel" style={{ offsetPath: `path("M0,${H * 0.55} L${W},${H * 0.45}")` }} />
    </g>
  );
}

function Interference() {
  return (
    <g>
      {[[W * 0.35, H * 0.6], [W * 0.65, H * 0.6]].map(([cx, cy], s) =>
        Array.from({ length: 6 }, (_, i) => (
          <circle key={`${s}-${i}`} cx={cx} cy={cy} r="300" fill="none" stroke={s ? BLUE : GOLD} strokeWidth="2"
            className="mb-ripple" style={{ animationDelay: `${-i * 0.8}s`, transformOrigin: `${cx}px ${cy}px` }} />
        )),
      )}
    </g>
  );
}

function Streams() {
  return (
    <g>
      {Array.from({ length: 22 }, (_, i) => (
        <line key={i} x1={40 + i * 64} y1="0" x2={40 + i * 64} y2={H} stroke={i % 5 === 0 ? GOLD : BLUE}
          strokeOpacity="0.5" strokeWidth="2" className="mb-stream"
          style={{ animationDuration: `${3 + ((i * 7) % 5)}s`, animationDelay: `${-i * 0.37}s` }} />
      ))}
    </g>
  );
}

function Orbit() {
  return (
    <g transform={`translate(${W * 0.6} ${H * 0.5})`}>
      <circle r="90" fill="url(#mb-core)" />
      {[180, 260, 340].map((rx, i) => (
        <g key={rx} className="mb-spin" style={{ animationDuration: `${18 + i * 8}s`, animationDirection: i % 2 ? "reverse" : "normal" }}>
          <ellipse rx={rx} ry={rx * 0.38} fill="none" stroke={i % 2 ? BLUE : GOLD} strokeOpacity="0.45" />
          <circle cx={rx} cy="0" r="6" fill={i % 2 ? BLUE : GOLD} />
        </g>
      ))}
    </g>
  );
}

const scenes: Record<SceneMode, () => JSX.Element> = {
  lattice: Lattice, stack: Stack, timeline: Timeline, interference: Interference, streams: Streams, orbit: Orbit,
};

export default function MobileBackdrop({ mode }: { mode: SceneMode }) {
  const Scene = scenes[mode];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="mb-core">
          <stop offset="0" stopColor="hsl(45 90% 70%)" stopOpacity="0.9" />
          <stop offset="1" stopColor="hsl(43 74% 55%)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g key={mode} className="mb-enter">
        <Scene />
      </g>
    </svg>
  );
}
