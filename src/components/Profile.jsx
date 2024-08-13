import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Helmet } from 'react-helmet-async';
import './Profile.css'; 
import loadingGif from '../assets/dona-loading.gif'; 

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
        setError('Error al cargar tus entradas. Vuelve a intentarlo más tarde.');
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
    <>
  <Helmet>
    <title>Perfil de usuario | PinPals</title>
  </Helmet>
    <div className="container">
      <h1></h1>
      <div className="profile-card">
        <div className="profile-image">
          {userProfile.image && <img src={getImageUrl(userProfile.image)} alt="Profile" />}
        </div>
        <div className="profile-details">
          <p><strong>User ID:</strong> {userProfile.user__id}</p>
          <p><strong>Username:</strong> {userProfile.username}</p>
          <p><strong>Nombre:</strong> {userProfile.first_name}</p>
          <p><strong>Apellido:</strong> {userProfile.last_name}</p>
          <p><strong>Email:</strong> {userProfile.email}</p>
          {editMode ? (
            <form onSubmit={handleEditProfile} className="form">
              <div className="field">
                <label className="label" htmlFor="bio"><strong>Algo sobre vos:</strong></label>
                <div className="control">
                  <textarea
                    className="textarea"
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="dob"><strong>Fecha de nacimiento:</strong></label>
                <div className="control">
                  <input
                    className="input"
                    type="date"
                    id="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="image"><strong>Imagen de perfil:</strong></label>
                <div className="control">
                  <input
                    className="input"
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="field is-grouped">
                <div className="control">
                  <button type="submit" className="button is-success is-dark">Guardar cambios</button>
                </div>
                <div className="control">
                  <button type="button" className="button is-danger is-dark" onClick={() => setEditMode(false)}>Cancelar</button>
                </div>
              </div>
            </form>
          ) : (
            <>
              {userProfile.bio && <p><strong>Bio:</strong> {userProfile.bio}</p>}
              {userProfile.dob && <p><strong>Fecha de nacimiento:</strong> {userProfile.dob}</p>}
              <button className="button is-link is-dark edit-profile-button" onClick={() => setEditMode(true)}>Editar perfil</button>
            </>
          )}
        </div>
      </div>
      <h2 className="my-entries-title">Mis entradas</h2>
      {loading && <img src={loadingGif} alt="Cargando..." className="loading-gif" />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && articles.length === 0 && <p>No articles found.</p>}
      <table className="article-list-table">
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Resumen</th>
            <th>Fecha</th>
            <th>Acción</th>
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
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
   </>
  );
};


export default Profile;
