const { Pool } = require('pg');
const config = require('./env');

const connectionString = config.DATABASE_URL;
const useSSL = config.DB_SSL || connectionString.includes('supabase');

const pool = new Pool({
  connectionString,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  max: 10, // Max clients in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: config.DB_CONNECTION_TIMEOUT,
});

pool.on('connect', () => {
  console.log('Database pool connected successfully.');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool
};
