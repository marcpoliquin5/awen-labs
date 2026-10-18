import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/** Route hero: staggered word reveal with scroll parallax over the shared background. */
export default function PageHeader({
  eyebrow,
  title,
  accent,
  children,
  aside,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const words = title.split(" ");

  return (
    <section ref={ref} className="relative flex min-h-[78svh] items-end overflow-hidden pt-32 pb-16 md:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-background/80 via-background/30 to-transparent" />
      <motion.div style={{ y, opacity }} className="container relative mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-accent"
        >
          <span className="h-px w-8 bg-accent" />
          {eyebrow}
        </motion.p>
        <h1 className="mt-6 max-w-4xl text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.04] text-foreground">
          <span className="sr-only">{`${title}${accent ? ` ${accent}` : ""}`}</span>
          <span aria-hidden="true">
            {words.map((w, i) => (
              <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block mr-[0.22em]"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
            {accent && (
              <span className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="inline-block text-gold-metal"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 + words.length * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  {accent}
                </motion.span>
              </span>
            )}
          </span>
        </h1>
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 + words.length * 0.05 }}
            className="mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-muted-foreground"
          >
            {children}
          </motion.div>
        )}
        {aside && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-10"
          >
            {aside}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
