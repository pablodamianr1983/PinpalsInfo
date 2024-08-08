import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ArticleCard = ({ article, onDelete, authorProfile, index }) => {
  const { isAuthenticated, token, userProfile } = useAuth();
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setError('');
    try {
      const response = await api.delete(`/infosphere/articles/${article.id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.status === 204) {
        onDelete(article.id);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Article not found.');
        } else if (error.response.status === 403) {
          setError('You do not have permission to delete this article.');
        } else {
          setError(`Failed to delete article: ${error.response.status} ${error.response.statusText}`);
        }
      } else {
        setError('Failed to delete article. Please try again later.');
      }
    }
  };

  return (
    <div className={`card article-card ${index < 2 ? 'large-card' : 'small-card'}`} style={{ backgroundImage: `url(${article.image})` }}>
      <div className="overlay"></div> {/* Oscurecimiento de fondo */}
      <div className="content">
        <h2>{article.title}</h2>
        <p>{article.abstract}</p>
        {isAuthenticated && (
          <>
            <p><strong>Author:</strong> {authorProfile ? `${authorProfile.first_name} ${authorProfile.last_name}` : 'Unknown'}</p>
            <p><strong>Created on:</strong> {new Date(article.created_at).toLocaleDateString()}</p>
            <p><strong>Categories:</strong> {article.categories.join(', ')}</p>
          </>
        )}
        {isAuthenticated ? (
          <Link to={`/articles/${article.id}`} style={{ color: '#bb86fc' }}>Read more</Link>
        ) : (
          <span style={{ color: '#888' }}>Read more (Login required)</span>
        )}
        {isAuthenticated && article.author === userProfile.user__id && (
          <button onClick={handleDelete} className="delete-button">Delete</button>
        )}
        {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      </div>
    </div>
  );
};

export default ArticleCard;
