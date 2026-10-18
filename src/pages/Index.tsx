import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";
import { useSectionScenes } from "@/lib/useSectionScenes";
import { Helmet } from "react-helmet-async";
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
  const { hash } = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    // Honor /#section links, including ones arriving from other routes.
    const id = hash.slice(1);
    if (!id) return;
    const t = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -72 });
      else el.scrollIntoView({ behavior: "smooth" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [hash, lenis]);

  useSectionScenes({
    vision: "lattice",
    architecture: "stack",
    kernels: "streams",
    roadmap: "timeline",
    brand: "orbit",
    download: "interference",
  });

  return (
  <>
    <Helmet>
      <title>{`${BRAND.fullName} | ${BRAND.tagline}`}</title>
      <meta
        name="description"
        content={`${BRAND.name} is building a complete software platform for photonic computing, from an instruction set for light to a programming layer that runs AI kernels on light. Download coming soon.`}
      />
      <link rel="canonical" href="https://www.awenphotonics.com/" />
    </Helmet>
    <div className="min-h-screen">
      <div>
        <LandingHero />
        <Vision />
        <Architecture />
        <KernelPreview />
        <Roadmap />
        <Principles />
        <BrandSection />
        <DownloadCTA />
      </div>
    </div>
  </>
  );
};

export default Index;
