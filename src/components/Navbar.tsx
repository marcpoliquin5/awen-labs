import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { BRAND } from "@/config/brand";

const navItems = [
  { label: "Vision", href: "/#vision" },
  { label: "Architecture", href: "/#architecture" },
  { label: "Roadmap", href: "/#roadmap" },
  { label: "Research", href: "/research" },
  { label: "Docs", href: "/docs" },
  { label: "About", href: "/about" },
];

const rulerSections = [
  { id: "vision", label: "Vision" },
  { id: "architecture", label: "Architecture" },
  { id: "roadmap", label: "Roadmap" },
  { id: "brand", label: "Brand" },
  { id: "download", label: "Download" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHome = location.pathname === "/";
  const resolve = (href: string) => (onHome && href.startsWith("/#") ? href.slice(1) : href);
  const [section, setSection] = useState<{ index: number; label: string } | null>(null);
  const [progress, setProgress] = useState(0);

  // Section "ruler": shows where you are on the long home page.
  useEffect(() => {
    if (!onHome) return;
    const els = rulerSections
      .map((r) => document.getElementById(r.id))
      .filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = rulerSections.findIndex((r) => r.id === e.target.id);
            setSection({ index: i, label: rulerSections[i].label });
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      if (window.scrollY < window.innerHeight * 0.5) setSection(null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [onHome]);

  const isActive = (href: string) => !href.includes("#") && location.pathname === href;
  const linkClass = (href: string) =>
    `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(href) ? "text-foreground bg-secondary/60" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || open ? "bg-background/75 backdrop-blur-xl border-b border-border/50" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between" aria-label="Main">
        <Link to="/" className="flex items-center gap-3 group" aria-label={`${BRAND.name} home`}>
          <BrandLogo size={36} className="transition-transform duration-300 group-hover:scale-105" />
          <span className="text-lg font-semibold tracking-tight text-foreground">{BRAND.name}</span>
        </Link>
        {onHome && (
          <div className="hidden xl:flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground" aria-hidden="true">
            <span className="flex gap-1">
              {rulerSections.map((r, i) => (
                <span
                  key={r.id}
                  className={`h-3 w-px transition-colors duration-500 ${section && i <= section.index ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </span>
            <span className="w-28 transition-opacity duration-500" style={{ opacity: section ? 1 : 0 }}>
              {section ? `${String(section.index + 1).padStart(2, "0")} ${section.label}` : ""}
            </span>
          </div>
        )}

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a key={item.href} href={resolve(item.href)} className={linkClass(item.href)}>
              {item.label}
            </a>
          ))}
        </div>

        <a
          href={resolve("/#download")}
          className="hidden lg:inline-flex items-center rounded-xl border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
        >
          Download · coming soon
        </a>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 text-foreground"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {onHome && (
        <div className="absolute inset-x-0 bottom-0 h-px bg-transparent" aria-hidden="true">
          <div
            className="h-full origin-left bg-linear-to-r from-primary via-primary to-accent"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      )}

      {open && (
        <div className="lg:hidden border-t border-border/50">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <a key={item.href} href={resolve(item.href)} onClick={() => setOpen(false)} className={`${linkClass(item.href)} py-3`}>
                {item.label}
              </a>
            ))}
            <a
              href={resolve("/#download")}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl border border-primary/50 bg-primary/10 px-4 py-3 text-center text-sm font-semibold text-primary"
            >
              Download · coming soon
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
