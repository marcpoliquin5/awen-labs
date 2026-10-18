import { Clock, Package, ShieldCheck, Terminal } from "lucide-react";
import Reveal from "./Reveal";
import { BRAND } from "@/config/brand";

const includes = [
  { icon: Terminal, text: "awenctl compiler and runtime CLI" },
  { icon: Package, text: "Python package with framework integrations" },
  { icon: ShieldCheck, text: "Signed, checksummed builds for macOS, Linux, and Windows" },
];

export default function DownloadCTA() {
  return (
    <section id="download" className="relative py-28 md:py-36 scroll-mt-20">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-linear-to-br from-primary/15 via-card/60 to-accent/10 px-8 py-16 md:px-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(43_74%_55%/0.25),transparent_60%)]" aria-hidden="true" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Download</p>
              <h2 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-foreground">
                Coming soon.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
                The first public release of {BRAND.name} will be published on GitHub Releases.
              </p>
              <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
                {includes.map((i) => (
                  <div key={i.text} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-4 py-3 text-left text-sm text-foreground/90 backdrop-blur">
                    <i.icon className="h-4 w-4 shrink-0 text-accent" />
                    {i.text}
                  </div>
                ))}
              </div>
              <div className="mt-10 inline-flex items-center gap-2 rounded-xl border border-primary/50 bg-primary/15 px-6 py-3.5 text-sm font-semibold text-primary" role="status">
                <Clock className="h-4 w-4" />
                Download coming soon (GitHub Releases)
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
