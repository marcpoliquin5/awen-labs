import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Download, Github, Terminal, ArrowRight, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const buildSteps = [
  { step: 1, title: "Clone the repository", code: "git clone https://github.com/marcpoliquin5/awen.git && cd awen" },
  { step: 2, title: "Build and test the compiler", code: "cargo test --manifest-path awen-compiler/Cargo.toml --all-features" },
  { step: 3, title: "Build and test the runtime", code: "cargo test --manifest-path awen-runtime/Cargo.toml --all-features" },
  { step: 4, title: "Compile a 256×256 GEMM for a photonic core", code: "cargo run --manifest-path awen-runtime/Cargo.toml --bin awenctl -- compile awen-compiler/examples/gemm_256.json --capabilities awen-compiler/capabilities/pace_like_128.json --health awen-compiler/capabilities/pace_like_128.health.json --target photonic --output awen_compilation.json" },
  { step: 5, title: "Install the Python integration (PyTorch, JAX, NumPy)", code: 'python -m pip install -e "awen-ecosystem/python_awen[frameworks,test]"' },
];

const plannedReleases = [
  "Prebuilt awenctl binaries for macOS, Linux, and Windows (WSL)",
  "Signed, checksummed release artifacts",
  "A one-line installer",
  "Starter projects and tutorials",
];

const DownloadsPage = () => {
  return (
    <>
      <Helmet>
        <title>Get AWEN | AWEN Photonics</title>
        <meta
          name="description"
          content="Get AWEN: build the open-source photonic compiler and runtime from source. Prebuilt releases are on the roadmap."
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
                Get <span className="text-primary">AWEN</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                AWEN is open source and builds from source today. No account required.
                Prebuilt releases are on the roadmap.
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
                    <h2 className="text-2xl font-bold text-foreground">AWEN from source</h2>
                    <p className="text-muted-foreground">
                      Experimental • Rust, MLIR, and Python • MIT licensed
                    </p>
                  </div>
                </div>
                <a
                  href="https://github.com/marcpoliquin5/awen"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="default">
                    <Github className="mr-2 w-4 h-4" />
                    View Source
                  </Button>
                </a>
              </div>

              <p className="text-muted-foreground mb-4">
                No prebuilt binaries are published yet. Build the compiler, runtime, and
                framework integrations from source with a current stable Rust toolchain and
                Python 3.10 or newer. Coming next:
              </p>
              <ul className="space-y-2">
                {plannedReleases.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
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
                Clone the source
              </h3>
              <div className="glass-card overflow-hidden">
                <pre className="p-6 overflow-x-auto">
                  <code className="text-sm font-mono">
                    <span className="text-primary">$</span>{" "}
                    <span className="text-foreground">git clone https://github.com/marcpoliquin5/awen.git</span>
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
                Build and run
              </h3>
              <div className="space-y-4">
                {buildSteps.map((item) => (
                  <div key={item.step} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
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

            {/* Releases */}
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
              <div className="glass-card p-6">
                <p className="text-muted-foreground mb-4">
                  AWEN has not published a stable release yet. Every change is recorded in the
                  repository changelog, and verified releases will be published on GitHub.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="https://github.com/marcpoliquin5/awen/blob/main/CHANGELOG.md" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <FileText className="mr-2 w-4 h-4" />
                      Read the changelog
                    </Button>
                  </a>
                  <a href="https://github.com/marcpoliquin5/awen/releases" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Github className="mr-2 w-4 h-4" />
                      GitHub releases
                    </Button>
                  </a>
                </div>
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
