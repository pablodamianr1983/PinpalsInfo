import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faList } from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext'; // Asegúrate de importar el contexto de autenticación
import '../styles/NewsSearch.css';

const NewsSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { token } = useAuth(); // Usar token desde el contexto

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let allCategories = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await api.get('/infosphere/categories/', {
            headers: {
              Authorization: `Token ${token}`, // Usar token desde el contexto
            },
            params: {
              page,
              page_size: 100, // Tamaño de página ajustado
            },
          });

          allCategories = [...allCategories, ...response.data.results];
          hasMore = !!response.data.next;
          page += 1;
        }

        setCategories(allCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (query.trim() === '' && selectedCategory === '') {
      alert('Por favor, completa al menos uno de los campos: búsqueda o categoría.');
      return;
    }
    
    onSearch(query, selectedCategory);
  };

  return (
    <div className="news-search-container">
      <form onSubmit={handleSearch} className="news-search-form">
        <div className="field">
          <p className="control has-icons-left">
            <input
              className="input"
              type="text"
              placeholder="Buscar entradas"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="icon is-small is-left">
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </p>
        </div>

        <div className="field">
          <p className="control has-icons-left">
            <select
              className="input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="">No hay categorías disponibles</option>
              )}
            </select>
            <span className="icon is-small is-left">
              <FontAwesomeIcon icon={faList} />
            </span>
          </p>
        </div>

        <div className="field">
          <p className="control">
            <button className="button is-link is-dark" type="submit">
              Buscar
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default NewsSearch;
