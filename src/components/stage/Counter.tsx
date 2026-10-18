import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

/** Counts up to a real, verifiable number when scrolled into view. */
export default function Counter({ value, label, note }: { value: number; label: string; note?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    const c = animate(0, value, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setShown(Math.round(v)) });
    return () => c.stop();
  }, [inView, value]);

  return (
    <div ref={ref} className="lift rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur">
      <p className="text-4xl md:text-5xl font-semibold tabular-nums text-gold-metal" aria-label={String(value)}>
        {shown}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{label}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
