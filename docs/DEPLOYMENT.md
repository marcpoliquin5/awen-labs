# Deployment

Every push to `main` builds the site and publishes it with GitHub Pages
(`.github/workflows/deploy-pages.yml`). The build reads the Pages base path from
`actions/configure-pages`, so the same workflow serves either:

- the project URL, `https://marcpoliquin5.github.io/awen-labs/` (base `/awen-labs/`), or
- a custom domain at the root (base `/`).

The build writes `index.html` into each route folder, so a deep link such as
`/architecture` returns HTTP 200, and writes `404.html` as a fallback for any
other path. When adding a route, add it to `ROUTES` in `vite.config.ts`.

## Switching to the custom domain

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
