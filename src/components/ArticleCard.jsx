import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faTags } from '@fortawesome/free-solid-svg-icons';
import './ArticleCard.css';

const ArticleCard = ({ article, onDelete, authorProfile }) => {
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
    <div className="card article-card" style={{ backgroundImage: `url(${article.image})` }}>
      <div className="overlay"></div>
      <div className="content">
        <h2>{article.title}</h2>
        <p>{article.abstract}</p>
        {isAuthenticated && (
          <>
            <p className="meta-info">
              <FontAwesomeIcon icon={faUser} /> {authorProfile ? `${authorProfile.first_name} ${authorProfile.last_name}` : 'Unknown'}
            </p>
            <p className="meta-info">
              <FontAwesomeIcon icon={faCalendarAlt} /> {new Date(article.created_at).toLocaleDateString()}
            </p>
            <p className="meta-info">
              <FontAwesomeIcon icon={faTags} /> {article.categories.join(', ')}
            </p>
          </>
        )}
        {isAuthenticated ? (
          <Link to={`/articles/${article.id}`} style={{ color: '#f8db27' }}>Leer más</Link>
        ) : (
          <span style={{ color: '#888' }}>Leer más (Login required)</span>
        )}
        {isAuthenticated && article.author === userProfile.user__id && (
          <div className="delete-button-container">
            <button onClick={handleDelete} className="delete-button">Delete</button>
          </div>
        )}
        {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      </div>
    </div>
  );
};

export default ArticleCard;
