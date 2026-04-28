import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userType !== 'admin') {
      navigate('/');
      return;
    }
    fetchAdminData();
  }, [user, navigate]);

  const fetchAdminData = async () => {
    try {
      const usersResponse = await api.get('/users');
      const transactionsResponse = await api.get('/admin/transactions', {
        headers: { 'x-user-id': user.id }
      });
      setUsers(usersResponse.data);
      setTransactions(transactionsResponse.data);
    } catch (error) {
      console.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const pendingTransactions = transactions.filter((tx) => tx.status === 'pending').length;
  const completedTransactions = transactions.filter((tx) => tx.status === 'completed').length;

  if (loading) {
    return (
      <div className="admin-state">
        <div className="admin-state-card">
          <div className="admin-spinner" />
          <h2>Loading admin dashboard</h2>
          <p>Gathering user growth, transaction activity, and platform-level signals.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <section className="admin-hero">
        <div className="admin-hero-bg" aria-hidden="true">
          <span>🛡️</span>
          <span>📊</span>
          <span>👥</span>
          <span>💼</span>
          <span>📈</span>
          <span>🧾</span>
        </div>
        <div className="container admin-hero-inner">
          <div className="admin-hero-copy">
            <span className="admin-kicker">Platform Operations</span>
            <h1>Admin dashboard for marketplace oversight</h1>
            <p>
              Monitor user growth, transaction volume, and current deal flow
              from one cleaner control surface.
            </p>
          </div>

          <div className="admin-highlight-card">
            <span className="admin-card-badge">Live Snapshot</span>
            <h2>Marketplace health</h2>
            <div className="admin-highlight-grid">
              <div>
                <strong>{users.length}</strong>
                <span>Total users</span>
              </div>
              <div>
                <strong>{transactions.length}</strong>
                <span>Total transactions</span>
              </div>
              <div>
                <strong>{pendingTransactions}</strong>
                <span>Pending deals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-summary-section">
        <div className="container">
          <div className="admin-summary-grid">
            <div className="admin-summary-card">
              <span>Total Users</span>
              <strong>{users.length}</strong>
              <p>Registered users currently visible in the platform data feed.</p>
            </div>
            <div className="admin-summary-card">
              <span>Total Transactions</span>
              <strong>{transactions.length}</strong>
              <p>Offer records created across buyer and seller activity.</p>
            </div>
            <div className="admin-summary-card">
              <span>Pending Deals</span>
              <strong>{pendingTransactions}</strong>
              <p>Transactions still waiting on acceptance or rejection.</p>
            </div>
            <div className="admin-summary-card">
              <span>Completed Deals</span>
              <strong>{completedTransactions}</strong>
              <p>Transactions that have already moved to completion status.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-table-section">
        <div className="container">
          <div className="admin-table-header">
            <div>
              <span className="admin-results-label">Transaction Feed</span>
              <h2>All Transactions</h2>
            </div>
            <p>
              Review listing activity, deal amounts, and status changes across the
              entire marketplace.
            </p>
          </div>

          <div className="admin-table-shell">
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Listing</th>
                    <th>Platform</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>#{tx.id}</td>
                      <td>{tx.username}</td>
                      <td>{tx.platform}</td>
                      <td>${tx.amount}</td>
                      <td>
                        <span className={`admin-status-pill admin-status-${tx.status}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
