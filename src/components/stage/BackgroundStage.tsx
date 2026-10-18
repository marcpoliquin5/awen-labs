import { Suspense, lazy, useEffect, useState } from "react";
import { useSceneMode } from "@/lib/sceneStore";
import MobileBackdrop from "./MobileBackdrop";

const BackgroundCanvas = lazy(() => import("./BackgroundCanvas"));

function canRender3D(): boolean {
  const mq = (q: string) => window.matchMedia?.(q).matches ?? false;
  if (mq("(prefers-reduced-motion: reduce)") || mq("(max-width: 767px)") || mq("(pointer: coarse)")) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * One persistent background for the whole site. Desktops get a single shared
 * WebGL canvas whose scene morphs per route; everything else gets an animated
 * SVG backdrop. The WebGL bundle loads on first interaction (or after 5 s).
 */
export default function BackgroundStage() {
  const mode = useSceneMode();
  const [use3D, setUse3D] = useState(false);
  const [ready, setReady] = useState(false);
  const [pops, setPops] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Without WebGL (phones, reduced data), taps on the background send out a ripple of light.
  useEffect(() => {
    if (use3D) return;
    let id = 0;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (t?.closest?.("a,button,input,textarea,select,label,nav,header")) return;
      const r = { id: ++id, x: e.clientX, y: e.clientY };
      setRipples((rs) => [...rs.slice(-4), r]);
      window.setTimeout(() => setRipples((rs) => rs.filter((q) => q.id !== r.id)), 1200);
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, [use3D]);
  useEffect(() => {
    const onPop = () => setPops((n) => n + 1);
    window.addEventListener("scene:pop", onPop);
    return () => window.removeEventListener("scene:pop", onPop);
  }, []);

  useEffect(() => {
    if (!canRender3D()) return;
    let done = false;
    const events = ["pointermove", "pointerdown", "wheel", "scroll", "keydown"] as const;
    const start = () => {
      if (done) return;
      done = true;
      cleanup();
      setUse3D(true);
    };
    events.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
    const timer = window.setTimeout(start, 5000);
    function cleanup() {
      events.forEach((e) => window.removeEventListener(e, start));
      window.clearTimeout(timer);
    }
    return cleanup;
  }, []);

  return (
    <>
    <div className="fixed inset-0 z-0 pointer-events-none bg-background" aria-hidden="true">
      <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-0" : use3D ? "opacity-50" : "opacity-100"}`}>
        <MobileBackdrop mode={mode} />
      </div>
      {use3D && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <Suspense fallback={null}>
            <BackgroundCanvas onReady={() => setReady(true)} />
          </Suspense>
        </div>
      )}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="tap-ripple absolute h-40 w-40 rounded-full border border-primary/60"
          style={{ left: r.x, top: r.y }}
        />
      ))}
      {/* Vignette keeps foreground text readable over the scene. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(40_12%_3%/0.75)_100%)]" />
    </div>
    {ready && (
      <p className="scene-hint pointer-events-none fixed bottom-5 left-5 z-40 hidden lg:flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3.5 py-1.5 font-mono text-[11px] text-muted-foreground backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_hsl(208_88%_60%)]" aria-hidden="true" />
        Drag the background to rotate · click a bubble to pop it
        {pops > 0 && <span className="text-primary" data-testid="pop-count">· {pops} popped</span>}
      </p>
    )}
    </>
  );
}
