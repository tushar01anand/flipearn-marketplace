import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import listingsRoutes from './routes/listings.js';
import transactionsRoutes from './routes/transactions.js';
import reviewsRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';
import usersRoutes from './routes/users.js';
import protectionRoutes from './routes/protection.js';

dotenv.config();

const app = express();

// Middleware - CORS first
app.use(cors({
  origin: [
    'https://flipearn-marketplace.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/protection', protectionRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});