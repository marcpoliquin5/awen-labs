import { useEffect, useRef } from "react";
import type { SceneMode } from "@/lib/sceneStore";

// Lightweight animated undersea backdrop (CSS + 2D canvas) used on phones,
// with reduced motion (one still frame), and while the WebGL scene loads.

const PINK = "#ffb3c7", BUTTER = "#ffe08a", SEAFOAM = "#8ee8cf", LILAC = "#c9b8ff", PEACH = "#ffc9a8";
const NEON = ["#5ff2ff", "#ff6fb1", "#ffd85a", "#7dffc4"];

type T = { x: number; w: number; h: number; c: string; n: string; round?: boolean };
const TOWERS: T[] = [
  { x: 40, w: 120, h: 330, c: PINK, n: NEON[0] }, { x: 180, w: 90, h: 240, c: SEAFOAM, n: NEON[1] },
  { x: 290, w: 140, h: 430, c: BUTTER, n: NEON[1] }, { x: 450, w: 100, h: 290, c: LILAC, n: NEON[2], round: true },
  { x: 570, w: 150, h: 380, c: PINK, n: NEON[3] }, { x: 740, w: 110, h: 470, c: SEAFOAM, n: NEON[0] },
  { x: 870, w: 130, h: 320, c: PEACH, n: NEON[1] }, { x: 1020, w: 95, h: 260, c: BUTTER, n: NEON[3], round: true },
  { x: 1135, w: 140, h: 410, c: PINK, n: NEON[2] }, { x: 1295, w: 100, h: 300, c: SEAFOAM, n: NEON[1] },
];

function Tower({ t }: { t: T }) {
  const base = 900;
  const tiers = [0.62, 0.22, 0.16];
  let y = base;
  let w = t.w;
  const parts: JSX.Element[] = [];
  tiers.forEach((f, i) => {
    const h = t.h * f;
    const x = t.x + (t.w - w) / 2;
    y -= h;
    parts.push(<rect key={`b${i}`} x={x} y={y} width={w} height={h} rx={t.round ? w / 2.6 : 2} fill={t.c} opacity={i % 2 ? 0.85 : 1} />);
    parts.push(<rect key={`n${i}`} x={x - 2} y={y + 6} width={w + 4} height={3} fill={t.n} className="ocean-neon" style={{ animationDelay: `${-i * 0.6 - t.x / 400}s` }} />);
    if (i === 0) {
      for (let k = 1; k < Math.round(w / 22); k++) parts.push(<rect key={`p${k}`} x={x + (k * w) / Math.round(w / 22) - 2} y={y + 16} width={4} height={h - 24} fill="#fff3df" opacity={0.45} />);
    }
    if (i === 1) {
      const cx = x + w / 2, r = Math.min(w * 0.4, h * 0.8);
      parts.push(
        <g key="sun" stroke={t.n} strokeWidth={2.5} className="ocean-neon">
          {Array.from({ length: 9 }, (_, k) => {
            const a = Math.PI + (k / 8) * Math.PI;
            return <line key={k} x1={cx} y1={y + h} x2={cx + Math.cos(a) * r} y2={y + h + Math.sin(a) * r} />;
          })}
        </g>,
      );
    }
    w *= 0.74;
  });
  const cx = t.x + t.w / 2;
  parts.push(<line key="spire" x1={cx} y1={y} x2={cx} y2={y - 60} stroke="#fff3df" strokeWidth={3} />);
  parts.push(<circle key="tip" cx={cx} cy={y - 62} r={5} fill={t.n} className="ocean-neon" />);
  return <g>{parts}</g>;
}

