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
    const { listingId, amount } = req.body;
    const buyerId = req.headers['x-user-id'];

    if (!listingId || !amount) {
      return res.status(400).json({ error: 'ListingId and amount required' });
    }

    const listingResult = await pool.query('SELECT * FROM listings WHERE id = $1', [listingId]);
    if (listingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const listing = listingResult.rows[0];
    const sellerId = listing.seller_id;

    if (buyerId == sellerId) {
      return res.status(400).json({ error: 'Cannot buy your own listing' });
    }

    const result = await pool.query(
      `INSERT INTO transactions (listing_id, buyer_id, seller_id, amount, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [listingId, buyerId, sellerId, amount, 'pending']
    );

    res.status(201).json({
      message: 'Offer created successfully',
      transaction: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    const result = await pool.query(
      `SELECT t.*, l.username, l.platform, u.first_name, u.last_name
       FROM transactions t
       JOIN listings l ON t.listing_id = l.id
       JOIN users u ON t.seller_id = u.id
       WHERE t.buyer_id = $1 OR t.seller_id = $1
       ORDER BY t.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.headers['x-user-id'];

    const transaction = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
    if (transaction.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.rows[0].seller_id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (!['accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      `UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    res.json({
      message: 'Transaction updated',
      transaction: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;