import React, { useState, useEffect } from 'react';
import api from '../services/api';

function SellerTrustBadge({ sellerId }) {
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerInfo();
  }, [sellerId]);

  const fetchSellerInfo = async () => {
    try {
      const response = await api.get(`/protection/seller/${sellerId}`);
      setSellerInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch seller info');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ height: '100px' }} />;
  if (!sellerInfo) return null;

  const { seller, trustScore, badge } = sellerInfo;

  return (
    <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>Seller Trust</h3>
        <span style={{ backgroundColor: badge.color, color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
          {badge.label}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Trust Score</p>
          <p style={{ fontSize: '24px', fontWeight: '800', color: badge.color }}>{trustScore}%</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Rating</p>
          <p style={{ fontSize: '20px', fontWeight: '700', color: '#4f46e5' }}>
            {seller.average_rating > 0 ? `${seller.average_rating}⭐` : 'New'}
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Transactions</p>
          <p style={{ fontSize: '20px', fontWeight: '700', color: '#4f46e5' }}>{seller.total_transactions}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Status</p>
          <p style={{ fontSize: '14px', fontWeight: '600', color: seller.is_seller_verified ? '#10b981' : '#f59e0b' }}>
            {seller.is_seller_verified ? '✓ Verified' : 'Unverified'}
          </p>
        </div>
      </div>

      {trustScore < 75 && (
        <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b', borderRadius: '4px' }}>
          <p style={{ color: '#92400e', fontSize: '12px', margin: '0' }}>
            ⚠️ Take extra caution when dealing with unverified sellers
          </p>
        </div>
      )}
    </div>
  );
}

export default SellerTrustBadge;