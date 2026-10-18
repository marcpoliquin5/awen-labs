import { Check, CircleDot, Circle } from "lucide-react";
import Reveal, { SectionHeading } from "./Reveal";
import { BRAND } from "@/config/brand";

const phases = [
  {
    label: "Now",
    title: "Simulation-first stack",
    icon: Check,
    tone: "text-primary border-primary/50 bg-primary/10",
    items: [
      "Tensor-to-photonic compiler and MLIR lowering for matrix workloads",
      "Runtime, scheduler, and calibration-aware compilation",
      "Seeded analog-noise simulator with CPU reference comparison",
      "Framework integration for PyTorch, JAX, and NumPy",
    ],
  },
  {
    label: "Next",
    title: "First public release",
    icon: CircleDot,
    tone: "text-accent border-accent/50 bg-accent/10",
    items: [
      "Prebuilt, signed releases via GitHub Releases",
      "Getting-started guides and API reference",
      "Hardware-in-the-loop benchmarking with published, reproducible artifacts",
    ],
  },
  {
    label: "Later",
    title: "Program light like a GPU",
    icon: Circle,
    tone: "text-muted-foreground border-border bg-secondary/40",
    items: [
      "CUDA-like kernel programming model for AI workloads",
      "Photonic instruction set architecture",
      "Support for physical photonic processors",
    ],
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative py-28 md:py-36 scroll-mt-20">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Roadmap" title={`Where ${BRAND.name} is, and where it's going.`}>
          Milestones, not dates. Each phase ships when it can be verified.
        </SectionHeading>
        <div className="relative grid md:grid-cols-3 gap-5">
          <div className="absolute left-0 right-0 top-[29px] hidden md:block h-px bg-linear-to-r from-primary/60 via-accent/40 to-border" aria-hidden="true" />
          {phases.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.1}>
              <div className="relative">
                <span className={`relative z-10 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold backdrop-blur ${p.tone}`}>
                  <p.icon className="h-4 w-4" />
                  {p.label}
                </span>
                <div className="mt-6 rounded-2xl border border-border/60 bg-card/40 p-7 h-full">
                  <h3 className="text-xl font-semibold text-foreground">{p.title}</h3>
                  <ul className="mt-5 space-y-3">
                    {p.items.map((it) => (
                      <li key={it} className="flex gap-3 text-muted-foreground leading-relaxed">
                        <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
