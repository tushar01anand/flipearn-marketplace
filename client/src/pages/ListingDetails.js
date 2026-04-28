import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SellerTrustBadge from '../components/SellerTrustBadge';
import DisputeForm from '../components/DisputeForm';
import api from '../services/api';

function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await api.get(`/listings/${id}`);
      setListing(response.data);
    } catch (err) {
      setError('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/transactions', {
        listingId: parseInt(id),
        amount: parseFloat(offerAmount),
      }, {
        headers: { 'x-user-id': user.id }
      });

      alert('Offer made successfully!');
      setShowOfferForm(false);
      setOfferAmount('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to make offer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 20px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '80px 20px', color: '#dc2626' }}>{error}</div>;
  if (!listing) return <div style={{ textAlign: 'center', padding: '80px 20px' }}>Listing not found</div>;

  const isOwnListing = user && user.id === listing.seller_id;

  return (
    <div style={{ paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <button onClick={() => navigate('/marketplace')} className="btn" style={{ backgroundColor: '#6b7280', color: 'white', marginBottom: '30px' }}>
          ← Back to Marketplace
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          <div>
            <div style={{ backgroundColor: '#f3f4f6', padding: '24px', borderRadius: '12px', marginBottom: '30px' }}>
              <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                <span className="badge badge-success">{listing.platform}</span>
                <span className="badge badge-warning">Active</span>
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '20px', color: '#111827' }}>@{listing.username}</h1>
            </div>

            <div className="card" style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#111827' }}>Account Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Followers</p>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: '#4f46e5' }}>{listing.followers?.toLocaleString()}</p>
                </div>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Engagement Rate</p>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: '#4f46e5' }}>{listing.engagement_rate}%</p>
                </div>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Category</p>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>{listing.category}</p>
                </div>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Status</p>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>Active ✓</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>Description</h2>
              <p style={{ color: '#6b7280', lineHeight: '1.7', fontSize: '15px' }}>{listing.description}</p>
            </div>
          </div>

          <div>
            <div className="card" style={{ marginBottom: '30px', textAlign: 'center', backgroundColor: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
              <p style={{ color: '#d1d5db', fontSize: '14px', marginBottom: '8px' }}>Asking Price</p>
              <p style={{ fontSize: '48px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>${listing.asking_price}</p>
              <p style={{ color: '#d1d5db', fontSize: '14px' }}>Estimated Value: ${listing.estimated_value}</p>
            </div>

            <SellerTrustBadge sellerId={listing.seller_id} />

            <div className="card" style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>Seller Information</h3>
              <div style={{ paddingBottom: '16px', borderBottom: '1px solid #e5e7eb', marginBottom: '16px' }}>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Name</p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#4f46e5', cursor: 'pointer' }} onClick={() => navigate(`/user/${listing.seller_id}`)}>
                  {listing.first_name} {listing.last_name} →
                </p>
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Email</p>
                <p style={{ fontSize: '15px', color: '#111827' }}>{listing.email}</p>
              </div>
            </div>

            {!isOwnListing && (
              <>
                {!showOfferForm ? (
                  <button onClick={() => setShowOfferForm(true)} className="btn btn-success" style={{ width: '100%', padding: '16px', marginBottom: '12px' }}>
                    Make Offer
                  </button>
                ) : (
                  <form onSubmit={handleMakeOffer} className="card" style={{ backgroundColor: '#f0f9ff', borderColor: '#4f46e5', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>Make an Offer</h4>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                        Your Offer Amount
                      </label>
                      <input
                        type="number"
                        placeholder="Enter your offer"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        required
                        step="0.01"
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '15px' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button type="submit" disabled={submitting} className="btn btn-success" style={{ padding: '12px' }}>
                        {submitting ? 'Submitting...' : 'Submit Offer'}
                      </button>
                      <button type="button" onClick={() => setShowOfferForm(false)} className="btn" style={{ backgroundColor: '#6b7280', color: 'white', padding: '12px' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <button 
                  onClick={() => setShowDisputeForm(!showDisputeForm)}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginBottom: '20px' }}
                >
                  ⚠️ Report Issue
                </button>

                {showDisputeForm && (
                  <DisputeForm transactionId={null} onClose={() => setShowDisputeForm(false)} />
                )}
              </>
            )}

            {isOwnListing && (
              <div style={{ padding: '16px', backgroundColor: '#d1fae5', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                <p style={{ color: '#065f46', fontWeight: '600' }}>✓ This is your listing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetails;