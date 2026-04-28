import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function Transactions() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTransactions();
  }, [user, navigate]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions', {
        headers: { 'x-user-id': user.id }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (transactionId, newStatus) => {
    try {
      await api.put(`/transactions/${transactionId}`, { status: newStatus }, {
        headers: { 'x-user-id': user.id }
      });
      fetchTransactions();
    } catch (error) {
      alert('Failed to update transaction');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#fbbf24';
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'completed': return '#4f46e5';
      default: return '#6b7280';
    }
  };

  const buyingTransactions = transactions.filter(t => t.buyer_id === user.id);
  const sellingTransactions = transactions.filter(t => t.seller_id === user.id);
  const pendingOffers = sellingTransactions.filter((t) => t.status === 'pending').length;
  const acceptedDeals = transactions.filter((t) => t.status === 'accepted' || t.status === 'completed').length;

  if (loading) {
    return (
      <div className="transactions-state">
        <div className="transactions-state-card">
          <div className="transactions-spinner" />
          <h2>Loading transactions</h2>
          <p>Pulling your active offers, purchase activity, and deal status updates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-page">
      <section className="transactions-hero">
        <div className="transactions-hero-bg" aria-hidden="true">
          <span>💼</span>
          <span>💬</span>
          <span>📊</span>
          <span>📈</span>
          <span>🤝</span>
          <span>⭐</span>
        </div>
        <div className="container transactions-hero-inner">
          <div className="transactions-hero-copy">
            <span className="transactions-kicker">Deal Workflow</span>
            <h1>Manage offers, purchases, and negotiations</h1>
            <p>
              Keep buyer and seller activity organized in one place so you can
              respond quickly and move deals forward with confidence.
            </p>
          </div>

          <div className="transactions-highlight-card">
            <span className="transactions-card-badge">At a Glance</span>
            <h2>Deal summary</h2>
            <div className="transactions-highlight-grid">
              <div>
                <strong>{buyingTransactions.length}</strong>
                <span>Buying deals</span>
              </div>
              <div>
                <strong>{pendingOffers}</strong>
                <span>Pending seller actions</span>
              </div>
              <div>
                <strong>{acceptedDeals}</strong>
                <span>Accepted or completed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="transactions-summary-section">
        <div className="container">
          <div className="transactions-summary-grid">
            <div className="transactions-summary-card">
              <span>Buying</span>
              <strong>{buyingTransactions.length}</strong>
              <p>Offers you have placed on other listings.</p>
            </div>
            <div className="transactions-summary-card">
              <span>Selling</span>
              <strong>{sellingTransactions.length}</strong>
              <p>Offers buyers have made on your listings.</p>
            </div>
            <div className="transactions-summary-card">
              <span>Pending</span>
              <strong>{pendingOffers}</strong>
              <p>Seller-side offers still waiting on your decision.</p>
            </div>
            <div className="transactions-summary-card">
              <span>Progressed Deals</span>
              <strong>{acceptedDeals}</strong>
              <p>Transactions already accepted or marked completed.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="transactions-panels-section">
        <div className="container transactions-panels-grid">
          <div className="transactions-panel">
            <div className="transactions-panel-header">
              <div>
                <span className="transactions-results-label">Buyer Activity</span>
                <h2>Buying</h2>
              </div>
              <p>{buyingTransactions.length} transactions</p>
            </div>

            {buyingTransactions.length === 0 ? (
              <div className="transactions-empty-state">
                <div className="transactions-empty-visual">🛍️</div>
                <h3>No purchases yet</h3>
                <p>You have not placed any offers yet. Browse the marketplace when you are ready to acquire a listing.</p>
              </div>
            ) : (
              <div className="transactions-cards-grid">
                {buyingTransactions.map((tx) => (
                  <article key={tx.id} className="transactions-card">
                    <div className="transactions-card-top">
                      <span className="transactions-platform-pill">{tx.platform}</span>
                      <span
                        className="transactions-status-pill"
                        style={{
                          backgroundColor: `${getStatusColor(tx.status)}20`,
                          color: getStatusColor(tx.status),
                        }}
                      >
                        {tx.status}
                      </span>
                    </div>

                    <div className="transactions-card-title-row">
                      <div>
                        <h3>{tx.username}</h3>
                        <p>Seller: {tx.first_name} {tx.last_name}</p>
                      </div>
                      <div className="transactions-price-chip">
                        <strong>${tx.amount}</strong>
                        <span>Your offer</span>
                      </div>
                    </div>

                    <div className="transactions-metric-grid">
                      <div className="transactions-metric-card">
                        <span>Role</span>
                        <strong>Buyer</strong>
                      </div>
                      <div className="transactions-metric-card">
                        <span>Status</span>
                        <strong>{tx.status}</strong>
                      </div>
                      <div className="transactions-metric-card">
                        <span>Listing</span>
                        <strong>{tx.platform}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="transactions-panel">
            <div className="transactions-panel-header">
              <div>
                <span className="transactions-results-label">Seller Activity</span>
                <h2>Selling</h2>
              </div>
              <p>{sellingTransactions.length} transactions</p>
            </div>

            {sellingTransactions.length === 0 ? (
              <div className="transactions-empty-state">
                <div className="transactions-empty-visual">📬</div>
                <h3>No offers yet</h3>
                <p>Your listings have not received offers yet. Keep pricing and description sharp to attract buyers.</p>
              </div>
            ) : (
              <div className="transactions-cards-grid">
                {sellingTransactions.map((tx) => (
                  <article key={tx.id} className="transactions-card">
                    <div className="transactions-card-top">
                      <span className="transactions-platform-pill">{tx.platform}</span>
                      <span
                        className="transactions-status-pill"
                        style={{
                          backgroundColor: `${getStatusColor(tx.status)}20`,
                          color: getStatusColor(tx.status),
                        }}
                      >
                        {tx.status}
                      </span>
                    </div>

                    <div className="transactions-card-title-row">
                      <div>
                        <h3>{tx.username}</h3>
                        <p>Offer received on your listing</p>
                      </div>
                      <div className="transactions-price-chip">
                        <strong>${tx.amount}</strong>
                        <span>Offer amount</span>
                      </div>
                    </div>

                    <div className="transactions-metric-grid">
                      <div className="transactions-metric-card">
                        <span>Role</span>
                        <strong>Seller</strong>
                      </div>
                      <div className="transactions-metric-card">
                        <span>Status</span>
                        <strong>{tx.status}</strong>
                      </div>
                      <div className="transactions-metric-card">
                        <span>Listing</span>
                        <strong>{tx.platform}</strong>
                      </div>
                    </div>

                    {tx.status === 'pending' && (
                      <div className="transactions-actions">
                        <button
                          onClick={() => handleStatusChange(tx.id, 'accepted')}
                          className="btn transactions-accept-btn"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(tx.id, 'rejected')}
                          className="btn transactions-reject-btn"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Transactions;
