import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { BRAND } from "@/config/brand";

const columns = {
  Platform: [
    { label: "Vision", href: "/vision" },
    { label: "Architecture", href: "/architecture" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Downloads", href: "/downloads" },
  ],
  Explore: [
    { label: "Community", href: "/community" },
    { label: "Research", href: "/research" },
    { label: "Docs", href: "/docs" },
    { label: "About", href: "/about" },
  ],
};

const Footer = () => (
  <footer className="relative border-t border-border/40">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
    <div className="container mx-auto px-6 py-16">
      <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Link to="/" className="group flex items-center gap-3 mb-5" aria-label={`${BRAND.name} home`}>
            <BrandLogo size={36} className="transition-transform duration-300 group-hover:scale-105" />
            <span className="text-lg font-semibold tracking-tight text-foreground">{BRAND.name}</span>
          </Link>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            A software platform for photonic computing. Built to make light a first-class target for AI.
          </p>
        </div>
        {Object.entries(columns).map(([title, links]) => (
          <div key={title}>
            <h3 className="font-semibold text-foreground mb-4 text-sm">{title}</h3>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-14 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} {BRAND.fullName}</p>
        <div className="flex gap-6">
          <Link to="/about#privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link to="/about#terms" className="hover:text-foreground transition-colors">Terms</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
