import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './EditArticle.css'; // Importa los estilos personalizados

const EditArticle = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/infosphere/articles/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const article = response.data;
        setTitle(article.title);
        setAbstract(article.abstract);
        setContent(article.content);
      } catch (err) {
        setError('Failed to fetch article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.put(`/infosphere/articles/${id}/`, {
        title,
        abstract,
        content,
      }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      navigate('/profile');
    } catch (err) {
      setError('Failed to update article. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h1>Edit Article</h1>
      {loading && <p className="loading-message">Loading article...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <form onSubmit={handleSubmit} className="card">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Abstract"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
          ></textarea>
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
          <button type="submit">Update</button>
        </form>
      )}
    </div>
  );
};

export default EditArticle;
