import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { BRAND } from "@/config/brand";

export default function LandingHero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,hsl(190_80%_60%/0.10),transparent_60%),radial-gradient(ellipse_at_20%_80%,hsl(172_70%_62%/0.08),transparent_55%)]" />
      <div className="absolute inset-0 bg-linear-to-r from-background/85 via-background/40 to-transparent pointer-events-none" />

      <div className="container relative mx-auto px-6 pt-28 pb-20">
        <div className="max-w-2xl">
          <p className="hero-enter inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_hsl(172_70%_62%)]" />
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
            instruction set for light up to a programming layer where you write an AI kernel once and the platform handles memory, parallelism, and execution on light.
          </p>
          <p className="hero-enter [animation-delay:520ms] mt-5 flex max-w-xl items-start gap-2.5 text-sm leading-relaxed text-accent/90">
            <span className="mt-1 inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-accent/70 bg-[radial-gradient(circle_at_35%_30%,hsl(0_0%_100%/0.9),hsl(var(--deco-pink)/0.5)_30%,hsl(var(--deco-seafoam)/0.35)_60%,transparent_72%)]" aria-hidden="true" />
            A soap bubble is an optical device: its colors are light waves interfering inside a film only a few hundred nanometers thick.
          </p>
          <div className="hero-enter [animation-delay:600ms] mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href="#download"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_40px_hsl(43_74%_55%/0.35)] transition hover:shadow-[0_0_60px_hsl(43_74%_55%/0.5)] hover:-translate-y-0.5"
            >
              <Clock className="h-4 w-4" />
              Download coming soon
            </a>
            <Link
              to="/architecture"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition hover:border-primary/50 hover:bg-primary/5"
            >
              Explore the architecture
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
