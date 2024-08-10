import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './EditArticle.css';

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
    <>
      <div className="title-section">
        <h1>Edit Article</h1>
      </div>
      
      {loading && (
        <div className="loading-section">
          <p className="loading-message">Loading article...</p>
        </div>
      )}
      
      {error && (
        <div className="error-section">
          <p className="error-message">{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <form onSubmit={handleSubmit} className="card">
          <div className="input-section">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="textarea-section">
            <textarea
              placeholder="Abstract"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
            ></textarea>
          </div>
          
          <div className="content-section">
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="submit-section">
            <button type="submit">Update</button>
          </div>
        </form>
      )}
    </>
  );
};

export default EditArticle;
