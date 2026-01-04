import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Download, Github, Terminal, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const GetStartedSection = () => {
  const codeSnippet = `# Install AWEN CLI
curl -sSL https://get.awen.dev | sh

# Create your first project
awen init my-photonic-app
cd my-photonic-app

# Run simulation
awen simulate --config awen.toml`;

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Get <span className="text-primary">Started</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Up and running in under 5 minutes. No account required.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Download Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <Download className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  AWEN Starter
                </h3>
                <p className="text-muted-foreground text-sm">
                  Latest stable release • v0.4.2
                </p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">
              Complete development environment with CLI, simulator, and example
              projects. Available for macOS, Linux, and Windows (WSL).
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/downloads" className="flex-1">
                <Button variant="glow" size="lg" className="w-full">
                  <Download className="mr-2 w-5 h-5" />
                  Download Now
                </Button>
              </Link>
              <a
                href="https://github.com/awen-photonics/awen"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" size="lg" className="w-full">
                  <Github className="mr-2 w-5 h-5" />
                  View on GitHub
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Code Snippet */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border/50">
              <Terminal className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-mono">
                Quickstart
              </span>
              <div className="ml-auto flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
            </div>
            <pre className="p-6 overflow-x-auto">
              <code className="text-sm font-mono text-foreground/90">
                {codeSnippet.split("\n").map((line, i) => (
                  <div key={i} className="leading-relaxed">
                    {line.startsWith("#") ? (
                      <span className="text-muted-foreground">{line}</span>
                    ) : (
                      <span>
                        <span className="text-primary">$</span> {line}
                      </span>
                    )}
                  </div>
                ))}
              </code>
            </pre>
          </motion.div>
        </div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium"
          >
            Read the full documentation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default GetStartedSection;
