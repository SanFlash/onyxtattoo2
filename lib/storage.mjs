import {DatabaseSync,backup} from 'node:sqlite';
import {mkdirSync,readFileSync,readdirSync,writeFileSync,renameSync,unlinkSync,existsSync,statSync} from 'node:fs';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
const cache=globalThis.__onyxSqliteConnections??=new Map();
export const dataDirectory=()=>path.resolve(process.env.DATA_DIR||'.data');
export const databasePath=()=>path.join(dataDirectory(),'onyx.sqlite');
export function connection(){const file=databasePath();if(!cache.has(file)){mkdirSync(dataDirectory(),{recursive:true});const database=new DatabaseSync(file);database.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; PRAGMA synchronous = NORMAL;');cache.set(file,database);}return cache.get(file);}
export function closeDatabase(){const file=databasePath();const d=cache.get(file);if(d){d.close();cache.delete(file);}}
export function migrate(){const d=connection();d.exec('CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY NOT NULL, checksum TEXT NOT NULL, applied TEXT NOT NULL)');for(const name of readdirSync(path.resolve('migrations')).filter(f=>f.endsWith('.sql')).sort()){const sql=readFileSync(path.resolve('migrations',name),'utf8');const checksum=createHash('sha256').update(sql).digest('hex');const applied=d.prepare('SELECT checksum FROM schema_migrations WHERE name=?').get(name);if(applied){if(applied.checksum!==checksum)throw new Error('An applied migration was changed: '+name);continue;}d.exec('BEGIN IMMEDIATE');try{d.exec(sql.replaceAll('--> statement-breakpoint',''));d.prepare('INSERT INTO schema_migrations VALUES (?,?,?)').run(name,checksum,new Date().toISOString());d.exec('COMMIT');}catch(e){d.exec('ROLLBACK');throw e;}}return d;}
class Statement{
 constructor(sql,params=[]){this.sql=sql;this.params=params;}
 bind(...params){return new Statement(this.sql,params);}
 async first(){return connection().prepare(this.sql).get(...this.params)??null;}
 async all(){return {results:connection().prepare(this.sql).all(...this.params)};}
 async run(){return this.execute();}
 execute(){const s=connection().prepare(this.sql);return {success:true,meta:s.run(...this.params)};}
}
export const db=()=>({prepare:(sql)=>new Statement(sql),batch:async(statements)=>{const d=connection();d.exec('BEGIN IMMEDIATE');try{const result=statements.map(s=>s.execute());d.exec('COMMIT');return result}catch(e){d.exec('ROLLBACK');throw e}}});
function uploadPath(key){if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key))throw new Error('Invalid media key');const directory=path.join(dataDirectory(),'uploads');mkdirSync(directory,{recursive:true});return path.join(directory,key);}
export const bucket=()=>({
 put:async(key,bytes,_options)=>{const destination=uploadPath(key);const temp=destination+'.'+randomUUID()+'.tmp';writeFileSync(temp,bytes,{mode:0o600,flag:'wx'});renameSync(temp,destination);},
 get:async(key)=>{const file=uploadPath(key);return existsSync(file)?{body:new Uint8Array(readFileSync(file))}:null;},
 delete:async(key)=>{const file=uploadPath(key);if(existsSync(file))unlinkSync(file);}
});
export async function snapshot(destination){mkdirSync(path.dirname(destination),{recursive:true});await backup(connection(),destination);return destination;}
