<div align="center">

# AWEN Labs

**The web front end for AWEN, an open, experimental software stack for computing with light.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

AWEN Labs is the public-facing storefront for the AWEN photonic computing
platform. Every page sits on one persistent WebGL background whose scene morphs
as you move through the site, with animated route transitions, scroll-driven
reveals, and parallax. Built with Vite, React, TypeScript, Tailwind CSS,
React Three Fiber, Framer Motion, and shadcn/ui components.

## What's on the site

| Route | Background scene | What it covers |
|---|---|---|
| `/` | Shifts per section | Landing page: hero, vision, architecture, kernels, roadmap, brand, download |
| `/vision` | Waveguide lattice with traveling light pulses | A full platform for photonic computing, from an instruction set for light to a write-once kernel programming layer |
| `/architecture` | Layered stack that separates as you scroll | The stack layer by layer, each with an explicit status (Experimental, Reference, Specification, Vision) |
| `/roadmap` | Light beam spiralling through milestones | Now / Next / Later milestones (no dates) |
| `/research` | Two-source interference field (reacts to the pointer) | Specifications and research directions |
| `/docs` | Flowing data streams | Documentation outline (arrives with the first release) |
| `/about` | Gold core with orbiting light | Mission statement and brand guidelines |
| `/downloads`, `/community` | Timeline, orbit | Release status and how to get involved |

On desktop the background is interactive everywhere: points part and light up
around the cursor, the scene can be dragged to rotate (with inertia), floating
light bubbles drift away from the cursor and pop with a shockwave when clicked,
the camera orbits and dollies with scroll on every page, and cards tilt toward
the cursor with a following glow. On phones, taps send out a ripple of light
over the animated backdrop.

Download is marked "coming soon" (GitHub Releases). Counters only show numbers
derived from the site's own content (for example, the number of layers listed).

> **Content policy.** Vision and roadmap are presented as such. Concrete
> statements (benchmarks, hardware results, downloads) appear only when they can
> be backed by published, reproducible evidence; anything still in progress is
> labeled with its status.

## Renaming the brand

The brand name lives in one place: `src/config/brand.ts`. Change `name` there and
the navigation, footer, page titles, meta tags in `index.html` (filled at build
time by a small Vite plugin), and logo alt text all follow. Logo and favicon
images live in `public/brand/` and `public/favicon*`.

## Performance and accessibility

- One shared canvas for the whole site: a single point system (6,000 points)
  morphs between per-route formations in a custom vertex shader, and the camera
  glides to each scene's framing. Route changes never create a new WebGL context.
- The three.js bundle is code-split and only loaded on capable desktops, after
  first interaction (or a 5 s delay). Phones, Save-Data, and browsers without
  WebGL get lightweight animated SVG backdrops per scene; `prefers-reduced-motion`
  gets the same backdrops without motion.
- Rendering pauses when the tab is hidden; resolution and bloom adapt to
  measured frame rate.
- Lenis smooth scrolling is disabled for reduced motion and touch devices.

## Credits

