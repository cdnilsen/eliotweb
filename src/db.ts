import { Pool } from 'pg';

// Create a pool with your database credentials
const pool = new Pool({
  user: process.env.RAILWAY_POSTGRES_USER,
  host: process.env.RAILWAY_POSTGRES_HOST,
  database: process.env.RAILWAY_POSTGRES_DB,
  password: process.env.RAILWAY_POSTGRES_PASSWORD,
  port: Number(process.env.RAILWAY_POSTGRES_PORT),
});

export default pool;
