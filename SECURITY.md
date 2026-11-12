# Security policy

Report a suspected privileged credential through GitHub's private vulnerability
reporting channel when available. Do not open a public issue containing the
credential.

## Configuration rules

Every `VITE_` value is embedded in the browser bundle. Never place a service-role
key, database password, JWT signing secret, management access token, or other
privileged value in a `VITE_` variable, a file intended for commit, a GitHub
variable, a build log, or an artifact.

The Supabase browser key identifies a project; it does not authorize trusted
operations. Database authorization must be enforced with Row Level Security and
explicit anonymous and authenticated policies. The application currently makes
no database, authentication, storage, or RPC calls. If a public table is added,
`npm run check:security` requires versioned migrations that enable RLS and create
explicit policies before CI can pass.

Supabase configuration, when it is needed, goes in `.env.local`:

- `VITE_SUPABASE_PROJECT_ID`: `rzgqmmjvjmsfyetgzjvi`
- `VITE_SUPABASE_URL`: `https://rzgqmmjvjmsfyetgzjvi.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY`: an active `sb_publishable_` key from that project

## Automated checks

Pull requests and `main` run a complete-history Gitleaks scan, the repository
security policy check, `npm audit`, ESLint, and a production build using
non-secret CI fixtures.

## Configuration audit

- The only credential-like value found across all Git history was the legacy
  Supabase JWT stored in the initial `.env` import.
- Its decoded role was `anon`; no service-role key, database password, JWT signing
  secret, Supabase management token, or other privileged credential was found.
- The repository had no Actions runs, logs, or artifacts and no GitHub repository
  secrets or variables at audit time.
- The generated Supabase types declared an empty public schema, the application
  contained no Supabase data/auth/storage/RPC calls, and no database migrations
  were present.
- Because no privileged material was found, Git history was not rewritten. The
  public anon finding is narrowly ignored by its immutable Gitleaks fingerprint.

The historical browser key's project, `nbwkthmgoubsflezymua`, is no longer in
the connected account and its API hostname does not resolve. Runtime
configuration now targets replacement project `rzgqmmjvjmsfyetgzjvi` and the
client rejects legacy anon JWT keys in favor of a modern `sb_publishable_` key.

The replacement project's hosted state was inspected with project-owner access.
It has an empty public schema and no storage buckets or Edge Functions. Migration
`20260814030824_secure_rls_event_trigger.sql` moved the automatic RLS event
trigger function to a private schema and removed all API-role execution rights;
the enabled event trigger remains in place. Supabase's security and performance
advisors report no findings after that migration.
