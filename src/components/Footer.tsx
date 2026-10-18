import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AwenLogo from "./AwenLogo";

const footerLinks = {
  Platform: [
    { label: "Overview", href: "/" },
    { label: "Stack Layers", href: "/platform" },
    { label: "Downloads", href: "/downloads" },
    { label: "Documentation", href: "/docs" },
  ],
  Resources: [
    { label: "Research", href: "/research" },
    { label: "Changelog", href: "/downloads#changelog" },
    { label: "Roadmap", href: "/platform#roadmap" },
    { label: "Brand", href: "/about#brand" },
  ],
  Community: [
    { label: "Contribute", href: "/community" },
    { label: "Contact", href: "/community#contact" },
  ],
};

const Footer = () => {
  return (
    <footer className="relative border-t border-border/30 bg-background/50 backdrop-blur-xs">
      {/* Top glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <AwenLogo className="w-10 h-10" />
              <span className="text-xl font-bold tracking-tight text-foreground">
                AWEN
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Light-powered computing infrastructure for the post-silicon era. 
              Open source. Open science. Open future.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-foreground mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AWEN Photonics. Open source under MIT License.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/about#privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/about#terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
