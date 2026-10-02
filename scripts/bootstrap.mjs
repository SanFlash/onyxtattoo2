import {migrate,connection,dataDirectory} from '../lib/storage.mjs';
import {requireSecret,passwordHash,siteOrigin} from '../lib/auth-core.mjs';
import {randomUUID} from 'node:crypto';
import {accessSync,constants,mkdirSync} from 'node:fs';

export async function bootstrap(){
  requireSecret();

  // Render Free web services do not support persistent disks.
  // Keep the local SQLite store under the service filesystem in Free mode.
  // Data in this mode is intentionally ephemeral and can be lost after
  // redeploys, restarts, or idle spin-downs.
  if(process.env.RENDER==='true' && process.env.DATA_DIR?.startsWith('/var/data/')){
    throw new Error('This ONYX deployment is configured for a persistent Render disk. For the Free plan, set DATA_DIR=.data or remove DATA_DIR.');
  }

  if(process.env.RENDER==='true' && !siteOrigin().startsWith('https://')){
    throw new Error('Set APP_URL to the HTTPS Render URL or custom domain.');
  }

  mkdirSync(dataDirectory(),{recursive:true});
  accessSync(dataDirectory(),constants.W_OK);

  const d=migrate();
  const existing=d.prepare('SELECT id FROM users WHERE role=?').get('SUPER_ADMIN');

  if(!existing){
    const email=(process.env.ADMIN_EMAIL||'').trim().toLowerCase();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      throw new Error('Set ADMIN_EMAIL to your real administrator email.');
    }
    const hash=await passwordHash(process.env.ADMIN_PASSWORD||'');
    d.prepare('INSERT INTO users (id,email,name,role,active,created,password_hash) VALUES (?,?,?,?,1,?,?)')
      .run(randomUUID(),email,process.env.ADMIN_NAME||'Studio Owner','SUPER_ADMIN',new Date().toISOString(),hash);
    console.log('Initial studio administrator created.');
  }

  d.prepare('DELETE FROM auth_sessions WHERE expires<?').run(Date.now());
  d.prepare('DELETE FROM limits WHERE expires<?').run(Date.now()-86400000);

  if(process.env.RENDER==='true'){
    console.log('ONYX is running on Render Free: local SQLite/media storage is ephemeral.');
  }
  console.log('Studio storage and authentication are ready.');
}
