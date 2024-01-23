const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'monorail.proxy.rlwy.net',
  database: 'postgresql://postgres:bGf23DCFaBcF21aDdB1A425Gf5Df3a5d@monorail.proxy.rlwy.net:21586/railway',
  password: 'bGf23DCFaBcF21aDdB1A425Gf5Df3a5d',
  port: 21586,
});

pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL database');
  }
  done();
});

module.exports = pool;
