import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Profile.css';  // Importación del archivo CSS

const Profile = () => {
  const { userProfile, token, setUserProfile } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState(userProfile.bio || '');
  const [dob, setDob] = useState(userProfile.dob || '');
  const [image, setImage] = useState(null);

  const tokenRef = useRef(token);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    const fetchUserArticles = async () => {
      setLoading(true);
      setError('');
      try {
        let userArticles = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await api.get('/infosphere/articles/', {
            headers: {
              Authorization: `Token ${tokenRef.current}`,
            },
            params: {
              page,
              page_size: 100,
            },
          });

          const articlesData = response.data.results.filter(article => article.author === userProfile.user__id);
          userArticles = [...userArticles, ...articlesData];
          hasMore = !!response.data.next;
          page += 1;
        }

        // ordena por fecha de creación
        userArticles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setArticles(userArticles);
      } catch (err) {
        setError('Failed to fetch user articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserArticles();
  }, [userProfile.user__id]);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (bio) formData.append('bio', bio);
    if (dob) formData.append('dob', dob);
    if (image) formData.append('image', image);

    try {
      const response = await api.patch(`/users/profiles/${userProfile.user__id}/`, formData, {
        headers: {
          Authorization: `Token ${tokenRef.current}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const profileResponse = await api.get(`/users/profiles/${userProfile.user__id}/`, {
          headers: {
            Authorization: `Token ${tokenRef.current}`,
          },
        });

        const updatedProfile = profileResponse.data;
        setUserProfile(updatedProfile);
        setBio(updatedProfile.bio);
        setDob(updatedProfile.dob);
        setImage(null);
        setEditMode(false);
        setError('');
      } else {
        setError(`Failed to update profile. Response status: ${response.status}`);
      }
    } catch (err) {
      if (err.response) {
        setError(`Failed to update profile. Response status: ${err.response.status}, message: ${err.response.data}`);
      } else {
        setError(`Failed to update profile. Error: ${err.message}`);
      }
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `https://sandbox.academiadevelopers.com${path}`;
  };

  return (
    <div className="container">
      <h1>Profile</h1>
      <div className="profile-card">
        <div className="profile-image">
          {userProfile.image && <img src={getImageUrl(userProfile.image)} alt="Profile" />}
        </div>
        <div className="profile-details">
          <p><strong>User ID:</strong> {userProfile.user__id}</p>
          <p><strong>Username:</strong> {userProfile.username}</p>
          <p><strong>First Name:</strong> {userProfile.first_name}</p>
          <p><strong>Last Name:</strong> {userProfile.last_name}</p>
          <p><strong>Email:</strong> {userProfile.email}</p>
          {editMode ? (
            <form onSubmit={handleEditProfile}>
              <div>
                <label htmlFor="bio"><strong>Bio:</strong></label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label htmlFor="dob"><strong>Date of Birth:</strong></label>
                <input
                  type="date"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="image"><strong>Profile Image:</strong></label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
            </form>
          ) : (
            <>
              {userProfile.bio && <p><strong>Bio:</strong> {userProfile.bio}</p>}
              {userProfile.dob && <p><strong>Birth Date:</strong> {userProfile.dob}</p>}
              <button onClick={() => setEditMode(true)}>Edit Profile</button>
            </>
          )}
        </div>
      </div>
      <h2>My Articles</h2>
      {loading && <p>Loading articles...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && articles.length === 0 && <p>No articles found.</p>}
      <table className="article-list-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Abstract</th>
            <th>Created On</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {!loading && !error && articles.map(article => (
            <tr key={article.id}>
              <td>{article.title}</td>
              <td>{article.abstract}</td>
              <td>{new Date(article.created_at).toLocaleDateString()}</td>
              <td>
                <Link to={`/edit-article/${article.id}`}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
