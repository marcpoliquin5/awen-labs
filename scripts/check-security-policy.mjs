import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const tracked = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard'],
  { encoding: 'utf8' },
)
  .split(/\r?\n/)
  .filter((file) => file && existsSync(file));
const errors = [];

const realEnvironmentFiles = tracked.filter(
  (file) => /(^|\/)\.env(?:\..+)?$/.test(file) && file !== '.env.example',
);
if (realEnvironmentFiles.length) {
  errors.push(`real environment files are tracked: ${realEnvironmentFiles.join(', ')}`);
}

const expectedVariables = [
  'VITE_SUPABASE_PROJECT_ID',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'VITE_SUPABASE_URL',
];
const example = readFileSync('.env.example', 'utf8')
  .split(/\r?\n/)
  .filter(Boolean);
if (example.length !== expectedVariables.length) {
  errors.push('.env.example must contain only the documented browser variables');
}
for (const variable of expectedVariables) {
  if (!example.includes(`${variable}=`)) {
    errors.push(`.env.example must contain an empty ${variable}`);
  }
}

const client = readFileSync('src/integrations/supabase/client.ts', 'utf8');
for (const privilegedName of ['SERVICE_ROLE', 'DATABASE_PASSWORD', 'JWT_SECRET']) {
  if (client.toUpperCase().includes(privilegedName)) {
    errors.push(`browser client references privileged variable ${privilegedName}`);
  }
}

const databaseTypes = readFileSync('src/integrations/supabase/types.ts', 'utf8');
const emptyPublicSchema = /Tables:\s*{\s*\[_ in never\]: never\s*}/m.test(databaseTypes);
if (!emptyPublicSchema) {
  const migrationDirectory = 'supabase/migrations';
  const migrations = existsSync(migrationDirectory)
    ? readdirSync(migrationDirectory).filter((file) => file.endsWith('.sql'))
    : [];
  const sql = migrations
    .map((file) => readFileSync(`${migrationDirectory}/${file}`, 'utf8'))
    .join('\n');
  if (!/enable\s+row\s+level\s+security/i.test(sql) || !/create\s+policy/i.test(sql)) {
    errors.push('a non-empty public schema requires versioned RLS and policy migrations');
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Security policy passed for ${tracked.length} tracked files`);
