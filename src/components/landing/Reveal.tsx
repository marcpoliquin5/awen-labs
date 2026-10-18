import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <Reveal className="max-w-3xl mb-14">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-4">{eyebrow}</p>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">{title}</h2>
      {children && <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{children}</p>}
    </Reveal>
  );
}
