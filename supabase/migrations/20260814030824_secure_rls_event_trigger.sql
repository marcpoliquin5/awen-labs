create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;

alter function public.rls_auto_enable() set schema private;

revoke all on function private.rls_auto_enable() from public;
revoke all on function private.rls_auto_enable() from anon;
revoke all on function private.rls_auto_enable() from authenticated;
revoke all on function private.rls_auto_enable() from service_role;