function Skyline({ near }: { near: boolean }) {
  return (
    <svg
      viewBox="0 0 1400 900"
      preserveAspectRatio="xMidYMax slice"
      className={`absolute inset-0 h-full w-full transition-all duration-1000 ${near ? "opacity-70" : "opacity-30 scale-[0.8] translate-y-[8%] blur-[1px]"}`}
      style={{ transformOrigin: "50% 100%" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ob-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#155f93" stopOpacity="0.55" />
          <stop offset="1" stopColor="#155f93" stopOpacity="0" />
        </linearGradient>
      </defs>
      {TOWERS.map((t) => <Tower key={t.x} t={t} />)}
      <rect width="1400" height="900" fill="url(#ob-haze)" />
      <path d="M0 860 Q350 830 700 855 T1400 845 V900 H0Z" fill="#c9b48a" opacity="0.35" />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 30 + i * 88 + (i % 3) * 17, h = 90 + ((i * 53) % 140);
        return (
          <path key={i} d={`M${x} 900 C ${x - 18} ${900 - h * 0.4}, ${x + 18} ${900 - h * 0.7}, ${x} ${900 - h}`}
            stroke={i % 4 === 0 ? PINK : "#4fbf8f"} strokeWidth={6} fill="none" strokeLinecap="round"
            className="ocean-kelp" style={{ animationDelay: `${-i * 0.45}s`, transformOrigin: `${x}px 900px` }} />
        );
      })}
    </svg>
  );
}

