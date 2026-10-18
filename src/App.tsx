import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { MotionConfig } from "framer-motion";
import Index from "./pages/Index";
import SmoothScroll from "./components/SmoothScroll";

const Downloads = lazy(() => import("./pages/Downloads"));
const Research = lazy(() => import("./pages/Research"));
const Platform = lazy(() => import("./pages/Platform"));
const Docs = lazy(() => import("./pages/Docs"));
const Community = lazy(() => import("./pages/Community"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <HelmetProvider>
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/research" element={<Research />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/community" element={<Community />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </MotionConfig>
  </HelmetProvider>
);

export default App;
