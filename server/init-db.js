import pool from './config/database.js';

const initDatabase = async () => {
  try {
    console.log('Initializing database...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        avatar_url TEXT,
        bio TEXT,
        verification_status VARCHAR(50) DEFAULT 'unverified',
        average_rating DECIMAL(3,2) DEFAULT 0,
        total_transactions INTEGER DEFAULT 0,
        is_seller_verified BOOLEAN DEFAULT false,
        user_type VARCHAR(50) DEFAULT 'both',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');

    // Create listings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        seller_id INTEGER NOT NULL REFERENCES users(id),
        platform VARCHAR(100) NOT NULL,
        username VARCHAR(255) NOT NULL,
        followers INTEGER,
        engagement_rate DECIMAL(5,2),
        category VARCHAR(100),
        asking_price DECIMAL(12,2) NOT NULL,
        estimated_value DECIMAL(12,2),
        description TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Listings table created');

    // Create transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        listing_id INTEGER NOT NULL REFERENCES listings(id),
        buyer_id INTEGER NOT NULL REFERENCES users(id),
        seller_id INTEGER NOT NULL REFERENCES users(id),
        amount DECIMAL(12,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Transactions table created');

    // Create reviews table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        reviewer_id INTEGER NOT NULL REFERENCES users(id),
        reviewee_id INTEGER NOT NULL REFERENCES users(id),
        transaction_id INTEGER REFERENCES transactions(id),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Reviews table created');

    // Create disputes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS disputes (
        id SERIAL PRIMARY KEY,
        transaction_id INTEGER NOT NULL REFERENCES transactions(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        reason TEXT NOT NULL,
        evidence TEXT,
        status VARCHAR(50) DEFAULT 'open',
        admin_response TEXT,
        resolution VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Disputes table created');

    console.log('✅ Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

initDatabase();