Open-source libraries (all MIT licensed):
[three.js](https://github.com/mrdoob/three.js),
[React Three Fiber](https://github.com/pmndrs/react-three-fiber),
[drei](https://github.com/pmndrs/drei),
[react-postprocessing](https://github.com/pmndrs/react-postprocessing),
[Lenis](https://github.com/darkroomengineering/lenis) by darkroom.engineering,
[Framer Motion](https://github.com/motiondivision/motion).
No third-party templates, models, or image assets are used; the scene geometry
and shaders are original.

## Project structure

```text
src/
├── pages/         Route-level pages (Index, Vision, Architecture, Roadmap, Research, Docs, Downloads, Community, About)
├── components/    Shared layout and UI components (shadcn/ui based)
│   ├── landing/   Content sections shared by the home page and route pages
│   └── stage/     Persistent background: WebGL scene, formations, SVG fallbacks, page headers
├── config/        Brand configuration (single source for the name)
├── hooks/         React hooks
├── integrations/  Supabase client and generated types
└── lib/           Utilities, including the route-to-scene store
supabase/          Versioned migrations and project configuration
scripts/           Repository security-policy check
```

## Local setup

Install a supported Node.js release and copy the value-free configuration
contract:

```powershell
Copy-Item .env.example .env.local
npm ci
npm run check:security
npm run lint
npm run dev
```

Populate `.env.local` with:

- `VITE_SUPABASE_PROJECT_ID`: `rzgqmmjvjmsfyetgzjvi`;
- `VITE_SUPABASE_URL`: `https://rzgqmmjvjmsfyetgzjvi.supabase.co`; and
- `VITE_SUPABASE_PUBLISHABLE_KEY`: an active modern `sb_publishable_` key from
  that project.

Every `VITE_` value is embedded in the browser bundle. Never place a service-role
key, database password, JWT signing secret, management access token, or other
privileged value in any `VITE_` variable, local file intended for commit, GitHub
variable, build log, or artifact.

The production build uses the same variables:

```powershell
npm run build
```

## Supabase security boundary

The browser key identifies a project; it does not authorize trusted operations.
Database authorization must be enforced with Row Level Security and explicit
anonymous/authenticated policies. Key reissue and RLS review are independent
operations.

The generated database types currently expose no public tables, views, or
functions, and the application makes no database, authentication, storage, or RPC
calls. If a public table is added, the repository security check requires
versioned migrations that enable RLS and create explicit policies before CI can
pass. Policy tests should exercise anonymous and authenticated roles before the
new data access is deployed.

The connected hosted project currently contains no public tables, views,
functions, storage buckets, Edge Functions, or development branches. The
versioned `20260814030824_secure_rls_event_trigger.sql` migration preserves the
automatic RLS event trigger while moving its `SECURITY DEFINER` function out of
the exposed API schema and revoking execution from `PUBLIC`, `anon`,
`authenticated`, and `service_role`. Supabase's security and performance
advisors report no remaining findings.

The initial repository import contained one legacy Supabase anon JWT in `.env`.
It was classified as the `anon` role, not a service-role credential. The current
tree no longer contains the value. Its exact historical Gitleaks fingerprint is
documented in `.gitleaksignore` so the known browser-safe finding does not mask
any new JWT or privileged-secret finding.

That historical key belonged to project `nbwkthmgoubsflezymua`. The connected
account has no permission to that project and its API hostname no longer
resolves, so the old key and endpoint are decommissioned. The replacement
project is `rzgqmmjvjmsfyetgzjvi`; this application rejects legacy JWT API keys
and accepts only its independently managed modern publishable key.

## Automated checks

Pull requests and `main` run a complete-history Gitleaks scan, repository security
policy, ESLint, and a production build using non-secret CI fixtures. GitHub secret
scanning and push protection are also enabled at repository level.

## Deployment

Every push to `main` builds the site and publishes it with GitHub Pages
(`.github/workflows/deploy-pages.yml`). The build reads the Pages base path from
`actions/configure-pages`, so the same workflow serves either:

- the project URL, `https://marcpoliquin5.github.io/awen-labs/` (base `/awen-labs/`), or
- a custom domain at the root (base `/`).

The build writes `index.html` into each route folder (so `/architecture` returns
HTTP 200) plus `404.html` as a fallback for any other path. When adding a route,
add it to `ROUTES` in `vite.config.ts`.

### Switching to the custom domain

1. At the DNS provider, add these records for `awenphotonics.com`:

   | Type | Host | Value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | AAAA | @ | 2606:50c0:8000::153 |
   | AAAA | @ | 2606:50c0:8001::153 |
   | AAAA | @ | 2606:50c0:8002::153 |
   | AAAA | @ | 2606:50c0:8003::153 |
   | CNAME | www | marcpoliquin5.github.io |

2. In **Settings → Pages**, set the custom domain to `www.awenphotonics.com`
   (or run `gh api -X PUT repos/marcpoliquin5/awen-labs/pages -f cname=www.awenphotonics.com`),
   wait for the DNS check, then enable **Enforce HTTPS**.
3. Re-run the **Deploy to GitHub Pages** workflow so the site is rebuilt with base `/`.
