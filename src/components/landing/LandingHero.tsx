import { ArrowDown, Clock } from "lucide-react";
import HeroVisual from "./HeroVisual";
import { BRAND } from "@/config/brand";

export default function LandingHero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,hsl(43_74%_55%/0.14),transparent_60%),radial-gradient(ellipse_at_20%_80%,hsl(208_88%_60%/0.08),transparent_55%)]" />
      <HeroVisual />
      <div className="absolute inset-0 bg-linear-to-r from-background via-background/75 to-transparent md:via-background/40 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent pointer-events-none" />

      <div className="container relative mx-auto px-6 pt-28 pb-20">
        <div className="max-w-2xl">
          <p className="hero-enter inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_hsl(208_88%_60%)]" />
            In development · simulation-first
          </p>
          <h1 id="hero-title" className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.02] text-foreground">
            <span className="sr-only">Compute with light.</span>
            <span aria-hidden="true">
              {["Compute", "with"].map((w, i) => (
                <span key={w} className="word-reveal mr-[0.22em]" style={{ animationDelay: `${120 + i * 90}ms` }}>
                  {w}
                </span>
              ))}
              <span className="block">
                <span className="word-reveal text-gold-metal pb-[0.08em]" style={{ animationDelay: "320ms" }}>
                  light.
                </span>
              </span>
            </span>
          </h1>
          <p className="hero-enter [animation-delay:450ms] mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
            {BRAND.name} is building a complete software platform for photonic computing: from an
            instruction set for light up to a CUDA-like programming model for AI kernels.
          </p>
          <div className="hero-enter [animation-delay:600ms] mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href="#download"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_40px_hsl(43_74%_55%/0.35)] transition hover:shadow-[0_0_60px_hsl(43_74%_55%/0.5)] hover:-translate-y-0.5"
            >
              <Clock className="h-4 w-4" />
              Download coming soon
            </a>
            <a
              href="#architecture"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition hover:border-primary/50 hover:bg-primary/5"
            >
              Explore the architecture
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
