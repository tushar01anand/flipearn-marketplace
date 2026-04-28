import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const displayName = user?.firstName || user?.first_name || user?.email;
  const totalFollowers = listings.reduce((sum, listing) => sum + (Number(listing.followers) || 0), 0);
  const averageAskingPrice = listings.length > 0
    ? Math.round(listings.reduce((sum, listing) => sum + (Number(listing.asking_price) || 0), 0) / listings.length)
    : 0;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserListings();
  }, [user, navigate]);

  const fetchUserListings = async () => {
    try {
      const response = await api.get('/listings');
      const userListings = response.data.filter(listing => listing.seller_id === user.id);
      setListings(userListings);
    } catch (error) {
      console.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await api.delete(`/listings/${id}`);
        setListings(listings.filter(l => l.id !== id));
      } catch (error) {
        alert('Failed to delete listing');
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-state">
        <div className="dashboard-state-card">
          <div className="dashboard-spinner" />
          <h2>Loading your dashboard</h2>
          <p>Gathering your listings, seller stats, and account overview.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero-bg" aria-hidden="true">
          <span>📊</span>
          <span>💼</span>
          <span>📈</span>
          <span>⭐</span>
          <span>💬</span>
          <span>🎯</span>
        </div>
        <div className="container dashboard-hero-inner">
          <div className="dashboard-hero-copy">
            <span className="dashboard-kicker">Seller Dashboard</span>
            <h1>Welcome back, {displayName}</h1>
            <p>
              Track your live listings, monitor pricing health, and keep your
              creator assets ready for serious buyers.
            </p>

            <div className="dashboard-hero-actions">
              <Link to="/create-listing" className="btn dashboard-primary-btn">
                + Create New Listing
              </Link>
              <Link to="/marketplace" className="btn dashboard-secondary-btn">
                View Marketplace
              </Link>
            </div>
          </div>

          <div className="dashboard-highlight-card">
            <span className="dashboard-card-badge">At a Glance</span>
            <h2>Your seller pulse</h2>
            <div className="dashboard-highlight-grid">
              <div>
                <strong>{listings.length}</strong>
                <span>Active listings</span>
              </div>
              <div>
                <strong>${averageAskingPrice.toLocaleString()}</strong>
                <span>Avg. ask price</span>
              </div>
              <div>
                <strong>{totalFollowers.toLocaleString()}</strong>
                <span>Total followers listed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-summary-section">
        <div className="container">
          <div className="dashboard-summary-grid">
            <div className="dashboard-summary-card">
              <span>Active Listings</span>
              <strong>{listings.length}</strong>
              <p>Listings currently visible to buyers in the marketplace.</p>
            </div>
            <div className="dashboard-summary-card">
              <span>Account Type</span>
              <strong className="dashboard-summary-text">{user?.userType || 'both'}</strong>
              <p>Your current marketplace role and seller access level.</p>
            </div>
            <div className="dashboard-summary-card">
              <span>Total Audience</span>
              <strong>{totalFollowers.toLocaleString()}</strong>
              <p>Combined follower count across all active listed assets.</p>
            </div>
            <div className="dashboard-summary-card">
              <span>Pricing Average</span>
              <strong>${averageAskingPrice.toLocaleString()}</strong>
              <p>Average asking price across your current live listings.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-listings-section">
        <div className="container">
          <div className="dashboard-listings-header">
            <div>
              <span className="dashboard-results-label">Listing Management</span>
              <h2>My Listings</h2>
            </div>
            <p>
              Review pricing, audience size, and status before opening listing
              details or removing an asset from the marketplace.
            </p>
          </div>

          {listings.length === 0 ? (
            <div className="dashboard-empty-state">
              <div className="dashboard-empty-visual">🗂️</div>
              <h3>You haven&apos;t created any listings yet</h3>
              <p>
                Start with your best-performing asset and give buyers a clear
                view of its audience, category, and asking price.
              </p>
              <Link to="/create-listing" className="btn dashboard-primary-btn">
                Create Your First Listing
              </Link>
            </div>
          ) : (
            <div className="dashboard-listings-grid">
              {listings.map((listing) => (
                <article key={listing.id} className="dashboard-listing-card">
                  <div className="dashboard-listing-top">
                    <span className="dashboard-platform-pill">{listing.platform}</span>
                    <span className="dashboard-status-pill">Active</span>
                  </div>

                  <div className="dashboard-listing-title-row">
                    <div>
                      <h3>{listing.username}</h3>
                      <p>{listing.category || 'General'} creator asset</p>
                    </div>
                    <div className="dashboard-price-chip">
                      <strong>${listing.asking_price}</strong>
                      <span>Asking</span>
                    </div>
                  </div>

                  <div className="dashboard-metric-grid">
                    <div className="dashboard-metric-card">
                      <span>Followers</span>
                      <strong>{listing.followers?.toLocaleString() || '0'}</strong>
                    </div>
                    <div className="dashboard-metric-card">
                      <span>Engagement</span>
                      <strong>{listing.engagement_rate || 0}%</strong>
                    </div>
                    <div className="dashboard-metric-card">
                      <span>Platform</span>
                      <strong>{listing.platform}</strong>
                    </div>
                  </div>

                  <div className="dashboard-listing-actions">
                    <Link to={`/listing/${listing.id}`} className="btn dashboard-view-btn">
                      View Listing
                    </Link>
                    <button
                      onClick={() => deleteListing(listing.id)}
                      className="btn dashboard-delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
