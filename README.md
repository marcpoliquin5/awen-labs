# AWEN Labs site

This repository contains the Vite, React, and TypeScript source for the AWEN Labs
site.

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
