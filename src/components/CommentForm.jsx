import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './CommentForm.css';

const CommentForm = ({ articleId, onCommentAdded, commentToEdit, onEditComplete }) => {
  const [content, setContent] = useState(commentToEdit ? commentToEdit.content : '');
  const [error, setError] = useState('');
  const { token, userProfile } = useAuth();

  useEffect(() => {
    if (commentToEdit) {
      setContent(commentToEdit.content);
    }
  }, [commentToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (commentToEdit) {
        await api.patch(`/infosphere/comments/${commentToEdit.id}/`, { content }, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        onEditComplete(commentToEdit.id, content);
      } else {
        const response = await api.post('/infosphere/comments/', { content, article: articleId }, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        onCommentAdded({
          ...response.data,
          author: userProfile.user__id,
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          image: userProfile.image,
        });
      }
      setContent('');
    } catch (err) {
      console.error('Error adding/editing comment:', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication error. Please log in.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        id="comment-content"
        name="comment-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      ></textarea>
      <button type="submit">{commentToEdit ? 'Update Comment' : 'Comment'}</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default CommentForm;
