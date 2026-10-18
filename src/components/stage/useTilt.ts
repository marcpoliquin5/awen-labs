import { useEffect } from "react";

const SELECTOR = ".lift, .glass-card";

/**
 * Site-wide hover tilt and cursor glow for cards, via one delegated listener.
 * Sets --rx/--ry (tilt) and --mx/--my (glow position) on the hovered card.
 */
export function useTilt() {
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced) return;
    let current: HTMLElement | null = null;
    let frame = 0;
    let last: PointerEvent | null = null;

    const reset = (el: HTMLElement) => {
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
      el.classList.remove("is-tilting");
    };

    const apply = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const el = (e.target as Element | null)?.closest?.(SELECTOR) as HTMLElement | null;
      if (current && current !== el) reset(current);
      current = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      // Large panels tilt less.
      const amt = Math.min(1, 420 / Math.max(r.width, r.height)) * 7;
      el.style.setProperty("--ry", `${((x - 0.5) * amt).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-(y - 0.5) * amt).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      el.classList.add("is-tilting");
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => current && reset(current);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);
}
