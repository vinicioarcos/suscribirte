import {z} from 'zod';
const validDate=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s=>{const d=new Date(s+'T00:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===s;});
const validTime=z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
export const instant=s=>s.end+'T'+(s.endTime??'00:00')>s.start+'T'+(s.startTime??'00:00');
export const subscription=z.object({id:z.string().regex(/^[a-zA-Z0-9-]{1,80}$/),name:z.string().trim().min(1).max(80),cost:z.number().finite().min(0).max(100000000),start:validDate,startTime:validTime.optional(),end:validDate,endTime:validTime.optional(),alert:z.number().int().min(0).max(365),cycle:z.enum(['month','year','custom'])}).refine(instant);
export const collection=z.object({version:z.number().int().min(0),items:z.array(subscription).max(500)}).refine(v=>new Set(v.items.map(s=>s.id)).size===v.items.length);
