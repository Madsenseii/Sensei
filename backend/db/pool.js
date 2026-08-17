/**
 * db/pool.js — Postgres connection via Supabase / pg.
 * ----------------------------------------------------
 * Optimized for Vercel Serverless Functions and traditional servers alike.
 * Uses connection limits and timeouts suited for serverless lifecycles.
 */
const { Pool } = require('pg');

let poolInstance = null;

function getPool() {
  if (!poolInstance) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn('DATABASE_URL is not set. Database queries will not execute.');
      return null;
    }

    poolInstance = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: parseInt(process.env.PG_MAX_POOL || '5', 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000
    });

    poolInstance.on('error', (err) => {
      console.error('Unexpected Postgres pool error:', err);
    });
  }
  return poolInstance;
}

module.exports = {
  query: async (text, params) => {
    const pool = getPool();
    if (!pool) {
      throw new Error('DATABASE_URL environment variable is missing.');
    }
    return pool.query(text, params);
  },
  getPool
};