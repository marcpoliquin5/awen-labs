<div align="center">

# AWEN Labs

**The web front end for AWEN, an open, experimental software stack for computing with light.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

AWEN Labs is the public-facing storefront for the AWEN photonic computing
platform: a single long-scroll landing page with an interactive WebGL hero,
plus supporting pages. Built with Vite, React, TypeScript, Tailwind CSS,
React Three Fiber, and shadcn/ui components.

## What's on the site

| Section / page | What it covers |
|---|---|
| Hero | Interactive 3D interferometer mesh: gold waveguides, blue light pulses, live interference fringes |
| Vision | A full platform for photonic computing, from an ISA for light to a CUDA-like kernel model |
| Architecture | The stack layer by layer, each with an explicit status (Experimental, Reference, Specification, Vision) |
| Roadmap | Now / Next / Later milestones (no dates) |
| Brand | The mascot and palette |
| Download | Coming soon via GitHub Releases |
| Platform, Research, Docs, About | Supporting pages |

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

- The three.js scene is code-split and only loaded on capable desktops, after
  first interaction (or a short delay). Phones, `prefers-reduced-motion`,
  Save-Data, and browsers without WebGL get a static SVG rendering of the same
  mesh.
- Rendering pauses when the hero is off-screen or the tab is hidden; resolution
  and bloom adapt to measured frame rate.
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
├── pages/         Route-level pages (Index, Platform, Research, Docs, Downloads, Community, About)
├── components/    Shared layout and UI components (shadcn/ui based)
│   └── landing/   Landing-page sections and the WebGL hero (PhotonicScene)
├── config/        Brand configuration (single source for the name)
├── hooks/         React hooks
├── integrations/  Supabase client and generated types
└── lib/           Utilities
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
