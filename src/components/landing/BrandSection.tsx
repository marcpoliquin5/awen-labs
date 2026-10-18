import { asset } from "@/lib/asset";
import Reveal from "./Reveal";
import { BRAND } from "@/config/brand";

export default function BrandSection() {
  return (
    <section id="brand" className="relative py-28 md:py-36 scroll-mt-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,hsl(43_74%_55%/0.10),transparent_60%)]" aria-hidden="true" />
      <div className="container relative mx-auto px-6 grid md:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
        <Reveal>
          <div className="lift relative mx-auto max-w-sm md:max-w-none">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-[conic-gradient(from_180deg,hsl(43_74%_55%/0.35),hsl(172_70%_62%/0.25),hsl(43_74%_55%/0.35))] blur-3xl opacity-60" aria-hidden="true" />
            <picture>
              <source
                type="image/webp"
                srcSet={`${asset("/brand/mascot-640.webp")} 640w, ${asset("/brand/mascot-1100.webp")} 1100w`}
                sizes="(min-width: 768px) 40vw, 90vw"
              />
              <img
                src={asset("/brand/mascot-640.jpg")}
                width={640}
                height={741}
                loading="lazy"
                decoding="async"
                alt={`${BRAND.name} mascot: a painted, sculpted gold robotic face with vivid blue eyes on a black background`}
                className="relative w-full rounded-[2rem] border border-primary/30 shadow-[0_40px_120px_-30px_hsl(43_74%_55%/0.45)]"
              />
            </picture>
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-4">Meet {BRAND.name}</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Forged in gold.
              <span className="block text-gold-metal">Looking at light.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {BRAND.name} is the face of the platform: part machine, part sculpture, with eyes the
              color of the photons it computes with. Gold for the craft that goes into every layer of
              the stack; blue for the light that carries the math.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
