import React, { useState, useEffect } from 'react';
import './Profile.css';
import { API_URL } from './api';

const UserProfile = ({ userId, token, onAuthError }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // The old version had one hard-coded user id in the URL. Now the id
        // comes from the logged-in user's token, and the token is sent along.
        const response = await fetch(`${API_URL}/myInfo/${userId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401 || response.status === 403) {
          onAuthError(); // token expired/invalid -> log the user out
          return;
        }
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        setUserData(await response.json());
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, token, onAuthError]);

  if (loading) return <div className="loading">Loading user profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!userData) return null;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>{userData.user_name || 'Unknown User'}</h2>
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <h4>Name:</h4>
          <p>{userData.full_name || 'Unknown'}</p>
        </div>
        <div className="detail-item">
          <h4>Account Balance:</h4>
          {/* ?? (not ||) so a real balance of 0 shows as 0 instead of "N/A" */}
          <p>{userData.account_balance ?? 0}</p>
        </div>
        <div className="detail-item">
          <h4>Cash:</h4>
          <p>{userData.cash_amount ?? 0}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
