<div align="center">

# AWEN Labs

**The website for AWEN, an experimental software stack for computing with light.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Live site](https://marcpoliquin5.github.io/awen-labs/) · [AWEN compiler and runtime](https://github.com/marcpoliquin5/awen)

</div>

A multi-page React site in which every route shares one persistent WebGL scene. Moving between pages does not tear down and rebuild a canvas: 6,000 points morph into the next page's formation while the camera glides to a new framing.

Built with Vite, React, TypeScript, Tailwind CSS, React Three Fiber, Framer Motion, and shadcn/ui.

## Engineering highlights

- **One WebGL context for the whole site.** A single point system morphs between per-route formations in a custom vertex shader. Route changes never create a new context.
- **Loads only what the device can use.** The three.js bundle is code-split and fetched only on capable desktops, after the first interaction or a 5-second delay. Phones, Save-Data connections, and browsers without WebGL get lightweight animated SVG backdrops instead.
- **Adapts while running.** Resolution and bloom scale with measured frame rate, and rendering pauses when the tab is hidden.
- **Respects reduced motion.** `prefers-reduced-motion` gets static backdrops, and smooth scrolling is disabled for reduced motion and touch devices.
- **Deep links work on static hosting.** The build writes an `index.html` into every route folder, so `/architecture` returns HTTP 200 on GitHub Pages.
- **Checked on every pull request.** CI runs a full-history secret scan, a repository security-policy check, `npm audit`, ESLint, and a production build.

## Pages

| Route | Background scene | Content |
|---|---|---|
| `/` | Shifts per section | Landing page: hero, vision, architecture, kernels, roadmap, brand, download |
| `/vision` | Waveguide lattice with travelling light pulses | What a full platform for photonic computing would include |
| `/architecture` | Layered stack that separates on scroll | The stack layer by layer, each labelled Experimental, Reference, Specification, or Vision |
| `/roadmap` | Light beam spiralling through milestones | Now / Next / Later |
| `/research` | Two-source interference field that reacts to the pointer | Specifications and research directions |
| `/docs` | Flowing data streams | Documentation outline |
| `/about` | Gold core with orbiting light | Mission and brand guidelines |
| `/downloads`, `/community` | Timeline, orbit | Release status and how to get involved |

On desktop the background responds to the pointer: points part around the cursor, the scene can be dragged to rotate, and cards tilt toward the cursor. On phones, taps send a ripple across the backdrop.

Site copy follows one rule: vision and roadmap items are labelled as such, and benchmarks or hardware results appear only when there is published evidence behind them.

## Run locally

Requires a current Node.js release (CI uses Node 22).

```bash
npm ci
npm run dev
```

Other scripts:

```bash
npm run lint             # ESLint
npm run check:security   # repository security-policy check
npm run build            # production build into dist/
```

## Project structure

```text
src/
├── pages/         Route-level pages
├── components/    Shared layout and UI components (shadcn/ui based)
│   ├── landing/   Content sections shared by the home page and route pages
│   └── stage/     Persistent background: WebGL scene, formations, SVG fallbacks, page headers
├── config/        Brand configuration
├── hooks/         React hooks
├── integrations/  Supabase client and generated types (not yet used by any page)
└── lib/           Utilities, including the route-to-scene store
supabase/          Versioned migrations and project configuration
scripts/           Repository security-policy check
docs/              Deployment notes
```

The brand name lives in one place, `src/config/brand.ts`. Navigation, footer, page titles, meta tags, and logo alt text all derive from it.

## Deployment and security

Every push to `main` builds the site and publishes it with GitHub Pages. Custom-domain setup is in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

Rules for browser-exposed configuration, the Supabase setup, and the repository's credential audit are in [SECURITY.md](SECURITY.md).

## Credits

Built on open-source libraries, all MIT licensed: [three.js](https://github.com/mrdoob/three.js), [React Three Fiber](https://github.com/pmndrs/react-three-fiber), [drei](https://github.com/pmndrs/drei), [react-postprocessing](https://github.com/pmndrs/react-postprocessing), [Lenis](https://github.com/darkroomengineering/lenis), and [Framer Motion](https://github.com/motiondivision/motion). The scene geometry and shaders are original; no third-party 3D models or image assets are used.
