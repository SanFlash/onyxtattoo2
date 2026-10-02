import {existsSync,writeFileSync} from 'node:fs';
import {createInterface} from 'node:readline/promises';
import {randomBytes} from 'node:crypto';
if(existsSync('.env')){console.log('.env already exists. It was not overwritten. Edit it if needed, then run npm run dev.');process.exit(0);}
const rl=createInterface({input:process.stdin,output:process.stdout});
let email=process.env.ADMIN_EMAIL||'';
while(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){email=(await rl.question('Administrator email: ')).trim().toLowerCase();}
rl.close();
const password=randomBytes(18).toString('base64url');const secret=randomBytes(48).toString('hex');
writeFileSync('.env',`APP_URL=http://localhost:3000\nDATA_DIR=.data\nSESSION_SECRET=${secret}\nADMIN_EMAIL=${email}\nADMIN_PASSWORD=${password}\nADMIN_NAME="Studio Owner"\n`,{mode:0o600,flag:'wx'});
console.log('\nLocal configuration created in .env. Keep this file private.');
console.log('Admin email: '+email);console.log('Generated admin password: '+password);
console.log('\nRun npm run dev. Open http://localhost:3000/admin and sign in.');
console.log('You can change your password inside the admin panel.');
