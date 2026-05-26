const { Pool } = require('pg');

// Render provides postgres:// but pg needs postgresql://
const connectionString = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace(/^postgres:\/\//, 'postgresql://')
  : undefined;

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => console.error('DB pool error:', err.message));

async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('DB error:', err.message);
    throw err;
  }
}

module.exports = { query, pool };
