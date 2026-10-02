import {connection,dataDirectory} from '@/lib/storage.mjs';
import {accessSync,constants} from 'node:fs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){try{connection().prepare('SELECT 1 FROM schema_migrations LIMIT 1').get();accessSync(dataDirectory(),constants.W_OK);return Response.json({status:'ok'},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({status:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}})}}
