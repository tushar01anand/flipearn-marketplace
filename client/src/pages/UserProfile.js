import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const allListings = await api.get('/listings');
      const userListings = allListings.data.filter(l => l.seller_id === parseInt(userId));
      setListings(userListings);

      const reviewsData = await api.get(`/reviews/user/${userId}`);
      setReviews(reviewsData.data);

      if (userListings.length > 0) {
        setUser(userListings[0]);
      }
    } catch (error) {
      console.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div style={{ padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#f5f5f5', padding: '30px', borderRadius: '8px', marginBottom: '40px' }}>
          <h1>{user?.first_name} {user?.last_name}</h1>
          <p><strong>Listings:</strong> {listings.length}</p>
          <p><strong>Average Rating:</strong> {avgRating} ⭐ ({reviews.length} reviews)</p>
          <p><strong>Bio:</strong> {user?.bio || 'No bio yet'}</p>
        </div>

        <h2>Listings ({listings.length})</h2>
        {listings.length === 0 ? (
          <p>No listings yet</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {listings.map(listing => (
              <div key={listing.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
                <h3>{listing.username}</h3>
                <p><strong>Platform:</strong> {listing.platform}</p>
                <p><strong>Price:</strong> ${listing.asking_price}</p>
              </div>
            ))}
          </div>
        )}

        <h2>Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {reviews.map(review => (
              <div key={review.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#f9f9f9' }}>
                <p><strong>{review.first_name} {review.last_name}</strong> - {review.rating} ⭐</p>
                <p>{review.comment}</p>
                <small style={{ color: '#666' }}>
                  {new Date(review.created_at).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;