import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import Index from "./pages/Index";
import SmoothScroll from "./components/SmoothScroll";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackgroundStage from "./components/stage/BackgroundStage";
import { sceneStore } from "./lib/sceneStore";

const Vision = lazy(() => import("./pages/Vision"));
const Architecture = lazy(() => import("./pages/Architecture"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Downloads = lazy(() => import("./pages/Downloads"));
const Research = lazy(() => import("./pages/Research"));
const Docs = lazy(() => import("./pages/Docs"));
const Community = lazy(() => import("./pages/Community"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Router basename follows Vite's base (e.g. "/awen-labs/" on GitHub Pages).
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function AnimatedRoutes() {
  const location = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    sceneStore.setRoute(location.pathname);
  }, [location.pathname]);

  const toTop = () => {
    if (location.hash) return;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={toTop}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/platform" element={<Navigate to="/architecture" replace />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/research" element={<Research />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/community" element={<Community />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

const App = () => (
  <HelmetProvider>
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <BrowserRouter basename={basename}>
        <BackgroundStage />
        <div className="relative z-10 min-h-screen">
          <Navbar />
          <main>
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </MotionConfig>
  </HelmetProvider>
);

export default App;
