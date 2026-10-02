import {siteOrigin} from '@/lib/auth-core.mjs';
export const dynamic='force-dynamic';
export default function robots(){return {rules:{userAgent:'*',allow:'/',disallow:['/admin','/api/','/account','/login','/logout','/password']},sitemap:siteOrigin()+'/sitemap.xml'}}
