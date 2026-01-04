import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Rocket, Calendar, CheckCircle, Clock, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StackDiagram from "@/components/StackDiagram";

const roadmapItems = [
  {
    quarter: "Q4 2024",
    status: "completed",
    items: [
      "AWEN-Sim v1.0 release",
      "Basic kernel runtime",
      "CLI tooling",
      "Documentation site launch",
    ],
  },
  {
    quarter: "Q1 2025",
    status: "current",
    items: [
      "MZI mesh support",
      "Improved simulation performance",
      "Neural network primitives",
      "Community Discord launch",
    ],
  },
  {
    quarter: "Q2 2025",
    status: "planned",
    items: [
      "Hardware abstraction layer",
      "Multi-device orchestration",
      "Visual circuit designer (alpha)",
      "First hardware partner integration",
    ],
  },
  {
    quarter: "Q3-Q4 2025",
    status: "planned",
    items: [
      "Full orchestration layer",
      "Cloud simulation service",
      "Production-ready runtime",
      "Expanded hardware support",
    ],
  },
];

const PlatformPage = () => {
  return (
    <>
      <Helmet>
        <title>Platform | AWEN Photonics</title>
        <meta
          name="description"
          content="Explore the AWEN platform stack—from simulation to orchestration. A complete ecosystem for photonic computing."
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
              className="text-center mb-16"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                The AWEN <span className="text-primary">Platform</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                More than an SDK—AWEN is a complete platform and ecosystem for photonic 
                computing. From simulation to deployment, we provide the infrastructure 
                layer that photonic applications need.
              </p>
            </motion.div>

            {/* Vision Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card p-8 max-w-4xl mx-auto mb-24 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Rocket className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-primary">Vision</span>
              </div>
              <p className="text-xl text-foreground leading-relaxed">
                We're building what CUDA did for GPUs—but for photonic computing. 
                A unified platform that lets developers harness light-speed computation 
                without worrying about hardware specifics.
              </p>
            </motion.div>

            {/* Stack Diagram */}
            <StackDiagram />

            {/* Platform Concepts */}
            <section className="py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Core <span className="text-primary">Concepts</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Understanding the building blocks of photonic computation.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {[
                  {
                    title: "Photonic Kernels",
                    description:
                      "Pre-compiled operations optimized for photonic execution. Matrix multiplications, FFTs, and convolutions run at the speed of light.",
                  },
                  {
                    title: "Hybrid Execution",
                    description:
                      "Seamlessly mix photonic and electronic computation. AWEN automatically routes operations to the optimal hardware.",
                  },
                  {
                    title: "Unified Memory Model",
                    description:
                      "Abstract away the complexity of optical-electronic data transfer. Write code as if all data lives in one place.",
                  },
                  {
                    title: "Hardware Abstraction",
                    description:
                      "Write once, run anywhere. AWEN compiles to multiple photonic platforms and simulators from a single codebase.",
                  },
                ].map((concept, index) => (
                  <motion.div
                    key={concept.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-card p-6"
                  >
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {concept.title}
                    </h3>
                    <p className="text-muted-foreground">{concept.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Roadmap */}
            <section id="roadmap" className="py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                  <Calendar className="w-8 h-8 text-primary" />
                  Roadmap
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Where we are and where we're going. Updated quarterly.
                </p>
              </motion.div>

              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

                  {roadmapItems.map((period, index) => (
                    <motion.div
                      key={period.quarter}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative pl-16 pb-12 last:pb-0"
                    >
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-4 top-0 w-5 h-5 rounded-full border-2 ${
                          period.status === "completed"
                            ? "bg-green-500 border-green-500"
                            : period.status === "current"
                            ? "bg-primary border-primary animate-pulse"
                            : "bg-background border-border"
                        }`}
                      />

                      <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-lg font-semibold text-foreground">
                            {period.quarter}
                          </h3>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              period.status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : period.status === "current"
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {period.status === "completed"
                              ? "Completed"
                              : period.status === "current"
                              ? "In Progress"
                              : "Planned"}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {period.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-muted-foreground"
                            >
                              {period.status === "completed" ? (
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              ) : period.status === "current" ? (
                                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              )}
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Link to="/downloads">
                <Button variant="glow" size="lg">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PlatformPage;
