import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {migrate,connection,closeDatabase,db,bucket} from '../lib/storage.mjs';
import {passwordHash,passwordMatches,digest,safeReturn} from '../lib/auth-core.mjs';

test('native storage, authentication and restart durability',async t=>{
 const directory=mkdtempSync(path.join(tmpdir(),'onyx-unit-'));
 const previous={DATA_DIR:process.env.DATA_DIR,SESSION_SECRET:process.env.SESSION_SECRET};
 process.env.DATA_DIR=directory;process.env.SESSION_SECRET=randomUUID()+randomUUID();
 try{
  await t.test('migrations apply once and record checksums',()=>{migrate();migrate();assert.equal(connection().prepare('SELECT count(*) n FROM schema_migrations').get().n,2)});
  await t.test('conflicting slot transaction rolls back its earlier writes',async()=>{
   const sql='INSERT INTO slots(id,booking,artist,date,time) VALUES(?,?,?,?,?)';
   await db().prepare(sql).bind('first','a','artist','2030-01-01','11:00').run();
   await assert.rejects(db().batch([db().prepare('DELETE FROM slots WHERE id=?').bind('first'),db().prepare(sql).bind('second','b','artist','2030-01-01','11:30'),db().prepare(sql).bind('third','c','artist','2030-01-01','11:30')]));
   assert.deepEqual(connection().prepare('SELECT id FROM slots').all().map(x=>x.id),['first']);
  });
  await t.test('uploads and records survive closing and reopening database',async()=>{
   const id=randomUUID();await bucket().put(id,Buffer.from('fixture'));closeDatabase();migrate();assert.equal(connection().prepare('SELECT count(*) n FROM slots').get().n,1);assert.equal(Buffer.from((await bucket().get(id)).body).toString(),'fixture');await assert.rejects(bucket().get('../secret'));
  });
  await t.test('scrypt hashes are salted and verify only the right password',async()=>{const password='Synthetic-password-only';const a=await passwordHash(password),b=await passwordHash(password);assert.notEqual(a,b);assert.equal(await passwordMatches(password,a),true);assert.equal(await passwordMatches('wrong',a),false);assert.equal(await passwordMatches(password,null),false)});
  await t.test('tokens are keyed and redirect targets cannot escape site',()=>{const a=digest('sample');process.env.SESSION_SECRET=randomUUID()+randomUUID();assert.notEqual(a,digest('sample'));assert.equal(safeReturn('//evil.example'),'/admin');assert.equal(safeReturn('/\\evil.example'),'/admin');assert.equal(safeReturn('/admin/bookings'),'/admin/bookings')});
 }finally{closeDatabase();rmSync(directory,{recursive:true,force:true});for(const [key,value] of Object.entries(previous)){if(value===undefined)delete process.env[key];else process.env[key]=value;}}
});
