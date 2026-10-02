import {readFileSync,existsSync,mkdirSync,copyFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import path from 'node:path';
const [sourceArg,destinationArg]=process.argv.slice(2);if(!sourceArg||!destinationArg)throw new Error('Usage: npm run restore -- BACKUP_DIRECTORY NEW_EMPTY_DATA_DIRECTORY');
const source=path.resolve(sourceArg),destination=path.resolve(destinationArg);if(existsSync(destination))throw new Error('Destination already exists. Choose a new, empty path; existing data will not be overwritten.');
const manifest=JSON.parse(readFileSync(path.join(source,'COMPLETE.json'),'utf8'));
if(!manifest.files?.['onyx.sqlite'])throw new Error('Backup does not include the database.');
for(const [name,hash] of Object.entries(manifest.files)){if(name!=='onyx.sqlite'&&!/^uploads\/[0-9a-f-]{36}$/i.test(name))throw new Error('Invalid backup path');if(createHash('sha256').update(readFileSync(path.join(source,name))).digest('hex')!==hash)throw new Error('Backup checksum mismatch: '+name);}
const check=new DatabaseSync(path.join(source,'onyx.sqlite'),{readOnly:true});if(check.prepare('PRAGMA integrity_check').get().integrity_check!=='ok')throw new Error('Database integrity check failed');check.close();
mkdirSync(destination);mkdirSync(path.join(destination,'uploads'));for(const name of Object.keys(manifest.files))copyFileSync(path.join(source,name),path.join(destination,name));
console.log('Backup restored into '+destination);console.log('Set DATA_DIR to this directory and restart. Keep SESSION_SECRET unchanged for existing booking codes.');
