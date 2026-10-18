import { ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import { BRAND } from "@/config/brand";

export default function Principles() {
  return (
    <section className="relative py-20">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="mx-auto max-w-4xl flex flex-col md:flex-row gap-6 md:items-center rounded-2xl border border-border/60 bg-card/30 p-8">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Evidence before claims</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {BRAND.name} publishes no speed or energy figures until they come from reproducible
                hardware-in-the-loop measurements. Vision is labeled as vision; everything else is
                something you'll be able to run.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
