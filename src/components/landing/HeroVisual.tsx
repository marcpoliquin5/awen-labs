import { Suspense, lazy, useEffect, useState } from "react";
import HeroFallback from "./HeroFallback";

const PhotonicScene = lazy(() => import("./PhotonicScene"));

function canRender3D(): boolean {
  if (typeof window === "undefined") return false;
  const mq = (q: string) => window.matchMedia?.(q).matches ?? false;
  if (mq("(prefers-reduced-motion: reduce)")) return false;
  if (mq("(max-width: 767px)") || mq("(pointer: coarse)")) return false;
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
 * Hero background. Renders the static mesh immediately; on capable desktops
 * it loads the WebGL scene on first interaction (or after a short delay) and
 * cross-fades to it.
 */
export default function HeroVisual() {
  const [use3D, setUse3D] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canRender3D()) return;
    // Defer the WebGL bundle until the visitor engages (or a few seconds pass),
    // so first paint and interactivity never wait on three.js.
    let done = false;
    const start = () => {
      if (done) return;
      done = true;
      cleanup();
      setUse3D(true);
    };
    const events = ["pointermove", "pointerdown", "wheel", "scroll", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
    const timer = window.setTimeout(start, 5000);
    function cleanup() {
      events.forEach((e) => window.removeEventListener(e, start));
      window.clearTimeout(timer);
    }
    return cleanup;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <HeroFallback
        className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
          ready ? "opacity-0" : "opacity-70"
        }`}
      />
      {use3D && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <Suspense fallback={null}>
            <PhotonicScene onReady={() => setReady(true)} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
