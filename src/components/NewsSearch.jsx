import React, { useState } from 'react';
import './NewsSearch.css'; // Importa los estilos personalizados

const NewsSearch = ({ categories, onSearch }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query, selectedCategory);
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="input-section">
        <input
          type="text"
          placeholder="Buscar noticias por título"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="select-section">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todas las categorias</option>
          {Array.isArray(categories) && categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="button-section">
        <button type="submit">Buscar</button>
      </div>
    </form>
  );
};

export default NewsSearch;
