import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Estilos del editor
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
        <h1>Editar Entrada</h1>
      </div>
      
      {loading && (
        <div className="loading-section">
          <p className="loading-message">Cargando Entrada...</p>
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
              placeholder="Titulo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="textarea-section">
            <textarea
              placeholder="Resumen"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
            ></textarea>
          </div>
          
          <div className="content-section">
            <ReactQuill
              value={content}
              onChange={setContent}
              placeholder="Contenido"
              theme="snow"
              required
            />
          </div>
          
          <div className="submit-section">
            <button type="submit">Actualizar</button>
          </div>
        </form>
      )}
    </>
  );
};

export default EditArticle;
