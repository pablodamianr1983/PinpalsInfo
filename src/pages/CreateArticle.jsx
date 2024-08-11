import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // Importa Helmet
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreateArticle.css';

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
        const response = await api.get('/infosphere/categories/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (Array.isArray(response.data.results)) {
          setCategories(response.data.results);
        } else {
          console.error('Unexpected response format:', response.data);
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
          setSelectedCategories(article.categories.map(category => category.id));
          setImage(article.image);
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
      const newCat = response.data;
      setCategories((prevCategories) => [...prevCategories, newCat]);
      setSelectedCategories((prevSelectedCategories) => [...prevSelectedCategories, newCat.id]);
      setNewCategory('');
    } catch (error) {
      console.error('Failed to add category:', error);
      setCategoryError('Failed to add category. Please try again later.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await api.delete(`/infosphere/categories/${categoryId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setCategories((prevCategories) => prevCategories.filter(category => category.id !== categoryId));
      setSelectedCategories((prevSelectedCategories) => prevSelectedCategories.filter(id => id !== categoryId));
    } catch (error) {
      console.error('Failed to delete category:', error);
      setCategoryError('Failed to delete category. Please try again later.');
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

        await Promise.all(selectedCategories.map(async categoryId => {
          await api.post(`/infosphere/articles/${id}/categories/`, { category: categoryId }, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
        }));
      } else {
        response = await api.post('/infosphere/articles/', formData, {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        const articleId = response.data.id;

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
    <>
      <Helmet>
        <title>{id ? 'Edit Article | PinPals' : 'Crear entrada | PinPals'}</title>
      </Helmet>
      
      <div className="title-section">
        <h1 style={{ color: '#bb86fc' }}>{id ? 'Edit Article' : 'Crear noticia'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="input-section">
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="textarea-section">
          <textarea
            id="abstract"
            name="abstract"
            placeholder="Abstract"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
          ></textarea>
        </div>

        <div className="quill-section">
          <ReactQuill
            value={content}
            onChange={setContent}
            placeholder="Content"
            theme="snow"
            required
          />
        </div>

        <div className="file-section">
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="select-section">
          <select multiple id="categories" name="categories" value={selectedCategories} onChange={handleCategoryChange}>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="category-container">
          <input
            id="new-category"
            name="new-category"
            type="text"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button type="button" className="add-category-btn" onClick={handleAddCategory}>
            Agregar Categoria
          </button>
          <button
            type="button"
            className="delete-category-btn"
            onClick={() => handleDeleteCategory(selectedCategories[selectedCategories.length - 1])}
            disabled={selectedCategories.length === 0}
          >
            Delete Last Category
          </button>
        </div>

        <div className="submit-section">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
        </div>
      </form>

      <div className="error-section">
        {error && <div className="error-message">{error}</div>}
        {categoryError && <div className="error-message">{categoryError}</div>}
      </div>
    </>
  );
};

export default CreateArticle;
