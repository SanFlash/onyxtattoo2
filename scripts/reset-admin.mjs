import {loadEnv} from './env.mjs';loadEnv();
import {createInterface} from 'node:readline/promises';
import {migrate,closeDatabase} from '../lib/storage.mjs';
import {passwordHash,token} from '../lib/auth-core.mjs';
const email=(process.env.ADMIN_EMAIL||'').trim().toLowerCase();if(!email)throw new Error('Set ADMIN_EMAIL to the existing administrator email.');
const d=migrate();const user=d.prepare("SELECT id FROM users WHERE email=? AND role='SUPER_ADMIN'").get(email);if(!user)throw new Error('No super administrator matches ADMIN_EMAIL. Check DATA_DIR and the email.');
const rl=createInterface({input:process.stdin,output:process.stdout});const answer=await rl.question(`Reset password and sign out all sessions for ${email}? Type RESET: `);rl.close();
if(answer!=='RESET'){closeDatabase();console.log('Cancelled.');process.exit(0);}
const password=token().slice(0,24);const hash=await passwordHash(password);d.exec('BEGIN IMMEDIATE');try{d.prepare('UPDATE users SET password_hash=?,active=1 WHERE id=?').run(hash,user.id);d.prepare('DELETE FROM auth_sessions WHERE user_id=?').run(user.id);d.exec('COMMIT');}catch(e){d.exec('ROLLBACK');throw e;}closeDatabase();
console.log('New administrator password: '+password);console.log('Save it securely, sign in, then change it in the admin panel.');
