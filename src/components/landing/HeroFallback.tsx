import { COLUMNS, WAVEGUIDES, X_END, X_START, couplers, waveguidePoints } from "./meshLayout";

// Static, dependency-free rendering of the same interferometer mesh used by
// the WebGL scene. Shown on small screens, with reduced motion, without
// WebGL, and while the 3D scene loads.
const W = 1400;
const H = 640;
const sx = (x: number) => ((x - X_START) / (X_END - X_START)) * (W - 160) + 60;
const sy = (y: number) => H / 2 - y * 92;

const paths = Array.from({ length: WAVEGUIDES }, (_, w) =>
  waveguidePoints(w, 160)
    .map(([x, y], i) => `${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`)
    .join(""),
);

export default function HeroFallback({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wg" x1="0" x2="1">
          <stop offset="0" stopColor="hsl(43 74% 55%)" stopOpacity="0" />
          <stop offset="0.15" stopColor="hsl(43 74% 55%)" stopOpacity="0.7" />
          <stop offset="0.85" stopColor="hsl(208 88% 60%)" stopOpacity="0.7" />
          <stop offset="1" stopColor="hsl(208 88% 60%)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="node">
          <stop offset="0" stopColor="hsl(208 90% 72%)" stopOpacity="0.9" />
          <stop offset="1" stopColor="hsl(43 74% 55%)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fr" x1="0" y1="0" x2="0" y2="1">
          {Array.from({ length: 25 }, (_, i) => {
            const y = i / 24;
            const v = Math.cos((y - 0.5) * 2 * 18) * 0.5 + 0.5;
            const env = Math.exp(-(((y - 0.5) * 2) ** 2) * 2.2);
            return <stop key={i} offset={y} stopColor="hsl(208 88% 64%)" stopOpacity={(v ** 3 * env * 0.8).toFixed(3)} />;
          })}
        </linearGradient>
      </defs>
      <g transform={`rotate(-4 ${W / 2} ${H / 2}) translate(60 10)`}>
        {paths.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="url(#wg)" strokeWidth="10" strokeOpacity="0.08" />
            <path d={d} fill="none" stroke="url(#wg)" strokeWidth="1.6" />
          </g>
        ))}
        {couplers.map((k, i) => (
          <circle
            key={i}
            cx={sx(k.x)}
            cy={sy(k.y)}
            r={10 + ((k.column * 7 + k.lower * 3) % 5)}
            fill="url(#node)"
            opacity={0.35 + (k.column / (COLUMNS - 1)) * 0.45}
          />
        ))}
        <rect x={sx(X_END) + 8} y={H / 2 - 250} width="34" height="500" fill="url(#fr)" />
      </g>
    </svg>
  );
}
