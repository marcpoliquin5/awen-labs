import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResearchGrid, { ResearchItem } from "@/components/ResearchGrid";

const allResearch: ResearchItem[] = [
  {
    id: "1",
    title: "Photonic Matrix Multiplication Benchmarks",
    description:
      "Full-system latency, energy, and accuracy comparison of photonic and electronic GEMM, using AWEN's versioned hardware-in-the-loop benchmark contract. Benchmark harness implemented; hardware results not yet published.",
    tags: ["benchmarks", "GEMM", "hardware-in-the-loop"],
    status: "In Development",
    date: "AEP-0019",
    link: "https://github.com/marcpoliquin5/awen/blob/main/awen-spec/aeps/AEP-0019-hardware-in-the-loop-benchmarking.md",
  },
  {
    id: "2",
    title: "Calibration-Aware Compilation",
    description:
      "Compiling against measured calibration state: wavelength selection, drift-triggered artifact refresh, and remapping disabled cells to spares. Implemented in the AWEN compiler with simulated devices.",
    tags: ["calibration", "compiler", "fault-tolerance"],
    status: "Specification",
    date: "AEP-0018",
    link: "https://github.com/marcpoliquin5/awen/blob/main/awen-spec/aeps/AEP-0018-calibration-aware-compilation.md",
  },
  {
    id: "3",
    title: "Neural Network Inference on Photonic Hardware",
    description:
      "Mapping neural network operations to photonic primitives through a torch.compile backend and StableHLO lowering. Framework integration implemented as a reference boundary; accuracy results on hardware are planned.",
    tags: ["ML", "inference", "neural-nets"],
    status: "In Development",
    date: "AEP-0016",
    link: "https://github.com/marcpoliquin5/awen/blob/main/awen-spec/aeps/AEP-0016-framework-integration.md",
  },
  {
    id: "4",
    title: "Precision and Error Contracts for Analog Compute",
    description:
      "Explicit storage, compute, accumulator, and output precision, with scaling, signed bit slicing, saturation, and error-budget validation for analog photonic execution.",
    tags: ["precision", "analog", "error-contracts"],
    status: "Specification",
    date: "AEP-0017",
    link: "https://github.com/marcpoliquin5/awen/blob/main/awen-spec/aeps/AEP-0017-precision-and-error-contracts.md",
  },
  {
    id: "5",
    title: "Photonic Kernel Semantics",
    description:
      "Technical specification for AWEN's photonic kernels: primitives, execution semantics, and compilation targets. The foundation of a CUDA-class programming model for light.",
    tags: ["kernels", "specification", "language"],
    status: "Specification",
    date: "AEP-0003",
    link: "https://github.com/marcpoliquin5/awen/blob/main/awen-spec/aeps/AEP-0003-kernel-semantics.md",
  },
  {
    id: "6",
    title: "Thermal Drift Compensation in PICs",
    description:
      "Techniques for detecting and compensating thermal drift in photonic integrated circuits, building on AWEN's calibration and drift-triggered recompilation. Experimental validation is planned.",
    tags: ["thermal", "PIC", "calibration"],
    status: "Planned",
    date: "Roadmap",
  },
];

const allTags = Array.from(new Set(allResearch.flatMap((r) => r.tags)));

const ResearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredResearch = allResearch.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => item.tags.includes(tag));

    const matchesStatus = statusFilter === null || item.status === statusFilter;

    return matchesSearch && matchesTags && matchesStatus;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <>
      <Helmet>
        <title>Research | AWEN Photonics</title>
        <meta
          name="description"
          content="Explore open research, experiments, and technical documentation from the AWEN Photonics project."
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
                Open <span className="text-primary">Research</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Specifications, research directions, and technical notes—all freely available. 
                No paywalls, no gating, no signup required.
              </p>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-12"
            >
              {/* Search */}
              <div className="max-w-xl mx-auto mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search research..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Filter className="w-4 h-4" /> Status:
                </span>
                {["Specification", "In Development", "Planned"].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setStatusFilter(statusFilter === status ? null : status)
                    }
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      statusFilter === status
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="px-3 py-1 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
            </motion.div>

            {/* Results */}
            {filteredResearch.length > 0 ? (
              <ResearchGrid items={filteredResearch} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-muted-foreground text-lg">
                  No research found matching your filters.
                </p>
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ResearchPage;
