# Security policy

Report a suspected privileged credential through GitHub's private vulnerability
reporting channel when available. Do not open a public issue containing the
credential.

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
