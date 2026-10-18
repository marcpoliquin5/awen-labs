import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Palette } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { BRAND } from "@/config/brand";

// Mission statement: the team's beliefs and intent, not claims of fact.
const mission = [
  `AI's progress is now bound by physics as much as by ideas. We know where classical, electronic computing runs out of room: power, heat, and the cost of moving data. ${BRAND.name} exists to push past those limits, for the benefit of everyone, not for the sake of a market cycle.`,
  "Light is the most promising way forward. Photons carry enormous bandwidth, move data with little loss, and lend themselves naturally to the matrix and tensor math at the heart of modern AI. That makes photonics a foundation for what comes next, from denser, cooler data centers on Earth to computing that may one day run in orbit.",
  "The road won't be straight. There will be hard walls, corrections, and shifts in supply and demand along the way. We're building for the long arc anyway: a complete software platform that lets the rest of the stack meet light where it is.",
  "And we believe one more thing: that a focused builder, armed with today's tools, can move the frontier further than anyone expects.",
];

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>{`About | ${BRAND.fullName}`}</title>
        <meta
          name="description"
          content={`Why ${BRAND.name} builds with light: the mission behind a complete software platform for photonic computing.`}
        />
      </Helmet>

      <div className="min-h-screen">

        <div className="pt-32 pb-24">
          <div className="container mx-auto px-6">
            {/* Mission */}
            <section className="grid gap-12 lg:grid-cols-[1fr_1.4fr] items-start mb-28">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="lg:sticky lg:top-32"
              >
                {/* With the 3D scene running, the glowing mascot in the background takes this spot. */}
                <div className="about-hero-logo relative mx-auto w-fit transition-opacity duration-1000">
                  <div className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,hsl(43_74%_55%/0.35),transparent_65%)] blur-2xl animate-pulse" aria-hidden="true" />
                  <BrandLogo size={160} className="relative" />
                </div>
                <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.3em] text-accent">Mission statement</p>
              </motion.div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]"
                >
                  Why we build with <span className="text-gold-metal">light</span>
                </motion.h1>
                <div className="mt-10 space-y-6 text-lg md:text-xl leading-relaxed text-muted-foreground">
                  {mission.map((p, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.7, delay: i === 0 ? 0.3 : 0, ease: [0.22, 1, 0.36, 1] }}
                      className={i === mission.length - 1 ? "border-l-2 border-primary/60 pl-6 text-foreground" : ""}
                    >
                      {p}
                    </motion.p>
                  ))}
                </div>
              </div>
            </section>

            {/* Brand Guidelines */}
            <section id="brand" className="mb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                  <Palette className="w-8 h-8 text-primary" />
                  Brand Guidelines
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our visual identity reflects the precision of photonics and the 
                  energy of innovation.
                </p>
              </motion.div>

              <div className="max-w-5xl mx-auto space-y-8">
                {/* Colors */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="glass-card lift p-8"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-6">
                    Color Palette
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { name: "Abyss", color: "bg-background", hex: "#06172B" },
                      { name: "Treasure Gold", color: "bg-primary", hex: "#E1B137" },
                      { name: "Seafoam", color: "bg-accent", hex: "#5CE0CD" },
                      { name: "Deco Pink", color: "bg-[hsl(var(--deco-pink))]", hex: "#FFB3C7" },
                      { name: "Butter", color: "bg-[hsl(var(--deco-butter))]", hex: "#FFE08A" },
                    ].map((c) => (
                      <div key={c.name} className="text-center">
                        <div
                          className={`w-full aspect-square rounded-xl ${c.color} border border-border mb-3`}
                        />
                        <p className="text-sm font-medium text-foreground">
                          {c.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {c.hex}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Typography */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="glass-card lift p-8"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-6">
                    Typography
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Primary: Inter
                      </p>
                      <p className="text-4xl font-bold text-foreground">
                        The quick brown fox jumps over the lazy dog
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Code: JetBrains Mono
                      </p>
                      <p className="text-xl font-mono text-foreground">
                        {`const photon = await ${BRAND.name.toLowerCase()}.simulate();`}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Tone of Voice */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="glass-card lift p-8"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-6">
                    Tone of Voice
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">We are</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Scientific but accessible</li>
                        <li>• Confident but not arrogant</li>
                        <li>• Visionary but grounded</li>
                        <li>• Open and transparent</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">We avoid</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Unnecessary jargon</li>
                        <li>• Hype without substance</li>
                        <li>• Corporate speak</li>
                        <li>• Gatekeeping language</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Legal */}
            <section id="privacy" className="max-w-4xl mx-auto scroll-mt-24">
              <span id="terms" className="block scroll-mt-24" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card lift p-8"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Privacy & Terms
                </h3>
                <p className="text-muted-foreground mb-4">
                  This site has no accounts, no forms, and does not collect personal
                  data. {BRAND.name} software will be released under the MIT License.
                </p>
                <p className="text-muted-foreground">
                  A contact channel for questions about privacy, licensing, or terms
                  is coming soon.
                </p>
              </motion.div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
