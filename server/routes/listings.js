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
    const { platform, username, followers, engagementRate, category, askingPrice, description, estimatedValue } = req.body;
    const sellerId = req.headers['x-user-id'];

    if (!platform || !username || !askingPrice) {
      return res.status(400).json({ error: 'Platform, username, and askingPrice are required' });
    }

    const result = await pool.query(
      `INSERT INTO listings (seller_id, platform, username, followers, engagement_rate, category, asking_price, description, estimated_value, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [sellerId, platform, username, followers || 0, engagementRate || 0, category, askingPrice, description, estimatedValue || 0, 'active']
    );

    res.status(201).json({
      message: 'Listing created successfully',
      listing: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search, platform, minPrice, maxPrice } = req.query;
    
    let query = `SELECT l.*, u.first_name, u.last_name FROM listings l
                 JOIN users u ON l.seller_id = u.id
                 WHERE l.status = 'active'`;
    const params = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (l.username ILIKE $${paramCount} OR l.category ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (platform) {
      query += ` AND l.platform = $${paramCount}`;
      params.push(platform);
      paramCount++;
    }

    if (minPrice) {
      query += ` AND l.asking_price >= $${paramCount}`;
      params.push(parseFloat(minPrice));
      paramCount++;
    }

    if (maxPrice) {
      query += ` AND l.asking_price <= $${paramCount}`;
      params.push(parseFloat(maxPrice));
      paramCount++;
    }

    query += ` ORDER BY l.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT l.*, u.first_name, u.last_name, u.email FROM listings l
       JOIN users u ON l.seller_id = u.id
       WHERE l.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.headers['x-user-id'];
    const { platform, username, followers, engagementRate, category, askingPrice, description, estimatedValue } = req.body;

    const listing = await pool.query('SELECT * FROM listings WHERE id = $1', [id]);
    if (listing.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.rows[0].seller_id !== parseInt(sellerId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await pool.query(
      `UPDATE listings SET platform = $1, username = $2, followers = $3, engagement_rate = $4, category = $5, asking_price = $6, description = $7, estimated_value = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [platform, username, followers, engagementRate, category, askingPrice, description, estimatedValue, id]
    );

    res.json({
      message: 'Listing updated successfully',
      listing: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.headers['x-user-id'];

    const listing = await pool.query('SELECT * FROM listings WHERE id = $1', [id]);
    if (listing.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.rows[0].seller_id !== parseInt(sellerId)) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    await pool.query('DELETE FROM listings WHERE id = $1', [id]);
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;