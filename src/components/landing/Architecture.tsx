import { useState } from "react";
import Reveal, { SectionHeading } from "./Reveal";
import { BRAND } from "@/config/brand";

type Status = "Experimental" | "Reference" | "Specification" | "Vision";

export const layers: { name: string; detail: string; items: string[]; status: Status }[] = [
  {
    name: "Frameworks",
    detail: "Bring existing models. Integration points for the frameworks AI teams already use.",
    items: ["PyTorch", "JAX", "NumPy", "C++"],
    status: "Reference",
  },
  {
    name: "Compiler",
    detail: "Lowers tensor programs through MLIR to photonic devices: tiling, partitioning, precision management, and calibration-aware placement.",
    items: ["StableHLO", "MLIR dialects", "Tiling", "Calibration-aware"],
    status: "Experimental",
  },
  {
    name: "Kernel programming model",
    detail: "Write a kernel once; the platform schedules, compiles, and runs it on photonic hardware, handling memory, parallelism, and execution for you. Built on a typed kernel library with CPU reference implementations.",
    items: ["Kernel library", "CPU references", "Write-once kernels"],
    status: "Vision",
  },
  {
    name: "Photonic ISA & executable format",
    detail: "A stable contract between software and photonic processors: a versioned executable format today, an instruction set architecture next.",
    items: ["Executable ABI", "ISA"],
    status: "Specification",
  },
  {
    name: "Runtime & HAL",
    detail: "Scheduling, calibration state, observability, and a hardware abstraction layer with a seeded analog-noise simulator.",
    items: ["Scheduler", "Calibration", "Simulator", "HAL"],
    status: "Experimental",
  },
  {
    name: "Photonic processors",
    detail: "Programmable interferometer meshes. Today the stack targets simulated devices; hardware-in-the-loop validation comes next.",
    items: ["Simulated devices", "Hardware next"],
    status: "Vision",
  },
];

const statusStyle: Record<Status, string> = {
  Experimental: "text-primary border-primary/40 bg-primary/10",
  Reference: "text-amber-200 border-amber-200/30 bg-amber-200/10",
  Specification: "text-accent border-accent/40 bg-accent/10",
  Vision: "text-muted-foreground border-border bg-secondary/40",
};

export default function Architecture() {
  const [active, setActive] = useState(1);
  return (
    <section id="architecture" className="relative py-28 md:py-36 scroll-mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,hsl(43_74%_55%/0.07),transparent_60%)]" aria-hidden="true" />
      <div className="container relative mx-auto px-6">
        <SectionHeading eyebrow="Architecture" title="A full stack, from model to photon.">
          Every layer has a clear contract and an honest status. Experimental layers run in
          simulation today; vision layers are where the platform is headed.
        </SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-start [&>*]:min-w-0">
          <Reveal>
            <ol className="space-y-2.5" aria-label={`${BRAND.name} platform layers, top to bottom`}>
              {layers.map((l, i) => (
                <li key={l.name}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={active === i}
                    className={`w-full text-left rounded-xl border px-5 py-4 transition-all duration-300 ${
                      active === i
                        ? "border-primary/50 bg-primary/[0.07] shadow-[0_0_40px_hsl(43_74%_55%/0.12)] translate-x-1"
                        : "border-border/60 bg-card/30 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-4">
                        <span className="font-mono text-xs text-muted-foreground w-5">{String(i + 1).padStart(2, "0")}</span>
                        <span className="font-semibold text-foreground">{l.name}</span>
                      </span>
                      <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusStyle[l.status]}`}>
                        {l.status}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.1} className="lg:sticky lg:top-28">
            <div className="lift rounded-2xl border border-border/60 bg-card/50 p-8 backdrop-blur min-h-[280px]" aria-live="polite">
              <p className="font-mono text-xs text-accent">Layer {String(active + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-2xl font-semibold text-foreground">{layers[active].name}</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">{layers[active].detail}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {layers[active].items.map((it) => (
                  <span key={it} className="rounded-lg border border-border/70 bg-background/40 px-3 py-1.5 text-sm text-foreground/90">
                    {it}
                  </span>
                ))}
              </div>
              <div className="mt-8 h-px bg-linear-to-r from-primary/60 via-accent/40 to-transparent" />
              <p className="mt-4 text-xs text-muted-foreground">
                Status key: Experimental and Reference run in simulation today. Specification is
                defined and versioned. Vision is on the roadmap.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
