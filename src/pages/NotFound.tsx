import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BRAND } from "@/config/brand";

const NotFound = () => (
  <>
    <Helmet>
      <title>{`Not found | ${BRAND.fullName}`}</title>
    </Helmet>
    <section className="flex min-h-[80vh] items-center justify-center px-6 pt-24">
      <div className="text-center">
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">This beam went nowhere.</h1>
        <p className="mt-4 text-muted-foreground">The page you were looking for doesn't exist.</p>
        <Link to="/" className="mt-8 inline-flex rounded-xl border border-primary/50 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/20 transition">
          Back to home
        </Link>
      </div>
    </section>
  </>
);

export default NotFound;
