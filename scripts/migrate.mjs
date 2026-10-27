// Run only after the project and DATABASE_URL have been verified.
process.env.DATABASE_URL||=process.env.SUSCRIBE_DATABASE_URL_UNPOOLED||process.env.SUSCRIBE_DATABASE_URL;
const {getMigrations}=await import('better-auth/db/migration');
const {getAuth}=await import('../lib/auth.js');
const {getPool}=await import('../lib/db.js');
const {runMigrations}=await getMigrations(getAuth().options);
await runMigrations();
await getPool().query(`CREATE TABLE IF NOT EXISTS subscription_collections (
 user_id text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
 items jsonb NOT NULL DEFAULT '[]'::jsonb,
 version integer NOT NULL DEFAULT 0,
 updated_at timestamptz NOT NULL DEFAULT now()
)`);
await getPool().end();
console.log('Migraciones completadas.');
