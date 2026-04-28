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

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { transactionId, rating, comment } = req.body;
    const reviewerId = req.headers['x-user-id'];

    if (!transactionId || !rating) {
      return res.status(400).json({ error: 'TransactionId and rating required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const transaction = await pool.query('SELECT * FROM transactions WHERE id = $1', [transactionId]);
    if (transaction.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const tx = transaction.rows[0];
    if (tx.buyer_id !== parseInt(reviewerId) && tx.seller_id !== parseInt(reviewerId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await pool.query(
      `INSERT INTO reviews (transaction_id, reviewer_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [transactionId, reviewerId, rating, comment || '']
    );

    res.status(201).json({
      message: 'Review created successfully',
      review: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT r.*, u.first_name, u.last_name
       FROM reviews r
       JOIN transactions t ON r.transaction_id = t.id
       JOIN users u ON r.reviewer_id = u.id
       WHERE t.seller_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;