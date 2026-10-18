import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ResearchGrid, { ResearchItem } from "./ResearchGrid";

const sampleResearch: ResearchItem[] = [
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
];

const ResourcesPreview = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Open <span className="text-primary">Resources</span>
            </h2>
            <p className="text-muted-foreground">
              Research, experiments, and documentation—all freely available.
            </p>
          </div>
          <Link
            to="/research"
            className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium"
          >
            View all research
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <ResearchGrid items={sampleResearch} limit={3} />
      </div>
    </section>
  );
};

export default ResourcesPreview;
