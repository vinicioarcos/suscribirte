import {getAuth} from '../../../../lib/auth.js';
export const runtime='nodejs';
async function handle(request){try{return await getAuth().handler(request);}catch{return Response.json({message:'El acceso todavía no está configurado. Contacta al administrador.'},{status:503});}}
export const GET=handle;
export const POST=handle;
