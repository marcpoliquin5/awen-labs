import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/stage/PageHeader";
import Counter from "@/components/stage/Counter";
import ArchitectureSection, { layers } from "@/components/landing/Architecture";
import KernelPreview from "@/components/landing/KernelPreview";
import Reveal from "@/components/landing/Reveal";
import { BRAND } from "@/config/brand";

const count = (s: string) => layers.filter((l) => l.status === s).length;

const ArchitecturePage = () => (
  <>
    <Helmet>
      <title>{`Architecture | ${BRAND.fullName}`}</title>
      <meta
        name="description"
        content={`The ${BRAND.name} platform stack, from frameworks and compiler to a photonic ISA, runtime, and processors, with an honest status for every layer.`}
      />
    </Helmet>
    <PageHeader eyebrow="Architecture" title="A full stack," accent="from model to photon.">
      Six layers, each with a clear contract and an honest status. Scroll to pull the stack apart.
    </PageHeader>
    <section className="relative pb-8">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Reveal><Counter value={layers.length} label="Platform layers" note="Frameworks to processors" /></Reveal>
        <Reveal delay={0.06}><Counter value={count("Experimental") + count("Reference")} label="Running in simulation" note="Experimental or reference" /></Reveal>
        <Reveal delay={0.12}><Counter value={count("Specification")} label="Specified" note="Defined and versioned" /></Reveal>
        <Reveal delay={0.18}><Counter value={count("Vision")} label="On the roadmap" note="Vision layers" /></Reveal>
      </div>
    </section>
    <ArchitectureSection />
    <KernelPreview />
    <section className="relative pb-28">
      <div className="container mx-auto px-6">
        <Reveal>
          <Link to="/roadmap" className="group inline-flex items-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-6 py-3.5 text-sm font-semibold text-primary transition hover:bg-primary/20">
            See the roadmap <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  </>
);

export default ArchitecturePage;
