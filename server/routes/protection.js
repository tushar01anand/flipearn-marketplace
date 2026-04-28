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

router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const result = await pool.query(
      `SELECT id, first_name, last_name, verification_status, average_rating, total_transactions, is_seller_verified, created_at
       FROM users WHERE id = $1`,
      [sellerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    const seller = result.rows[0];
    const trustScore = calculateTrustScore(seller);

    res.json({
      seller,
      trustScore,
      badge: getTrustBadge(trustScore)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/dispute', authMiddleware, async (req, res) => {
  try {
    const { transactionId, reason, evidence } = req.body;
    const userId = req.headers['x-user-id'];

    if (!transactionId || !reason) {
      return res.status(400).json({ error: 'TransactionId and reason required' });
    }

    const transaction = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [transactionId]
    );

    if (transaction.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const tx = transaction.rows[0];
    if (tx.buyer_id !== parseInt(userId) && tx.seller_id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await pool.query(
      `INSERT INTO disputes (transaction_id, user_id, reason, evidence, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [transactionId, userId, reason, evidence || '', 'open']
    );

    res.status(201).json({
      message: 'Dispute created',
      dispute: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/disputes/admin', authMiddleware, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    const userCheck = await pool.query('SELECT user_type FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0 || userCheck.rows[0].user_type !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await pool.query(
      `SELECT d.*, t.amount, l.username FROM disputes d
       JOIN transactions t ON d.transaction_id = t.id
       JOIN listings l ON t.listing_id = l.id
       ORDER BY d.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

function calculateTrustScore(seller) {
  let score = 50;
  
  if (seller.is_seller_verified) score += 30;
  if (seller.verification_status === 'verified') score += 15;
  if (seller.average_rating >= 4.5) score += 5;
  if (seller.total_transactions >= 10) score += 5;
  
  return Math.min(score, 100);
}

function getTrustBadge(score) {
  if (score >= 90) return { label: 'Trusted Seller', color: '#10b981' };
  if (score >= 75) return { label: 'Verified Seller', color: '#3b82f6' };
  if (score >= 60) return { label: 'Unverified', color: '#f59e0b' };
  return { label: 'New Seller', color: '#ef4444' };
}
router.put('/disputes/:disputeId/resolve', authMiddleware, async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { adminResponse, resolution } = req.body;
    const userId = req.headers['x-user-id'];

    // Check if user is admin
    const userCheck = await pool.query('SELECT user_type FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0 || userCheck.rows[0].user_type !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (!adminResponse || !resolution) {
      return res.status(400).json({ error: 'Admin response and resolution required' });
    }

    const result = await pool.query(
      `UPDATE disputes 
       SET status = 'resolved', admin_response = $1, resolution = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [adminResponse, resolution, disputeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dispute not found' });
    }

    res.json({
      message: 'Dispute resolved',
      dispute: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
export default router;