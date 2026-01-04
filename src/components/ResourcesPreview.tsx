import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ResearchGrid, { ResearchItem } from "./ResearchGrid";

const sampleResearch: ResearchItem[] = [
  {
    id: "1",
    title: "Optical Matrix Multiplication: A Benchmark Study",
    description:
      "Comparative analysis of photonic vs electronic matrix multiplication across different scales. Includes power consumption and latency measurements.",
    tags: ["benchmarks", "MVM", "power"],
    status: "Published",
    date: "Dec 2024",
    link: "/research/optical-matrix-multiplication",
  },
  {
    id: "2",
    title: "Waveguide Simulation Accuracy in AWEN-Sim",
    description:
      "Validation of our simulation engine against experimental measurements from fabricated silicon photonic circuits.",
    tags: ["simulation", "validation", "silicon"],
    status: "Published",
    date: "Nov 2024",
    link: "/research/waveguide-simulation",
  },
  {
    id: "3",
    title: "Neural Network Inference on Photonic Hardware",
    description:
      "Mapping neural network operations to photonic primitives. Includes results from MNIST and CIFAR-10 classification.",
    tags: ["ML", "inference", "neural-nets"],
    status: "Draft",
    date: "Jan 2025",
    link: "/research/photonic-nn-inference",
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
