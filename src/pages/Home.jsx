import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';
import NewsSearch from '../components/NewsSearch';
import { useAuth } from '../contexts/AuthContext';
import './Home.css'; // Importa los estilos personalizados

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleArticles, setVisibleArticles] = useState(5); //articulos por paginas
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchArticlesAndCategories = async () => {
      setLoading(true);
      setError('');

      try {
        const articlesData = [];
        const categoriesData = [];

        // Fetch a todos los articulos
        let page = 1;
        let hasMore = true;
        while (hasMore) {
          const response = await api.get('/infosphere/articles/', {
            params: { page, page_size: 100 },
          });
          articlesData.push(...response.data.results);
          hasMore = !!response.data.next;
          page += 1;
        }

        
        page = 1;
        hasMore = true;
        while (hasMore) {
          const response = await api.get('/infosphere/article-categories/', {
            params: { page, page_size: 100 },
          });
          categoriesData.push(...response.data.results);
          hasMore = !!response.data.next;
          page += 1;
        }

        // Fetch todas las categorias
        const allCategoriesResponse = await api.get('/infosphere/categories/');
        const allCategoriesData = allCategoriesResponse.data.results;

        // Mapea categorias por id
        const categoryNamesMap = allCategoriesData.reduce((acc, category) => {
          acc[category.id] = category.name;
          return acc;
        }, {});

        // Map articulso por categoria
        const categoriesMap = categoriesData.reduce((acc, assignment) => {
          if (!acc[assignment.article]) {
            acc[assignment.article] = [];
          }
          acc[assignment.article].push(categoryNamesMap[assignment.category]);
          return acc;
        }, {});

        // Agregar nombres de categorías a los articulos
        const articlesWithCategory = articlesData.map(article => ({
          ...article,
          categories: categoriesMap[article.id] || ['Unknown category'],
        }));

        // Ordenar artículos por fecha de creación
        articlesWithCategory.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Obtener perfiles de usuarios solo si están autenticados
        if (isAuthenticated) {
          const authorIds = Array.from(new Set(articlesWithCategory.map(article => article.author)));
          const userProfilePromises = authorIds.map(id => api.get(`/users/profiles/${id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          }));
          const userProfilesResponses = await Promise.all(userProfilePromises);
          const profilesMap = userProfilesResponses.reduce((acc, response) => {
            acc[response.data.user__id] = response.data;
            return acc;
          }, {});
          setUserProfiles(profilesMap);
        }

        setArticles(articlesWithCategory);
        setSearchResults(articlesWithCategory);

        // Establecer categorías unicas
        const uniqueCategories = Array.from(new Set(allCategoriesData.map(category => ({
          id: category.id,
          name: category.name,
        }))));
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error details:', err.response ? err.response.data : err.message);
        setError('Failed to fetch articles and categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticlesAndCategories();
  }, [token, isAuthenticated]);

  const handleDeleteArticle = (id) => {
    setArticles(articles.filter(article => article.id !== id));
    setSearchResults(searchResults.filter(article => article.id !== id));
  };

  const handleShowMore = () => {
    setVisibleArticles(visibleArticles + 3);
  };

  const handleSearch = (query, selectedCategory) => {
    let filteredArticles = articles;

    if (query) {
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredArticles = filteredArticles.filter(article =>
        article.categories.includes(selectedCategory)
      );
    }

    setSearchResults(filteredArticles);
  };

  return (
    <div className="container">
      <NewsSearch categories={categories} onSearch={handleSearch} />
      {loading && <div>Loading articles...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="articles-container">
        {!loading && !error && searchResults.slice(0, 2).map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            onDelete={handleDeleteArticle}
            authorProfile={userProfiles[article.author]} // Pasar el perfil del autor si está disponible
            className="large-card"
          />
        ))}
        <div className="small-cards-container">
          {!loading && !error && searchResults.slice(2, visibleArticles).map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onDelete={handleDeleteArticle}
              authorProfile={userProfiles[article.author]} // Pasar el perfil del autor si está disponible
              className="small-card"
            />
          ))}
        </div>
      </div>
      {!loading && !error && visibleArticles < searchResults.length && (
        <button onClick={handleShowMore} className="show-more-button">
          Show More
        </button>
      )}
    </div>
  );
};

export default Home;