/** Canvas bubbles: rise and wobble, pop on tap with a ripple. */
function BubbleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    let W = 0, H = 0;
    const resize = () => {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    type B = { x: number; y: number; r: number; v: number; ph: number; pop: number };
    const N = W < 768 ? 28 : 40;
    const spawn = (b: B, bottom: boolean) => {
      b.r = 4 + Math.pow(Math.random(), 2.5) * 30;
      b.x = Math.random() * W;
      b.y = bottom ? H + b.r + Math.random() * 80 : Math.random() * H;
      b.v = 18 + b.r * 1.6 + Math.random() * 12;
      b.ph = Math.random() * 6.28;
      b.pop = -1;
    };
    const bs: B[] = Array.from({ length: N }, () => { const b = { x: 0, y: 0, r: 0, v: 0, ph: 0, pop: -1 }; spawn(b, false); return b; });
    const rings: { x: number; y: number; r: number; a: number }[] = [];

    const draw = (b: B, t: number) => {
      const k = b.pop >= 0 ? 1 + b.pop * 0.6 : 1;
      const r = b.r * k, alpha = b.pop >= 0 ? 1 - b.pop : 1;
      ctx.globalAlpha = alpha;
      const g = ctx.createRadialGradient(b.x - r * 0.35, b.y - r * 0.4, r * 0.05, b.x, b.y, r);
      g.addColorStop(0, "rgba(255,255,255,0.55)");
      g.addColorStop(0.18, "rgba(255,255,255,0.05)");
      g.addColorStop(0.75, "rgba(150,230,255,0.04)");
      g.addColorStop(0.92, `hsla(${(t * 40 + b.ph * 60) % 360},90%,75%,0.45)`);
      g.addColorStop(1, "rgba(200,245,255,0.7)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, 6.2832); ctx.fill();
      ctx.lineWidth = Math.max(1, r * 0.06);
      ctx.strokeStyle = `hsla(${(t * 40 + b.ph * 60 + 120) % 360},90%,78%,0.35)`;
      ctx.beginPath(); ctx.arc(b.x, b.y, r * 0.9, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke();
      ctx.globalAlpha = 1;
    };

    let raf = 0, last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);
      for (const b of bs) {
        if (b.pop >= 0) {
          b.pop += dt / 0.25;
          if (b.pop >= 1) spawn(b, true);
        } else {
          b.y -= b.v * dt;
          b.x += Math.sin(t * 1.4 + b.ph) * dt * (20 - b.r * 0.4);
          if (b.y < -b.r - 10) spawn(b, true);
        }
        draw(b, t);
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const q = rings[i];
        q.a += dt / 0.8;
        if (q.a >= 1) { rings.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(200,250,255,${(1 - q.a) * 0.8})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(q.x, q.y, q.r * (0.5 + q.a * 2.5), 0, 6.2832); ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && !reduced && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    if (reduced) { ctx.clearRect(0, 0, W, H); bs.forEach((b) => draw(b, 0)); } else start();

    const onVis = () => (document.hidden ? stop() : start());
    const onDown = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (el?.closest?.("a,button,input,textarea,select,label,nav,header")) return;
      const rect = cv.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      let best: B | null = null, bd = Infinity;
      for (const b of bs) {
        const d = Math.hypot(b.x - x, b.y - y);
        if (b.pop < 0 && d < Math.max(28, b.r * 1.5) && d < bd) { best = b; bd = d; }
      }
      if (best) {
        best.pop = 0;
        rings.push({ x: best.x, y: best.y, r: best.r, a: 0 });
        window.dispatchEvent(new Event("scene:pop"));
      }
    };
    const onResize = () => resize();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

/** A small per-page motif layered over the shared ocean. */
function Motif({ mode }: { mode: SceneMode }) {
  switch (mode) {
    case "stack":
      return (
        <div className="absolute right-[8%] top-[22%] h-64 w-64 [perspective:800px]">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="ocean-plate absolute inset-x-0 mx-auto h-40 w-40 rounded-2xl border border-white/30"
              style={{ top: i * 34, animationDelay: `${-i * 0.5}s` }} />
          ))}
        </div>
      );
    case "timeline":
      return (
        <div className="absolute inset-0">
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} className="ocean-trail absolute rounded-full border border-white/60"
              style={{ left: `${62 + i * 1.6}%`, bottom: "-5%", width: 8 + (i % 4) * 5, height: 8 + (i % 4) * 5, animationDelay: `${-i * 0.6}s` }} />
          ))}
        </div>
      );
    case "interference":
      return (
        <div className="absolute inset-0">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="ocean-ring absolute left-[70%] top-[45%] h-[70vmin] w-[70vmin] rounded-full" style={{ animationDelay: `${-i * 1.2}s` }} />
          ))}
        </div>
      );
    case "streams":
      return (
        <div className="absolute inset-0 overflow-hidden font-mono text-sm text-[#8ee8cf]/60">
          {["λ", "Σ", "∫", "ψ", "⊗", "∇", "π", "φ", "{ }", "=", "0", "1"].map((g, i) => (
            <span key={i} className="ocean-glyph absolute flex h-8 w-8 items-center justify-center rounded-full border border-white/25"
              style={{ left: `${6 + i * 8}%`, animationDelay: `${-i * 0.9}s`, animationDuration: `${7 + (i % 4)}s` }}>{g}</span>
          ))}
        </div>
      );
    case "orbit":
      return (
        <div className="absolute left-1/2 top-[14%] -translate-x-1/2 lg:left-[28%] lg:top-[34%]">
          <div className="absolute -inset-16 rounded-full bg-[radial-gradient(circle,hsl(43_74%_55%/0.45),transparent_65%)] blur-2xl ocean-pulse" />
          <div className="relative h-28 w-28 rounded-full border border-[#e1b137]/40" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="ocean-orbit absolute left-1/2 top-1/2" style={{ animationDuration: `${8 + i * 4}s`, animationDirection: i % 2 ? "reverse" : "normal" }}>
              <span className="block h-3 w-3 rounded-full border border-white/70 bg-white/10" style={{ transform: `translateX(${90 + i * 40}px)` }} />
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function MobileBackdrop({ mode }: { mode: SceneMode }) {
  return (
    <div className="ocean-backdrop absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="ocean-caustics absolute inset-x-0 top-0 h-1/2" />
      {[8, 24, 41, 58, 73, 88].map((l, i) => (
        <span key={l} className="ocean-ray absolute top-[-10%] h-[90%]" style={{ left: `${l}%`, width: `${40 + (i % 3) * 30}px`, animationDelay: `${-i * 1.3}s` }} />
      ))}
      <Skyline near={mode === "lattice"} />
      <div key={mode} className="mb-enter absolute inset-0">
        <Motif mode={mode} />
      </div>
      <BubbleCanvas />
    </div>
  );
}
