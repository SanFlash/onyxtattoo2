import {loadEnv} from './env.mjs';loadEnv();
import {bootstrap} from './bootstrap.mjs';
import {spawn} from 'node:child_process';
await bootstrap();
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--webpack','--hostname','0.0.0.0','--port',process.env.PORT||'3000'],{stdio:'inherit',env:process.env});
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??0));
