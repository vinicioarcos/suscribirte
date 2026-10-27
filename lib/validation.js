import {z} from 'zod';
const validDate=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s=>{const d=new Date(s+'T00:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===s;});
export const subscription=z.object({id:z.string().regex(/^[a-zA-Z0-9-]{1,80}$/),name:z.string().trim().min(1).max(80),cost:z.number().finite().min(0).max(100000000),start:validDate,end:validDate,alert:z.number().int().min(0).max(365),cycle:z.enum(['month','year','custom'])}).refine(s=>s.end>s.start);
export const collection=z.object({version:z.number().int().min(0),items:z.array(subscription).max(500)}).refine(v=>new Set(v.items.map(s=>s.id)).size===v.items.length);
