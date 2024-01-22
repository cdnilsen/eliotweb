import { Client } from 'pg';
import { config } from 'dotenv';

config({ path: '.env' });

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
});

export default client;