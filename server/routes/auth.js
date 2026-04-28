import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  try {
   const { email, password, firstName, lastName, userType } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);

    // Create user
    const result = await pool.query(
     'INSERT INTO users (email, password_hash, first_name, last_name, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, user_type',
[email, passwordHash, firstName || '', lastName || '', userType || 'both']
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Check password
    const passwordMatch = await bcryptjs.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

 res.json({
  message: 'Login successful',
  token,
  user: {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    userType: user.user_type,
  },
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;