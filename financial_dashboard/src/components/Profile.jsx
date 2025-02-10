import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../features/profileSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const { name, email, loading, error } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: name,
    email: email,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData))
      .unwrap()
      .then(() => {
        alert('Profile updated successfully!');
        navigate('/dashboard'); // Redirect to dashboard after update
      })
      .catch(() => {});
  };

  return (
    <div>
      <h1>Profile Settings</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;