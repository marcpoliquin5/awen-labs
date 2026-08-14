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

Reissue or revoke browser keys from the Supabase project settings. Rotating a
browser key never replaces RLS validation. A maintainer with project-owner access
must confirm the deployed key and hosted policy state whenever the application
begins accessing data.
