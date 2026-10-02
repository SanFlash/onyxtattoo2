import {randomBytes,createHmac,scrypt,timingSafeEqual} from 'node:crypto';
export function requireSecret(){const key=process.env.SESSION_SECRET||'';if(key.length<32)throw new Error('SESSION_SECRET must contain at least 32 random characters. Run npm run setup locally, or configure it in Render.');return key;}
export const token=()=>randomBytes(32).toString('base64url');
export const digest=(value)=>createHmac('sha256',requireSecret()).update(value).digest('hex');
export async function passwordHash(password){if(typeof password!=='string'||password.length<12||password.length>128)throw new Error('Use a password between 12 and 128 characters.');const salt=randomBytes(16).toString('hex');const hash=await derive(password,salt);return `scrypt:${salt}:${hash.toString('hex')}`;}
async function derive(password,salt){return new Promise((resolve,reject)=>scrypt(password,salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024},(error,key)=>error?reject(error):resolve(key)));}
export async function passwordMatches(password,stored){if(typeof password!=='string'||password.length>128)return false;const parts=String(stored||'').split(':');const valid=parts.length===3&&parts[0]==='scrypt'&&/^[a-f0-9]{32}$/.test(parts[1])&&/^[a-f0-9]{128}$/.test(parts[2]);const actual=await derive(password,valid?parts[1]:'0'.repeat(32));const expected=Buffer.from(valid?parts[2]:'0'.repeat(128),'hex');return timingSafeEqual(actual,expected)&&valid;}
export function siteOrigin(){const origin=process.env.APP_URL||process.env.RENDER_EXTERNAL_URL||'http://localhost:3000';const url=new URL(origin);if(!['http:','https:'].includes(url.protocol))throw new Error('APP_URL must start with https://');return url.origin;}
export const secureCookie=()=>siteOrigin().startsWith('https://');
export function clientIP(req){if(process.env.RENDER==='true')return req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()||'unknown';return 'local';}
export function checkOrigin(req){return req.headers.get('origin')===siteOrigin();}
export function safeReturn(value){return typeof value==='string'&&value.startsWith('/')&&!value.startsWith('//')&&!value.includes('\\')?value:'/admin';}
