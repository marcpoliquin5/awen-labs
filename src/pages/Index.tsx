import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandingHero from "@/components/landing/LandingHero";
import Vision from "@/components/landing/Vision";
import Architecture from "@/components/landing/Architecture";
import KernelPreview from "@/components/landing/KernelPreview";
import Roadmap from "@/components/landing/Roadmap";
import Principles from "@/components/landing/Principles";
import DownloadCTA from "@/components/landing/DownloadCTA";
import BrandSection from "@/components/landing/BrandSection";
import { BRAND } from "@/config/brand";

const Index = () => {
  useEffect(() => {
    // Honor /#section links arriving from other routes.
    const id = window.location.hash.slice(1);
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, []);

  return (
  <>
    <Helmet>
      <title>{`${BRAND.fullName} | ${BRAND.tagline}`}</title>
      <meta
        name="description"
        content={`${BRAND.name} is building a complete software platform for photonic computing, from an instruction set for light to a CUDA-like programming model for AI kernels. Download coming soon.`}
      />
      <link rel="canonical" href="https://www.awenphotonics.com/" />
    </Helmet>
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <LandingHero />
        <Vision />
        <Architecture />
        <KernelPreview />
        <Roadmap />
        <Principles />
        <BrandSection />
        <DownloadCTA />
      </main>
      <Footer />
    </div>
  </>
  );
};

export default Index;
