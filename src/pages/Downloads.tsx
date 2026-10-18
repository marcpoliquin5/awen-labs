import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Download, ArrowRight, FileText, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BRAND } from "@/config/brand";

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
        <title>{`Downloads | ${BRAND.fullName}`}</title>
        <meta
          name="description"
          content={`${BRAND.name} downloads are coming soon: prebuilt, signed releases of the photonic compiler and runtime.`}
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
                Get <span className="text-primary">{BRAND.name}</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Download coming soon. {BRAND.name} is in active development, and the first
                public release is being prepared.
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
                    <h2 className="text-2xl font-bold text-foreground">{BRAND.name}</h2>
                    <p className="text-muted-foreground">
                      Photonic compiler and runtime • Rust, MLIR, and Python
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Clock className="w-4 h-4" />
                  Coming soon
                </span>
              </div>

              <p className="text-muted-foreground mb-4">
                No downloads are published yet. The first release will include:
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

            {/* Releases */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
                <p className="text-muted-foreground">
                  {BRAND.name} has not published a release yet. Release notes will appear here
                  alongside the first download.
                </p>
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
