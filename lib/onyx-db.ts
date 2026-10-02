import {db,bucket} from './storage.mjs';
export {db,bucket};
export const now=()=>new Date().toISOString();
export const uid=()=>crypto.randomUUID();
export const run=(sql:string,...params:any[])=>db().prepare(sql).bind(...params);
export const rows=async(sql:string,...params:any[])=>((await run(sql,...params).all()).results as any[]);
export const one=async(sql:string,...params:any[]):Promise<any>=>await run(sql,...params).first();
export const auditLog=(user:string,action:string,entity:string,before:any=null,after:any=null)=>run('INSERT INTO audit (id,user,action,entity,before,after,created) VALUES (?,?,?,?,?,?,?)',uid(),user,action,entity,before?JSON.stringify(before):null,after?JSON.stringify(after):null,now());
