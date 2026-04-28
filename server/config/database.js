import pg from 'pg';

const { Pool } = pg;

let pool;

if (process.env.DATABASE_URL) {
  // Use full connection string (for Render cloud database)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  // Local development (no SSL needed)
  pool = new Pool({
    user: process.env.DB_USER || 'tusharanand',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'flipearn',
  });
}

export default pool;