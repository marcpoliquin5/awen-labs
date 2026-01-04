import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Download, Github, Terminal, CheckCircle, ArrowRight, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const platforms = [
  { name: "macOS", arch: "Apple Silicon / Intel", file: "awen-0.4.2-darwin-universal.tar.gz" },
  { name: "Linux", arch: "x86_64", file: "awen-0.4.2-linux-x86_64.tar.gz" },
  { name: "Windows (WSL)", arch: "x86_64", file: "awen-0.4.2-linux-x86_64.tar.gz" },
];

const changelog = [
  {
    version: "0.4.2",
    date: "Dec 28, 2024",
    changes: [
      "Improved simulation performance by 40%",
      "Added support for MZI mesh topologies",
      "Fixed memory leak in kernel runtime",
      "New visualization tools for waveguide propagation",
    ],
  },
  {
    version: "0.4.1",
    date: "Dec 15, 2024",
    changes: [
      "Hotfix for CLI path resolution on Windows",
      "Updated dependencies for security patches",
    ],
  },
  {
    version: "0.4.0",
    date: "Dec 1, 2024",
    changes: [
      "Major refactor of simulation engine",
      "New kernel compilation pipeline",
      "Added batch simulation mode",
      "Improved error messages and diagnostics",
    ],
  },
];

const DownloadsPage = () => {
  return (
    <>
      <Helmet>
        <title>Downloads | AWEN Photonics</title>
        <meta
          name="description"
          content="Download AWEN Starter - the complete development environment for photonic computing. Available for macOS, Linux, and Windows."
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
                Download <span className="text-primary">AWEN</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Get started in under 5 minutes. No account required. No setup wizard. 
                Just download, extract, and run.
              </p>
            </motion.div>

            {/* Main Download Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card p-8 max-w-4xl mx-auto mb-16"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Download className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">AWEN Starter</h2>
                    <p className="text-muted-foreground">
                      Version 0.4.2 • Released Dec 28, 2024
                    </p>
                  </div>
                </div>
                <a
                  href="https://github.com/awen-photonics/awen"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="default">
                    <Github className="mr-2 w-4 h-4" />
                    View Source
                  </Button>
                </a>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {platforms.map((platform) => (
                  <button
                    key={platform.name}
                    className="glass-card p-4 text-left hover:border-primary/50 transition-all group"
                  >
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {platform.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{platform.arch}</p>
                    <span className="text-xs text-primary">{platform.file}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  SHA256 verified
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Code signed
                </span>
              </div>
            </motion.div>

            {/* Quick Install */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto mb-16"
            >
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                Quick Install (Recommended)
              </h3>
              <div className="glass-card overflow-hidden">
                <pre className="p-6 overflow-x-auto">
                  <code className="text-sm font-mono">
                    <span className="text-primary">$</span>{" "}
                    <span className="text-foreground">curl -sSL https://get.awen.dev | sh</span>
                  </code>
                </pre>
              </div>
            </motion.div>

            {/* Quickstart Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-4xl mx-auto mb-16"
            >
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Quickstart in 5 Minutes
              </h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Install AWEN CLI", code: "curl -sSL https://get.awen.dev | sh" },
                  { step: 2, title: "Create a new project", code: "awen init my-photonic-app" },
                  { step: 3, title: "Navigate to project", code: "cd my-photonic-app" },
                  { step: 4, title: "Run simulation", code: "awen simulate --config awen.toml" },
                  { step: 5, title: "View results", code: "awen viz output/" },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium mb-2">{item.title}</p>
                      <div className="glass-card px-4 py-2">
                        <code className="text-sm font-mono text-muted-foreground">
                          <span className="text-primary">$</span> {item.code}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Changelog */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              id="changelog"
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Changelog
                </h3>
                <a
                  href="/platform#roadmap"
                  className="text-primary hover:text-accent transition-colors text-sm flex items-center gap-1"
                >
                  View Roadmap <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              
              <div className="space-y-6">
                {changelog.map((release, index) => (
                  <motion.div
                    key={release.version}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-lg font-bold text-primary">v{release.version}</span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {release.date}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {release.changes.map((change, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DownloadsPage;
