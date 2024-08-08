import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CommentForm from '../components/CommentForm';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [error, setError] = useState('');
  const [commentToEdit, setCommentToEdit] = useState(null);
  const { token, userProfile } = useAuth();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/infosphere/articles/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setArticle(response.data);
        fetchUserProfile(response.data.author);
      } catch (err) {
        console.error('Failed to fetch article:', err);
        setError('Failed to fetch article. Please try again later.');
      }
    };

    const fetchComments = async () => {
      try {
        const response = await api.get('/infosphere/comments/', {
          headers: {
            Authorization: `Token ${token}`,
          },
          params: { article: id },
        });
        setComments(response.data.results);
        fetchUserProfiles(response.data.results);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
        setError('Failed to fetch comments. Please try again later.');
      }
    };

    const fetchUserProfiles = async (comments) => {
      try {
        const userIds = comments.map(comment => comment.author);
        const uniqueUserIds = [...new Set(userIds)];

        const userProfilesPromises = uniqueUserIds.map(userId =>
          api.get(`/users/profiles/${userId}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          })
        );

        const profiles = await Promise.all(userProfilesPromises);

        const profilesMap = profiles.reduce((acc, profile) => {
          acc[profile.data.user__id] = profile.data;
          return acc;
        }, {});

        setUserProfiles(profilesMap);
      } catch (err) {
        console.error('Failed to fetch user profiles:', err);
        setError('Failed to fetch user profiles. Please try again later.');
      }
    };

    const fetchUserProfile = async (userId) => {
      try {
        const response = await api.get(`/users/profiles/${userId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setUserProfiles(prevProfiles => ({
          ...prevProfiles,
          [response.data.user__id]: response.data,
        }));
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Failed to fetch user profile. Please try again later.');
      }
    };

    fetchArticle();
    fetchComments();
  }, [id, token]);

  const handleCommentAdded = (comment) => {
    setComments([...comments, comment]);
  };

  const handleEditComplete = (commentId, content) => {
    setComments(comments.map(comment => 
      comment.id === commentId ? { ...comment, content } : comment
    ));
    setCommentToEdit(null);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/infosphere/comments/${commentId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleEditComment = (comment) => {
    setCommentToEdit(comment);
  };

  const getAuthorName = (authorId) => {
    const user = userProfiles[authorId];
    return user ? `${user.first_name} ${user.last_name}` : `Unknown user (ID: ${authorId})`;
  };

  const getAuthorImage = (authorId) => {
    const user = userProfiles[authorId];
    return user ? user.image : null;
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `https://sandbox.academiadevelopers.com${path}`;
  };

  if (!article) return <div>Loading...</div>;

  return (
    <div className="article-container">
      <div
        className="article-title"
        style={{ backgroundImage: `url(${article.image})` }}
      >
        <div className="overlay"></div>
        <h1>{article.title}</h1>
      </div>
      <div className="article-details">
        <span className="article-meta">Author: {getAuthorName(article.author)}</span>
        <span className="article-meta">Created at: {new Date(article.created_at).toLocaleDateString()}</span>
      </div>
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <CommentForm
        articleId={id}
        onCommentAdded={handleCommentAdded}
        commentToEdit={commentToEdit}
        onEditComplete={handleEditComplete}
      />
      <div>
        {comments.map(comment => (
          <div key={comment.id} style={{ marginBottom: '1rem', padding: '0.5rem', background: '#2c2c2c', borderRadius: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {getAuthorImage(comment.author) && (
                <img
                  src={getImageUrl(getAuthorImage(comment.author))}
                  alt="Profile"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '0.5rem' }}
                />
              )}
              <p><strong>{getAuthorName(comment.author)}</strong>: {comment.content}</p>
            </div>
            {comment.reaction && (
              <p><strong>Reaction:</strong> {comment.reaction}</p>
            )}
            {comment.author === userProfile.user__id && (
              <>
                <button onClick={() => handleEditComment(comment)} className="edit-button">Edit</button>
                <button onClick={() => handleDeleteComment(comment.id)} className="delete-button">Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleDetail;
