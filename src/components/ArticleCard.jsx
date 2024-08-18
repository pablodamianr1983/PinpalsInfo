import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faTags, faEdit } from '@fortawesome/free-solid-svg-icons';
import './ArticleCard.css';

const ArticleCard = ({ article, onDelete, authorProfile }) => {
  const { isAuthenticated, token, userProfile } = useAuth();
  const [error, setError] = useState('');

  const handleDelete = async () => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este artículo?");
    if (!confirmed) {
      return; // Si el usuario cancela, no hacer nada
    }

    setError('');
    try {
      const response = await api.delete(`/infosphere/articles/${article.id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.status === 204) {
        onDelete(article.id); // Actualiza la lista de artículos en el componente padre
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
          <span style={{ color: '#f8db27' }}>Iniciar sesión para leer</span>
        )}
        {isAuthenticated && article.author === userProfile.user__id && (
          <div className="action-buttons">
            <Link to={`/edit-article/${article.id}`} className="button is-danger is-dark action-button">
              <FontAwesomeIcon icon={faEdit} /> Editar
            </Link>
            <button onClick={handleDelete} className="button is-danger is-dark action-button">Eliminar</button>
          </div>
        )}
        {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      </div>
    </div>
  );
};

export default ArticleCard;
