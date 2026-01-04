import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatIsAwen from "@/components/WhatIsAwen";
import StackDiagram from "@/components/StackDiagram";
import ResourcesPreview from "@/components/ResourcesPreview";
import GetStartedSection from "@/components/GetStartedSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>AWEN Photonics | Light-Powered Computing Infrastructure</title>
        <meta
          name="description"
          content="AWEN is an open-source platform for photonic computing—simulation, kernels, orchestration, and developer tooling for the post-silicon era."
        />
        <meta property="og:title" content="AWEN Photonics" />
        <meta
          property="og:description"
          content="Light-powered computing infrastructure for the post-silicon era."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://awen.dev" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <WhatIsAwen />
          <StackDiagram />
          <ResourcesPreview />
          <GetStartedSection />
          <CommunitySection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
