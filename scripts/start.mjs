import {loadEnv} from './env.mjs';loadEnv();
import {bootstrap} from './bootstrap.mjs';
import {spawn} from 'node:child_process';
await bootstrap();
const port=process.env.PORT||'3000';
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','0.0.0.0','--port',port],{stdio:'inherit',env:{...process.env,NODE_ENV:'production'}});
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??0));
