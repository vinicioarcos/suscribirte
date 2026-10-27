import {betterAuth} from 'better-auth';
import {nextCookies} from 'better-auth/next-js';
import {getPool} from './db.js';
let instance;
export function getAuth(){if(!process.env.BETTER_AUTH_SECRET)throw new Error('BETTER_AUTH_SECRET no configurada');return instance??=betterAuth({database:getPool(),baseURL:process.env.BETTER_AUTH_URL,secret:process.env.BETTER_AUTH_SECRET,emailAndPassword:{enabled:true,minPasswordLength:12},rateLimit:{enabled:true,storage:'database'},plugins:[nextCookies()]});}
