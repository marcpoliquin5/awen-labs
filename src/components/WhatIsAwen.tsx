import { motion } from "framer-motion";
import { Zap, Layers, Lock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Photonic Speed",
    description:
      "Leverage light-speed computation for matrix operations, neural inference, and signal processing at unprecedented throughput.",
  },
  {
    icon: Layers,
    title: "Modular Stack",
    description:
      "From simulation to deployment—pick the layers you need. Build on stable foundations, experiment with bleeding-edge modules.",
  },
  {
    icon: Lock,
    title: "Open & Extensible",
    description:
      "MIT licensed. Fork it, extend it, contribute back. No vendor lock-in, no hidden APIs, no gatekeeping.",
  },
];

const WhatIsAwen = () => {
  return (
    <section className="py-24 relative nebula-bg">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            What is <span className="text-primary">AWEN</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            AWEN is an open-source platform for photonic computing—bringing together
            simulation, runtime, and developer tools in one cohesive stack.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-8 text-center group hover:border-primary/30 transition-all duration-500 glow-border"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatIsAwen;
