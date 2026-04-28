import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function DisputeForm({ transactionId, onClose }) {
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/protection/dispute', {
        transactionId,
        reason,
        evidence
      }, {
        headers: { 'x-user-id': user.id }
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to file dispute');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#d1fae5', borderRadius: '12px', border: '2px solid #10b981' }}>
        <p style={{ fontSize: '20px', fontWeight: '700', color: '#065f46', marginBottom: '8px' }}>✓ Dispute Filed Successfully</p>
        <p style={{ color: '#047857', fontSize: '14px' }}>Our team will review your case within 24 hours</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff5f5', padding: '24px', borderRadius: '12px', border: '2px solid #fed7d7' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#742a2a' }}>Report an Issue</h3>
      <p style={{ color: '#744210', fontSize: '14px', marginBottom: '20px' }}>Help us keep the platform safe by reporting any issues with this transaction</p>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', borderLeft: '4px solid #dc2626' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>What's the issue? *</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            style={{ cursor: 'pointer' }}
          >
            <option value="">Select a reason</option>
            <option value="account_not_transferred">Account was not transferred</option>
            <option value="wrong_account">Wrong or fake account provided</option>
            <option value="missing_access">Missing account access/credentials</option>
            <option value="account_recovered">Seller recovered the account</option>
            <option value="other">Other issue</option>
          </select>
        </div>

        <div className="form-group">
          <label>Describe what happened *</label>
          <textarea
            placeholder="Provide details about the issue..."
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            required
            style={{ minHeight: '100px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-danger"
            style={{ padding: '12px' }}
          >
            {loading ? 'Filing...' : 'File Dispute'}
          </button>
          <button 
            type="button" 
            onClick={onClose}
            className="btn"
            style={{ backgroundColor: '#6b7280', color: 'white', padding: '12px' }}
          >
            Cancel
          </button>
        </div>
      </form>

      <p style={{ fontSize: '12px', color: '#744210', marginTop: '16px' }}>
        ⚠️ Filing a false dispute may result in account suspension
      </p>
    </div>
  );
}

export default DisputeForm;