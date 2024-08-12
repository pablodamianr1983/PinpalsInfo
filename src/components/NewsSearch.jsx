import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faList } from '@fortawesome/free-solid-svg-icons';
import '../styles/NewsSearch.css';

const NewsSearch = ({ categories, onSearch }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
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
              required
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
              {Array.isArray(categories) && categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
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
