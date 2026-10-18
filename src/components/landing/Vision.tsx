import { Cpu, Layers, Sparkles, Waves } from "lucide-react";
import Reveal, { SectionHeading } from "./Reveal";

const pillars = [
  {
    icon: Layers,
    title: "One platform, end to end",
    body: "Framework integration, compiler, kernel library, runtime, calibration, and simulation designed as a single stack, so a model written today can target light tomorrow.",
  },
  {
    icon: Cpu,
    title: "Program light like a GPU",
    body: "A programming layer that lets developers write kernels once and have the platform schedule, compile, and run them efficiently on photonic hardware: memory, parallelism, and execution handled for you.",
    tag: "Vision",
  },
  {
    icon: Sparkles,
    title: "An instruction set for photons",
    body: "An ISA-level contract between software and photonic processors, so compilers, kernels, and hardware can evolve independently.",
    tag: "Vision",
  },
];

export default function Vision() {
  return (
    <section id="vision" className="relative py-28 md:py-36 scroll-mt-20">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="The vision"
          title={
            <>
              The missing software layer
              <span className="text-muted-foreground"> between AI and optical hardware.</span>
            </>
          }
        >
          GPUs became the engine of modern AI because of their software ecosystem as much as their
          silicon. Photonic processors need the same: a platform developers can actually program.
        </SectionHeading>

        <div className="grid md:grid-cols-3 gap-5">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <article className="group relative h-full rounded-2xl border border-border/60 bg-card/40 p-7 backdrop-blur transition hover:border-primary/40 hover:bg-card/70 lift">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <p.icon className="h-5 w-5" />
                  </span>
                  {p.tag && (
                    <span className="rounded-full border border-accent/30 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-accent">
                      {p.tag}
                    </span>
                  )}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">{p.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-primary/10 via-card/40 to-accent/5 p-8 md:p-12">
            <Waves className="absolute -right-6 -top-6 h-40 w-40 text-primary/10" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Why light</p>
            <p className="mt-4 max-w-3xl text-xl md:text-2xl leading-relaxed text-foreground">
              A mesh of programmable interferometers applies a matrix to light as it propagates.
              The multiply-accumulate at the heart of neural networks becomes a property of physics
              rather than a sequence of instructions.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
