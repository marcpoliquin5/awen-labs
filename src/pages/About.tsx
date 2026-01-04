import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Sparkles, Users, Target, Palette } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AwenLogo from "@/components/AwenLogo";

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About | AWEN Photonics</title>
        <meta
          name="description"
          content="Learn about AWEN Photonics—our mission, team, and brand. Building the future of photonic computing."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-24"
            >
              <AwenLogo className="w-24 h-24 mx-auto mb-8" />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                About <span className="text-primary">AWEN</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Named for the Celtic concept of creative inspiration and flowing 
                energy—AWEN represents our vision of computation powered by the 
                fundamental nature of light.
              </p>
            </motion.div>

            {/* Mission */}
            <section className="mb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card p-12 max-w-4xl mx-auto text-center"
              >
                <Target className="w-12 h-12 text-primary mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To democratize photonic computing by building open-source infrastructure 
                  that makes light-speed computation accessible to researchers, developers, 
                  and organizations worldwide. We believe the future of computing should 
                  be open, efficient, and sustainable.
                </p>
              </motion.div>
            </section>

            {/* Values */}
            <section className="mb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Our <span className="text-primary">Values</span>
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                  {
                    icon: Sparkles,
                    title: "Open Science",
                    description:
                      "All research published freely. All code open source. Knowledge should accelerate progress, not gatekeep it.",
                  },
                  {
                    icon: Users,
                    title: "Community First",
                    description:
                      "Built by the community, for the community. Every contributor matters. Every voice is heard.",
                  },
                  {
                    icon: Target,
                    title: "Practical Impact",
                    description:
                      "Beautiful theory means nothing without real-world application. We ship working software.",
                  },
                ].map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="glass-card p-8 text-center"
                    >
                      <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </motion.div>
                  );
                })}
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
                  className="glass-card p-8"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-6">
                    Color Palette
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { name: "Midnight", color: "bg-background", hex: "#040712" },
                      { name: "Abyss", color: "bg-card", hex: "#070c17" },
                      { name: "Electric Blue", color: "bg-primary", hex: "#3B82F6" },
                      { name: "Cyan", color: "bg-accent", hex: "#22D3EE" },
                      { name: "Soft White", color: "bg-foreground", hex: "#E5E7EB" },
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
                  className="glass-card p-8"
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
                        const photon = await awen.simulate();
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
                  className="glass-card p-8"
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
            <section id="privacy" className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card p-8"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Privacy & Terms
                </h3>
                <p className="text-muted-foreground mb-4">
                  AWEN is committed to your privacy. We collect minimal data—only 
                  what's necessary to improve the platform. All our software is 
                  open source under the MIT License.
                </p>
                <p className="text-muted-foreground">
                  For the full privacy policy and terms of service, please visit 
                  our GitHub repository or contact us at{" "}
                  <a
                    href="mailto:legal@awen.dev"
                    className="text-primary hover:text-accent transition-colors"
                  >
                    legal@awen.dev
                  </a>
                </p>
              </motion.div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
