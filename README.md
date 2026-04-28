# FlipEarn - Digital Asset Marketplace

A complete, production-ready marketplace for buying and selling verified social media accounts with built-in protection features.

## 🚀 Features

### Core Marketplace
- ✅ User Authentication (JWT-based)
- ✅ Create & Manage Listings
- ✅ Browse & Search Marketplace
- ✅ Make Offers on Listings
- ✅ Transaction Management
- ✅ User Reviews & Ratings
- ✅ User Profiles

### Protection System
- ✅ Seller Trust Badge (Score, Rating, Verification)
- ✅ Dispute Filing System
- ✅ Admin Dispute Resolution Panel
- ✅ Evidence Collection
- ✅ Trust Score Calculation

### Admin Features
- ✅ Admin Dashboard
- ✅ User Management
- ✅ Transaction Monitoring
- ✅ Dispute Resolution
- ✅ Verification Management

## 🛠 Tech Stack

### Backend
- **Node.js + Express** - REST API
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Razorpay** - Payments (coming soon)

### Frontend
- **React** - UI Framework
- **React Router** - Navigation
- **Custom CSS** - Styling

## 📋 Prerequisites

- Node.js (v14+)
- PostgreSQL
- npm

## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/tushar01anand/flipearn-marketplace.git
cd flipearn-marketplace
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in `server/` directory:
```
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flipearn
JWT_SECRET=your_super_secret_key_change_this
PORT=3001
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm start
```

Frontend runs on `http://localhost:3000`
Backend runs on `http://localhost:3001`

## 📊 Database Schema

### Users Table
- id, email, password_hash
- first_name, last_name
- user_type (buyer/seller/both/admin)
- verification_status
- average_rating, total_transactions
- is_seller_verified

### Listings Table
- id, seller_id
- platform, username
- followers, engagement_rate
- category, asking_price
- estimated_value, description
- status

### Transactions Table
- id, listing_id, buyer_id, seller_id
- amount, status
- created_at, updated_at

### Disputes Table
- id, transaction_id, user_id
- reason, evidence, status
- admin_response, resolution

### Reviews Table
- id, reviewer_id, reviewee_id
- rating, comment, transaction_id

## 🔐 Authentication

Uses JWT tokens stored in localStorage. Protected routes require valid token in headers.

### Login
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}
```

### Signup
```bash
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "password",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "both"
}
```

## 📱 API Endpoints

### Listings
- `GET /api/listings` - Get all listings
- `POST /api/listings` - Create listing
- `GET /api/listings/:id` - Get listing details
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Make offer
- `PUT /api/transactions/:id` - Update transaction status

### Protection
- `GET /api/protection/seller/:id` - Get seller trust info
- `POST /api/protection/dispute` - File dispute
- `GET /api/protection/disputes/admin` - Get all disputes (admin only)
- `PUT /api/protection/disputes/:id/resolve` - Resolve dispute (admin only)

## 👥 User Roles

### Buyer
- Browse listings
- Make offers
- File disputes
- Leave reviews

### Seller
- Create listings
- Accept/reject offers
- Complete transactions
- Build reputation

### Admin
- Manage users
- Resolve disputes
- Verify sellers
- Monitor transactions

## 🛡️ Protection Features

1. **Trust Badge** - Shows seller's trust score, ratings, and verification status
2. **Dispute System** - Users can file disputes with evidence
3. **Admin Resolution** - Admins review and resolve disputes
4. **Evidence Trail** - All communications tracked
5. **Reputation System** - Builds trust over time

## 🚀 Deployment

### Deploy Backend (Railway)
1. Go to https://railway.app
2. Create new project
3. Connect GitHub repository
4. Add environment variables
5. Deploy

### Deploy Frontend (Vercel)
1. Go to https://vercel.com
2. Import GitHub project
3. Set build command: `npm run build`
4. Deploy

## 📈 Future Features

- [ ] Razorpay Payment Integration (Cards, UPI, Net Banking)
- [ ] Escrow System
- [ ] Email Notifications
- [ ] Image Uploads (S3/Cloudinary)
- [ ] Mobile App
- [ ] Advanced Analytics
- [ ] AI Fraud Detection

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 👤 Author

Created by Tushar Anand

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email tushar01anand@gmail.com or open an issue on GitHub.

---

**Ready to launch? Deploy now and start accepting transactions!** 🚀
cd ~/flipearn-project
git add README.md
git commit -m "Add comprehensive README"
git push origin main
cd ~/flipearn-project
git add README.md
y
