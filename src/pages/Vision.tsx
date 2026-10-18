import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/stage/PageHeader";
import VisionSection from "@/components/landing/Vision";
import KernelPreview from "@/components/landing/KernelPreview";
import Principles from "@/components/landing/Principles";
import Reveal from "@/components/landing/Reveal";
import { BRAND } from "@/config/brand";

const VisionPage = () => (
  <>
    <Helmet>
      <title>{`Vision | ${BRAND.fullName}`}</title>
      <meta
        name="description"
        content={`Why ${BRAND.name} builds with light: a complete software platform for photonic computing, from an instruction set for photons to write-once AI kernels.`}
      />
    </Helmet>
    <PageHeader eyebrow="Vision" title="AI is bound by physics." accent="Light moves past it.">
      Electronic computing is running out of room on power, heat, and the cost of moving data.{" "}
      {BRAND.name} is building the software platform that lets AI meet light where it is, for the long arc.
    </PageHeader>
    <VisionSection />
    <KernelPreview />
    <Principles />
    <section className="relative pb-28">
      <div className="container mx-auto px-6">
        <Reveal className="flex flex-col sm:flex-row gap-3">
          <Link to="/architecture" className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5">
            See the architecture <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/about" className="group inline-flex items-center gap-2 rounded-xl border border-border bg-background/40 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition hover:border-primary/50">
            Why we build with light <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  </>
);

export default VisionPage;
