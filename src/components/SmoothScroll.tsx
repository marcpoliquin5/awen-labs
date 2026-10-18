import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

/** Lenis smooth scrolling (MIT, darkroom.engineering); off for reduced motion and touch. */
export default function SmoothScroll() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const update = () => setEnabled(!reduce.matches && !coarse.matches);
    update();
    reduce.addEventListener("change", update);
    return () => reduce.removeEventListener("change", update);
  }, []);
  if (!enabled) return null;
  return <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -72 } }} />;
}
