import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  next();
};

const adminMiddleware = async (req, res, next) => {
  const userId = req.headers['x-user-id'];
  try {
    const result = await pool.query('SELECT user_type FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0 || result.rows[0].user_type !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, first_name, last_name, user_type, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/transactions', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, l.username, l.platform FROM transactions t
       JOIN listings l ON t.listing_id = l.id
       ORDER BY t.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/users/:id/verify', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE users SET verification_status = $1 WHERE id = $2 RETURNING *',
      ['verified', id]
    );
    res.json({ message: 'User verified', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;