import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importa los estilos de Quill

const CreateArticle = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/infosphere/categories/');
        if (Array.isArray(response.data.results)) {
          setCategories(response.data.results);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();

    if (id) {
      const fetchArticle = async () => {
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
          setSelectedCategories(article.categories);
          setImage(article.image); // imagen del articulo
        } catch (error) {
          console.error('Failed to fetch article:', error);
          setError('Failed to fetch article. Please try again later.');
        }
      };
      fetchArticle();
    }
  }, [id, token]);

  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedCategories(selected);
  };

  const handleAddCategory = async () => {
    setCategoryError('');
    if (!newCategory) return;

    try {
      const response = await api.post('/infosphere/categories/', { name: newCategory }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setCategories([...categories, response.data]);
      setSelectedCategories([...selectedCategories, response.data.id]);
      setNewCategory('');
    } catch (error) {
      console.error('Failed to add category:', error);
      setCategoryError('Failed to add category. Please try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('abstract', abstract);
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      let response;
      if (id) {
        // actualizar articulo
        response = await api.put(`/infosphere/articles/${id}/`, formData, {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        const existingCategories = await api.get(`/infosphere/articles/${id}/categories/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        await Promise.all(existingCategories.data.results.map(async category => {
          await api.delete(`/infosphere/articles/${id}/categories/${category.id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
        }));

        // asigna categoria al articulo
        await Promise.all(selectedCategories.map(async categoryId => {
          await api.post(`/infosphere/articles/${id}/categories/`, { category: categoryId }, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
        }));
      } else {
        // nuevo articulo
        response = await api.post('/infosphere/articles/', formData, {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        const articleId = response.data.id;

        // asigna categoria al articulo nuevo
        await Promise.all(selectedCategories.map(async categoryId => {
          await api.post(`/infosphere/articles/${articleId}/categories/`, { category: categoryId }, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
        }));

        navigate(`/articles/${articleId}`);
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      setError('Failed to save article. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h1 style={{ color: '#bb86fc' }}>{id ? 'Edit Article' : 'Create Article'}</h1>
      <form onSubmit={handleSubmit} className="card">
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          id="abstract"
          name="abstract"
          placeholder="Abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
        ></textarea>
        <ReactQuill
          value={content}
          onChange={setContent}
          placeholder="Content"
          theme="snow"
          required
        />
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <select multiple id="categories" name="categories" value={selectedCategories} onChange={handleCategoryChange}>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div>
          <input
            id="new-category"
            name="new-category"
            type="text"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button type="button" onClick={handleAddCategory}>Add Category</button>
          {categoryError && <div style={{ color: 'red' }}>{categoryError}</div>}
        </div>
        <button type="submit">{id ? 'Update' : 'Create'}</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default CreateArticle;
