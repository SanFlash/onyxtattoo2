import {publicRoutes} from '@/lib/onyx-data';
import {rows} from '@/lib/onyx-db';
import {siteOrigin} from '@/lib/auth-core.mjs';
export const dynamic='force-dynamic';
export default async function sitemap(){const origin=siteOrigin();let details:any[]=[];try{details=await rows("SELECT kind,slug,updated,data FROM content WHERE status='published'")}catch{}return [...publicRoutes.map(path=>({url:`${origin}/${path}`,changeFrequency:'monthly' as const,priority:path?0.6:1})),...details.filter(r=>['artists','portfolio','blog','gallery','styles','services'].includes(r.kind)&&!JSON.parse(r.data).noindex).map(r=>({url:`${origin}/${r.kind==='blog'?'journal':r.kind}/${r.slug}`,lastModified:r.updated,priority:0.7}))]}
