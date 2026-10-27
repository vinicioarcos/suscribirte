import pg from 'pg';
let pool;
export const connectionString=()=>process.env.DATABASE_URL||process.env.SUSCRIBE_DATABASE_URL;
export function getPool(){const url=connectionString();if(!url)throw new Error('DATABASE_URL no configurada');return pool??=new pg.Pool({connectionString:url,max:3});}
