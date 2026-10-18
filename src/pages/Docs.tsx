import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Book, Code, Rocket, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BRAND } from "@/config/brand";

const docsSections = [
  {
    id: "start-here",
    title: "Start Here",
    icon: Rocket,
    description: `New to ${BRAND.name}? Begin with these guides.`,
    articles: [
      { title: "Quick Start Guide" },
      { title: "Installation" },
      { title: "Your First Simulation" },
    ],
  },
  {
    id: "core-concepts",
    title: "Core Concepts",
    icon: Book,
    description: `Learn the fundamentals of the ${BRAND.name} platform.`,
    articles: [
      { title: "Platform Architecture" },
      { title: "Kernels & Operations" },
      { title: "Memory Model" },
      { title: "Simulation Engine" },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Topics",
    icon: Code,
    description: "Deep dives for experienced developers.",
    articles: [
      { title: "Custom Kernel Development" },
      { title: "Hardware Targets" },
      { title: "Performance Optimization" },
      { title: `Contributing to ${BRAND.name}` },
    ],
  },
];

const DocsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Helmet>
        <title>{`Documentation | ${BRAND.fullName}`}</title>
        <meta
          name="description"
          content={`Comprehensive documentation for the ${BRAND.name} photonic computing platform. Guides, tutorials, and API reference.`}
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                <span className="text-primary">Documentation</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                Everything you'll need to build with {BRAND.name}, from quick start guides to
                advanced tutorials. Full documentation arrives with the first release.
              </p>

              {/* Search */}
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
                  />
                </div>
              </div>
            </motion.div>

            {/* Quick Start Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card p-6 max-w-4xl mx-auto mb-16 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">New to {BRAND.name}?</h3>
                  <p className="text-muted-foreground text-sm">
                    Guides and API reference are being written for the first release
                  </p>
                </div>
              </div>
              <Link to="/downloads">
                <Button variant="glow">
                  Download coming soon
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Documentation Sections */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {docsSections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-foreground">
                          {section.title}
                        </h2>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-6">
                      {section.description}
                    </p>
                    <ul className="space-y-2">
                      {section.articles.map((article) => (
                        <li key={article.title}>
                          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors group">
                            <span className="text-foreground group-hover:text-primary transition-colors">
                              {article.title}
                            </span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-3">
                              Coming soon
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            {/* Example Code Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto mt-24"
            >
              <h2 className="text-2xl font-bold text-center mb-8">
                API <span className="text-primary">Preview</span>
              </h2>
              <p className="text-muted-foreground text-sm text-center -mt-4 mb-8">
                Illustrative only. The public API will be documented with the first release.
              </p>
              <div className="glass-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border/50">
                  <Code className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-mono">
                    example.py
                  </span>
                </div>
                <pre className="p-6 overflow-x-auto">
                  <code className="text-sm font-mono">
                    {`import awen

# Initialize the ${BRAND.name} runtime
runtime = awen.Runtime()

# Define a photonic circuit
circuit = awen.Circuit()
circuit.add_mzi(theta=0.5, phi=0.3)
circuit.add_waveguide(length=100)

# Simulate propagation
result = runtime.simulate(circuit, wavelength=1550)

# Visualize results
awen.viz.plot_field(result.field)
print(f"Output power: {result.power:.3f}")`}
                  </code>
                </pre>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DocsPage;
