import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {one,run,now} from '@/lib/onyx-db';
import {token,digest,secureCookie,safeReturn} from '@/lib/auth-core.mjs';
const SESSION='onyx_session';
export type AppUser={userId:string;email:string;displayName:string;role:string};
export async function getAppUser():Promise<AppUser|null>{const session=(await cookies()).get(SESSION)?.value;if(!session)return null;const u=await one('SELECT u.id,u.email,u.name,u.role FROM auth_sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires>? AND u.active=1',digest(session),Date.now());return u?{userId:u.id,email:u.email,displayName:u.name,role:u.role}:null;}
export async function requireAppUser(returnTo:string){const user=await getAppUser();if(!user)redirect('/login?returnTo='+encodeURIComponent(safeReturn(returnTo)));return user;}
export async function beginSession(userId:string){const raw=token();const expires=Date.now()+12*60*60*1000;await run('INSERT INTO auth_sessions (token_hash,user_id,expires,created) VALUES (?,?,?,?)',digest(raw),userId,expires,now()).run();(await cookies()).set(SESSION,raw,{httpOnly:true,secure:secureCookie(),sameSite:'lax',path:'/',maxAge:12*60*60});}
export async function endSession(){const jar=await cookies();const raw=jar.get(SESSION)?.value;if(raw)await run('DELETE FROM auth_sessions WHERE token_hash=?',digest(raw)).run();jar.set(SESSION,'',{httpOnly:true,secure:secureCookie(),sameSite:'lax',path:'/',maxAge:0});}
export async function uploadOwner(){const u=await getAppUser();if(u)return u.userId;const jar=await cookies();const value=jar.get('onyx_guest')?.value;const [id,signature]=String(value||'').split('.');if(id&&signature===digest('guest:'+id))return 'guest:'+id;const next=token();jar.set('onyx_guest',next+'.'+digest('guest:'+next),{httpOnly:true,secure:secureCookie(),sameSite:'lax',path:'/',maxAge:24*60*60});return 'guest:'+next;}
