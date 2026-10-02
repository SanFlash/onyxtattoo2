// Local production server only: never targets your deployed service or real data.
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {mkdtempSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {randomBytes} from 'node:crypto';
import {createServer} from 'node:net';
const probe=createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r));
const root=mkdtempSync(path.join(tmpdir(),'onyx-e2e-')),data=path.join(root,'data'),origin=`http://127.0.0.1:${port}`;
const password='Synthetic-'+randomBytes(15).toString('hex');
const env={...process.env,RENDER:'false',DATA_DIR:data,PORT:String(port),APP_URL:origin,SESSION_SECRET:randomBytes(48).toString('hex'),ADMIN_EMAIL:'owner@example.test',ADMIN_PASSWORD:password,NEXT_TELEMETRY_DISABLED:'1'};
let child,log='',checks=0;
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function start(){child=spawn(process.execPath,['scripts/start.mjs'],{env,stdio:['ignore','pipe','pipe']});child.stdout.on('data',x=>log+=x);child.stderr.on('data',x=>log+=x);for(let n=0;n<100;n++){if(child.exitCode!==null)throw Error(log);try{const r=await fetch(origin+'/api/health');if(r.ok)return}catch{}await delay(100)}throw Error('Server did not become ready: '+log)}
async function stop(){if(!child||child.exitCode!==null)return;const p=new Promise(r=>child.once('exit',r));child.kill('SIGTERM');await Promise.race([p,delay(5000).then(()=>{if(child.exitCode===null)child.kill('SIGKILL')})]);}
function check(condition,label){assert.ok(condition,label);checks++;console.log('PASS '+label)}
function client(){const jar=new Map();return async(route,{method='GET',body,headers={},status=200,raw=false}={})=>{const r=await fetch(origin+route,{method,redirect:'manual',headers:{...(method!=='GET'?{Origin:origin}:{}),...(body&&!(body instanceof FormData)?{'Content-Type':'application/json'}:{}),Cookie:[...jar].map(([k,v])=>k+'='+v).join('; '),...headers},body:body instanceof FormData?body:body===undefined?undefined:JSON.stringify(body)});for(const cookie of r.headers.getSetCookie()){const first=cookie.split(';')[0],i=first.indexOf('=');jar.set(first.slice(0,i),first.slice(i+1))}const text=await r.text();assert.equal(r.status,status,`${method} ${route}: ${text.slice(0,700)}`);checks++;let result;try{result=JSON.parse(text)}catch{result=text}return raw?{r,text}:result}}
const admin=client(),guest=client(),stranger=client();
try{
 await start();
 for(const route of ['/','/about','/artists','/portfolio','/styles','/services','/pricing','/booking','/studio','/hygiene','/aftercare','/testimonials','/faqs','/journal','/gallery','/offers','/contact','/privacy','/terms','/cancellation','/flash','/custom','/account','/login','/logout','/password','/robots.txt','/sitemap.xml','/favicon.svg'])await guest(route);
 await guest('/unknown-page',{status:404});
 const home=await guest('/',{raw:true});check(home.r.headers.get('x-content-type-options')==='nosniff','security response headers');check(home.text.includes(origin),'metadata uses configured origin');
 const redirect=await guest('/admin',{status:307,raw:true});check(redirect.r.headers.get('location').startsWith('/login'),'admin requires sign-in');
 await guest('/api/onyx/dashboard',{status:401});
 await guest('/api/onyx/dashboard',{headers:{'oai-authenticated-user-email':'owner@example.test'},status:401});
 await admin('/api/auth/login',{method:'POST',body:{email:env.ADMIN_EMAIL,password},headers:{Origin:'https://wrong.example'},status:403});
 await admin('/api/auth/login',{method:'POST',body:{email:env.ADMIN_EMAIL,password:'incorrect'},status:401});
 const login=await admin('/api/auth/login',{method:'POST',body:{email:env.ADMIN_EMAIL,password,returnTo:'//evil.example'},raw:true});check(login.r.headers.get('set-cookie').includes('HttpOnly'),'session cookie is HttpOnly');check(JSON.parse(login.text).returnTo==='/admin','external login redirect blocked');
 await admin('/api/onyx/seed',{method:'POST',body:{}});await admin('/api/onyx/seed',{method:'POST',body:{},status:409});
 const content=await admin('/api/onyx/content'),artist=content.items.find(x=>x.kind==='artists');check(!!artist,'demo content persisted and editable');
 for(const route of ['/admin','/admin/bookings','/admin/calendar','/admin/users','/admin/media'])await admin(route);
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jX1cAAAAASUVORK5CYII=','base64');
 const upload=async(c,isPublic)=>{const form=new FormData();form.set('file',new Blob([png],{type:'image/png'}),'test.png');form.set('public',String(isPublic));return c('/api/onyx/media',{method:'POST',body:form,status:201})};
 const privateFile=await upload(guest,false),publicFile=await upload(admin,true);
 await guest(privateFile.url);await stranger(privateFile.url,{status:401});await admin(privateFile.url);await stranger(publicFile.url);
 const invalid=new FormData();invalid.set('file',new Blob(['not a valid image'],{type:'image/png'}),'fake.png');await guest('/api/onyx/media',{method:'POST',body:invalid,status:400});
 let date=new Date(Date.now()+7*86400000);while(date.getUTCDay()===0)date=new Date(date.getTime()+86400000);const day=date.toISOString().slice(0,10);
 const request={name:'Test Customer',email:'customer@example.test',phone:'+91 9000000000',service:'Consultation',style:'Custom',artist:artist.id,placement:'Forearm',size:'Medium',description:'Synthetic test consultation request.',date:day,time:'11:00',budget:'Discuss',colour:'Black & Grey',age:true,consent:true,references:[privateFile.id]};
 await stranger('/api/onyx/bookings',{method:'POST',body:request,status:400});
 const first=await guest('/api/onyx/bookings',{method:'POST',body:request,status:201});
 const second=await stranger('/api/onyx/bookings',{method:'POST',body:{...request,email:'other@example.test',references:[]},status:201});
 const auth={Authorization:'Bearer '+first.accessToken};
 const portal=await guest('/api/onyx/account',{headers:auth});check(portal.bookings.length===1&&portal.bookings[0].id===first.id,'private code reveals only its booking');
 await guest('/api/onyx/account',{headers:{Authorization:'Bearer invalid'},status:403});
 await guest('/api/onyx/account/'+second.id,{method:'PATCH',headers:auth,body:{action:'cancel',notes:'Not mine'},status:403});
 await guest('/api/onyx/account/'+first.id,{method:'PATCH',headers:auth,body:{action:'reschedule',notes:'Please contact me.'}});
 const session={artist:artist.id,date:day,time:'11:00',duration:90,status:'CONFIRMED',notes:'Private studio note',amount:5000,paid:1000,payment:'DEPOSIT'};
 await admin('/api/onyx/bookings/'+first.id,{method:'PATCH',body:session});
 await admin('/api/onyx/bookings/'+second.id,{method:'PATCH',body:session,status:409});
 const availability=await guest('/api/onyx/availability?artist='+artist.id+'&date='+day);check(!availability.times.includes('11:00')&&!availability.times.includes('12:00'),'confirmed session reserves every half-hour');
 const dashboard=await admin('/api/onyx/dashboard');check(dashboard.bookings.find(b=>b.id===second.id).status==='PENDING','failed conflict rolls booking back');
 const safe=await guest('/api/onyx/account',{headers:auth});check(!JSON.stringify(safe).includes('Private studio note'),'customer portal omits internal notes');check(safe.bookings[0].data.description===request.description,'customer portal receives its display data');
 await admin('/api/onyx/bookings/'+first.id,{method:'PATCH',body:{...session,status:'CANCELLED'}});
 await admin('/api/onyx/bookings/'+second.id,{method:'PATCH',body:session});
 await guest('/api/onyx/contact',{method:'POST',body:{name:'Test Enquiry',email:'inbox@example.test',category:'Consultation',message:'A synthetic test of the contact inbox.',consent:true},status:201});
 const created=await admin('/api/onyx/content',{method:'POST',body:{kind:'portfolio',slug:'test-piece',title:'Persistent test piece',status:'published',sort:100,data:{image:publicFile.url,description:'Test work',demo:true}}});
 await stranger('/portfolio/test-piece');
 await admin('/api/onyx/media/'+publicFile.id,{method:'DELETE',status:400});
 await admin('/api/onyx/users',{method:'POST',body:{email:'viewer@example.test',name:'Read Only',role:'VIEWER',active:1,password}});
 const viewer=client();await viewer('/api/auth/login',{method:'POST',body:{email:'viewer@example.test',password}});await viewer('/api/onyx/dashboard');await viewer('/api/onyx/users',{status:403});await viewer('/api/onyx/bookings/'+second.id,{method:'PATCH',body:session,status:403});
 const users=await admin('/api/onyx/users');check(!JSON.stringify(users).includes('password_hash'),'user list never returns password hashes');
 await admin('/api/onyx/users',{method:'POST',body:{email:'viewer@example.test',name:'Read Only',role:'VIEWER',active:0}});await viewer('/api/onyx/dashboard',{status:401});
 const nextPassword='Changed-'+randomBytes(15).toString('hex');await admin('/api/auth/password',{method:'POST',body:{current:password,password:nextPassword}});
 const stale=client();await stale('/api/auth/login',{method:'POST',body:{email:env.ADMIN_EMAIL,password},status:401});await stale('/api/auth/login',{method:'POST',body:{email:env.ADMIN_EMAIL,password:nextPassword}});await stale('/api/auth/logout',{method:'POST',body:{}});await stale('/api/onyx/dashboard',{status:401});
 const audit=await admin('/api/onyx/audit');check(!JSON.stringify(audit).includes(nextPassword)&&!JSON.stringify(audit).includes(password),'audit does not contain passwords');
 const backup=path.join(root,'backup'),restored=path.join(root,'restored');execFileSync(process.execPath,['scripts/backup.mjs',backup],{env,stdio:'pipe'});execFileSync(process.execPath,['scripts/restore.mjs',backup,restored],{env,stdio:'pipe'});check(readFileSync(path.join(restored,'uploads',publicFile.id)).equals(png),'backup and restore includes actual image bytes');
 await stop();env.DATA_DIR=restored;await start();
 const after=await admin('/api/onyx/dashboard');check(after.bookings.some(b=>b.id===second.id&&b.status==='CONFIRMED'),'bookings and sessions survive restored-data restart');check(after.enquiries.some(e=>e.email==='inbox@example.test'),'contact inbox survives restart');
 await stranger(publicFile.url);await guest('/api/onyx/account',{headers:auth});await stranger('/portfolio/test-piece');
 const relogin=client();await relogin('/api/auth/login',{method:'POST',body:{email:env.ADMIN_EMAIL,password},status:401});await relogin('/api/auth/login',{method:'POST',body:{email:env.ADMIN_EMAIL,password:nextPassword}});
 await admin('/api/onyx/content/'+created.id,{method:'DELETE'});await admin('/api/onyx/media/'+publicFile.id,{method:'DELETE'});await stranger(publicFile.url,{status:404});
 console.log(`\n${checks} production HTTP and persistence checks passed.`);
}catch(e){console.error(log);throw e}finally{await stop();rmSync(root,{recursive:true,force:true})}
