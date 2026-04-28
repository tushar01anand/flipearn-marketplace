import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function AdminDisputes() {
  const { user } = useContext(AuthContext);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [resolution, setResolution] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userType !== 'admin') {
      navigate('/');
      return;
    }
    fetchDisputes();
  }, [user, navigate]);

  const fetchDisputes = async () => {
    try {
      const response = await api.get('/protection/disputes/admin', {
        headers: { 'x-user-id': user.id }
      });
      setDisputes(response.data);
    } catch (error) {
      console.error('Failed to fetch disputes');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDispute = async (e) => {
    e.preventDefault();
    if (!selectedDispute) return;

    setSubmitting(true);
    try {
      await api.put(`/protection/disputes/${selectedDispute.id}/resolve`, {
        adminResponse,
        resolution
      }, {
        headers: { 'x-user-id': user.id }
      });

      alert('Dispute resolved successfully!');
      setSelectedDispute(null);
      setAdminResponse('');
      setResolution('');
      fetchDisputes();
    } catch (error) {
      alert('Failed to resolve dispute');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#f59e0b';
      case 'resolved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const openDisputes = disputes.filter((d) => d.status === 'open');
  const resolvedDisputes = disputes.filter((d) => d.status === 'resolved');
  const selectedDisputeAmount = selectedDispute?.amount ? `$${selectedDispute.amount}` : '$0';

  if (loading) {
    return (
      <div className="admin-disputes-state">
        <div className="admin-disputes-state-card">
          <div className="admin-disputes-spinner" />
          <h2>Loading dispute queue</h2>
          <p>Pulling active cases, evidence, and prior resolutions for admin review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-disputes-page">
      <section className="admin-disputes-hero">
        <div className="admin-disputes-hero-bg" aria-hidden="true">
          <span>⚖️</span>
          <span>🛡️</span>
          <span>🧾</span>
          <span>💬</span>
          <span>📋</span>
          <span>🔍</span>
        </div>
        <div className="container admin-disputes-hero-inner">
          <div className="admin-disputes-hero-copy">
            <span className="admin-disputes-kicker">Resolution Desk</span>
            <h1>Review disputes and close cases with clear reasoning</h1>
            <p>
              Keep the marketplace fair by reviewing evidence, choosing a
              resolution, and documenting each admin decision in one place.
            </p>
          </div>

          <div className="admin-disputes-highlight-card">
            <span className="admin-disputes-card-badge">Queue Snapshot</span>
            <h2>Case status</h2>
            <div className="admin-disputes-highlight-grid">
              <div>
                <strong>{openDisputes.length}</strong>
                <span>Open disputes</span>
              </div>
              <div>
                <strong>{resolvedDisputes.length}</strong>
                <span>Resolved cases</span>
              </div>
              <div>
                <strong>{disputes.length}</strong>
                <span>Total recorded</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-disputes-summary-section">
        <div className="container">
          <div className="admin-disputes-summary-grid">
            <div className="admin-disputes-summary-card">
              <span>Open Disputes</span>
              <strong>{openDisputes.length}</strong>
              <p>Cases still waiting for a final review decision.</p>
            </div>
            <div className="admin-disputes-summary-card">
              <span>Resolved</span>
              <strong>{resolvedDisputes.length}</strong>
              <p>Disputes already closed with a recorded outcome.</p>
            </div>
            <div className="admin-disputes-summary-card">
              <span>Total Cases</span>
              <strong>{disputes.length}</strong>
              <p>All disputes currently available in the admin queue.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-disputes-workspace">
        <div className="container">
          <div className="admin-disputes-workspace-grid">
            <div className="admin-disputes-queue">
              <div className="admin-disputes-section-header">
                <div>
                  <span className="admin-disputes-results-label">Active Queue</span>
                  <h2>Open Disputes</h2>
                </div>
                <p>{openDisputes.length} unresolved cases</p>
              </div>

              {openDisputes.length === 0 ? (
                <div className="admin-disputes-empty-state">
                  <div className="admin-disputes-empty-visual">✅</div>
                  <h3>No open disputes</h3>
                  <p>There are no active cases in the queue right now.</p>
                </div>
              ) : (
                <div className="admin-disputes-list">
                  {openDisputes.map((dispute) => (
                    <button
                      key={dispute.id}
                      type="button"
                      className={`admin-disputes-list-item${selectedDispute?.id === dispute.id ? ' active' : ''}`}
                      onClick={() => setSelectedDispute(dispute)}
                    >
                      <div className="admin-disputes-item-top">
                        <h3>Transaction #{dispute.transaction_id}</h3>
                        <span
                          className="admin-disputes-status-pill"
                          style={{
                            backgroundColor: `${getStatusColor(dispute.status)}20`,
                            color: getStatusColor(dispute.status),
                          }}
                        >
                          {dispute.status}
                        </span>
                      </div>
                      <div className="admin-disputes-item-grid">
                        <div>
                          <span>Account</span>
                          <strong>@{dispute.username}</strong>
                        </div>
                        <div>
                          <span>Amount</span>
                          <strong>${dispute.amount}</strong>
                        </div>
                      </div>
                      <p><strong>Reason:</strong> {dispute.reason}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-disputes-resolution">
              <div className="admin-disputes-section-header">
                <div>
                  <span className="admin-disputes-results-label">Resolution Panel</span>
                  <h2>Resolve Dispute</h2>
                </div>
                <p>{selectedDispute ? `Case #${selectedDispute.id}` : 'Select a case'}</p>
              </div>

              {selectedDispute ? (
                <div className="admin-disputes-resolution-card">
                  <div className="admin-disputes-resolution-top">
                    <div>
                      <span className="admin-disputes-card-badge admin-disputes-card-badge-light">Case Details</span>
                      <h3>Transaction #{selectedDispute.transaction_id}</h3>
                    </div>
                    <div className="admin-disputes-amount-chip">
                      <strong>{selectedDisputeAmount}</strong>
                      <span>Case amount</span>
                    </div>
                  </div>

                  <div className="admin-disputes-detail-grid">
                    <div className="admin-disputes-detail-card">
                      <span>Account</span>
                      <strong>@{selectedDispute.username}</strong>
                    </div>
                    <div className="admin-disputes-detail-card">
                      <span>Status</span>
                      <strong>{selectedDispute.status}</strong>
                    </div>
                    <div className="admin-disputes-detail-card admin-disputes-detail-card-wide">
                      <span>Reason</span>
                      <strong>{selectedDispute.reason}</strong>
                    </div>
                  </div>

                  <div className="admin-disputes-evidence-card">
                    <span>Evidence</span>
                    <p>{selectedDispute.evidence || 'No additional evidence'}</p>
                  </div>

                  <form onSubmit={handleResolveDispute} className="admin-disputes-form">
                    <div className="form-group">
                      <label>Resolution *</label>
                      <select
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        required
                      >
                        <option value="">Select resolution</option>
                        <option value="refund_buyer">Refund Buyer</option>
                        <option value="confirm_seller">Confirm Seller</option>
                        <option value="partial_refund">Partial Refund</option>
                        <option value="reject_dispute">Reject Dispute</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Admin Response *</label>
                      <textarea
                        placeholder="Explain the decision..."
                        value={adminResponse}
                        onChange={(e) => setAdminResponse(e.target.value)}
                        required
                        className="admin-disputes-textarea"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn admin-disputes-submit-btn"
                    >
                      {submitting ? 'Resolving...' : 'Resolve Dispute'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="admin-disputes-placeholder">
                  <div className="admin-disputes-empty-visual">📂</div>
                  <h3>Select a dispute to review</h3>
                  <p>Choose a case from the queue to inspect evidence and submit a final resolution.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {resolvedDisputes.length > 0 && (
        <section className="admin-disputes-history">
          <div className="container">
            <div className="admin-disputes-section-header">
              <div>
                <span className="admin-disputes-results-label">Case History</span>
                <h2>Resolved Disputes</h2>
              </div>
              <p>{resolvedDisputes.length} resolved cases</p>
            </div>

            <div className="admin-disputes-history-list">
              {resolvedDisputes.map((dispute) => (
                <div key={dispute.id} className="admin-disputes-history-card">
                  <div className="admin-disputes-history-top">
                    <div>
                      <h3>Transaction #{dispute.transaction_id}</h3>
                      <p>
                        <strong>Resolution:</strong> {dispute.resolution?.replace(/_/g, ' ').toUpperCase()}
                      </p>
                    </div>
                    <span className="admin-disputes-history-pill">
                      Resolved
                    </span>
                  </div>
                  <p><strong>Response:</strong> {dispute.admin_response}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminDisputes;
