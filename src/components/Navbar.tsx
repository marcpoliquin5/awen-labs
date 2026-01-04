import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AwenLogo from "./AwenLogo";

const navItems = [
  { label: "Overview", href: "/" },
  { label: "Platform", href: "/platform" },
  { label: "Research", href: "/research" },
  { label: "Downloads", href: "/downloads" },
  { label: "Docs", href: "/docs" },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <AwenLogo className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            AWEN
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === item.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Link to="/downloads">
            <Button variant="glow" size="default">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-border/50"
      >
        <div className="container mx-auto px-6 py-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === item.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/downloads" className="mt-2">
            <Button variant="glow" size="default" className="w-full">
              Get Started
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Navbar;
