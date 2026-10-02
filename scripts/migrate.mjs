import {loadEnv} from './env.mjs';loadEnv();
import {migrate,closeDatabase} from '../lib/storage.mjs';
migrate();closeDatabase();console.log('Database migrations are up to date.');
