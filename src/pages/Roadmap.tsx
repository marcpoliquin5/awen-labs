import { Helmet } from "react-helmet-async";
import PageHeader from "@/components/stage/PageHeader";
import Counter from "@/components/stage/Counter";
import RoadmapSection, { phases } from "@/components/landing/Roadmap";
import DownloadCTA from "@/components/landing/DownloadCTA";
import Reveal from "@/components/landing/Reveal";
import { BRAND } from "@/config/brand";

const milestones = phases.reduce((n, p) => n + p.items.length, 0);

const RoadmapPage = () => (
  <>
    <Helmet>
      <title>{`Roadmap | ${BRAND.fullName}`}</title>
      <meta
        name="description"
        content={`Where ${BRAND.name} is and where it's going: a simulation-first stack today, a first public release next, and a write-once kernel programming layer for light later.`}
      />
    </Helmet>
    <PageHeader eyebrow="Roadmap" title="Milestones, not dates." accent="Shipped when verified.">
      Each phase ships when it can be checked. The road won't be straight; the direction is.
    </PageHeader>
    <section className="relative pb-4">
      <div className="container mx-auto px-6 grid grid-cols-2 gap-4 max-w-xl">
        <Reveal><Counter value={phases.length} label="Phases" note="Now, next, later" /></Reveal>
        <Reveal delay={0.08}><Counter value={milestones} label="Milestones listed" note="Across all phases" /></Reveal>
      </div>
    </section>
    <RoadmapSection />
    <DownloadCTA />
  </>
);

export default RoadmapPage;
