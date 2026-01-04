import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Cpu, Layers, Workflow, Wrench, Gauge, Cloud } from "lucide-react";

const stackLayers = [
  {
    id: "orchestration",
    name: "Orchestration Layer",
    description: "Distribute workloads across photonic hardware, simulators, and hybrid systems. Intelligent scheduling for maximum throughput.",
    icon: Cloud,
    color: "from-cyan-500 to-blue-500",
    status: "In Development",
  },
  {
    id: "runtime",
    name: "Runtime & Kernels",
    description: "Execute photonic operations with optimized kernels. Native support for matrix operations, FFT, and neural network primitives.",
    icon: Cpu,
    color: "from-blue-500 to-indigo-500",
    status: "Alpha",
  },
  {
    id: "simulation",
    name: "Simulation Engine",
    description: "High-fidelity optical physics simulation. Model waveguides, interferometers, and photonic circuits before hardware.",
    icon: Gauge,
    color: "from-indigo-500 to-purple-500",
    status: "Beta",
  },
  {
    id: "abstraction",
    name: "Abstraction Layer",
    description: "Unified API across different photonic hardware. Write once, deploy anywhere from simulators to real chips.",
    icon: Layers,
    color: "from-purple-500 to-pink-500",
    status: "Stable",
  },
  {
    id: "tooling",
    name: "Developer Tools",
    description: "CLI, debugger, profiler, and visualization tools. Integrated development environment for photonic applications.",
    icon: Wrench,
    color: "from-pink-500 to-rose-500",
    status: "Alpha",
  },
  {
    id: "workflows",
    name: "Workflow Engine",
    description: "Define complex computational graphs. Automatic optimization and parallelization of photonic workflows.",
    icon: Workflow,
    color: "from-rose-500 to-orange-500",
    status: "Planned",
  },
];

const StackDiagram = () => {
  const [expandedLayer, setExpandedLayer] = useState<string | null>("runtime");

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
            Platform <span className="text-primary">Layers</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A complete stack for photonic computing—from low-level kernels to high-level orchestration.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-3">
          {stackLayers.map((layer, index) => {
            const Icon = layer.icon;
            const isExpanded = expandedLayer === layer.id;

            return (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <motion.button
                  onClick={() => setExpandedLayer(isExpanded ? null : layer.id)}
                  className={`w-full glass-card p-6 text-left transition-all duration-300 group ${
                    isExpanded ? "ring-1 ring-primary/50" : ""
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${layer.color} flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {layer.name}
                        </h3>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            layer.status === "Stable"
                              ? "bg-green-500/20 text-green-400"
                              : layer.status === "Beta"
                              ? "bg-blue-500/20 text-blue-400"
                              : layer.status === "Alpha"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : layer.status === "In Development"
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {layer.status}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{
                      height: isExpanded ? "auto" : 0,
                      opacity: isExpanded ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-4 text-muted-foreground leading-relaxed pl-16">
                      {layer.description}
                    </p>
                  </motion.div>
                </motion.button>

                {/* Connection line */}
                {index < stackLayers.length - 1 && (
                  <div className="absolute left-10 top-full w-px h-3 bg-gradient-to-b from-border to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StackDiagram;
