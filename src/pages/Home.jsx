import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';
import NewsSearch from '../components/NewsSearch';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleArticles, setVisibleArticles] = useState(3);
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchArticlesAndCategories = async () => {
      setLoading(true);
      setError('');

      try {
        let articlesData = [];
        let categoriesData = [];
        let hasMore = true;
        let page = 1;

        // Fetch all articles
        while (hasMore) {
          const response = await api.get('/infosphere/articles/', {
            params: { page, page_size: 100 },
          });
          articlesData = [...articlesData, ...response.data.results];
          hasMore = !!response.data.next;
          page += 1;
        }

        // Fetch all article categories
        page = 1;
        hasMore = true;
        while (hasMore) {
          const response = await api.get('/infosphere/article-categories/', {
            params: { page, page_size: 100 },
          });
          categoriesData = [...categoriesData, ...response.data.results];
          hasMore = !!response.data.next;
          page += 1;
        }

        const allCategoriesResponse = await api.get('/infosphere/categories/');
        const allCategoriesData = allCategoriesResponse.data.results;

        const categoryNamesMap = allCategoriesData.reduce((acc, category) => {
          acc[category.id] = category.name;
          return acc;
        }, {});

        const categoriesMap = categoriesData.reduce((acc, assignment) => {
          if (!acc[assignment.article]) {
            acc[assignment.article] = [];
          }
          acc[assignment.article].push(categoryNamesMap[assignment.category]);
          return acc;
        }, {});

        const articlesWithCategory = articlesData.map(article => ({
          ...article,
          categories: categoriesMap[article.id] || ['Unknown category'],
        }));

        articlesWithCategory.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        if (isAuthenticated) {
          const authorIds = [...new Set(articlesWithCategory.map(article => article.author))];
          const userProfilePromises = authorIds.map(id =>
            api.get(`/users/profiles/${id}/`, {
              headers: { Authorization: `Token ${token}` },
            })
          );
          const userProfilesResponses = await Promise.all(userProfilePromises);
          const profilesMap = userProfilesResponses.reduce((acc, response) => {
            acc[response.data.user__id] = response.data;
            return acc;
          }, {});
          setUserProfiles(profilesMap);
        }

        setArticles(articlesWithCategory);
        setSearchResults(articlesWithCategory);

        const uniqueCategories = Array.from(
          new Set(allCategoriesData.map(category => ({ id: category.id, name: category.name })))
        );
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
    setArticles(prevArticles => prevArticles.filter(article => article.id !== id));
    setSearchResults(prevResults => prevResults.filter(article => article.id !== id));
  };

  const handleShowMore = () => {
    setVisibleArticles(prevVisibleArticles => prevVisibleArticles + 3);
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
    <>
      <div className="search-section">
        <NewsSearch categories={categories} onSearch={handleSearch} />
      </div>

      <div className="loading-error-section">
        {loading && <div>Loading articles...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>

      <div className="articles-container">
        {!loading && !error && searchResults.slice(0, 3).map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            onDelete={handleDeleteArticle}
            authorProfile={userProfiles[article.author]}
            className="article-card"
          />
        ))}
      </div>

      <div className="small-cards-container">
        {!loading && !error && searchResults.slice(3, visibleArticles).map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            onDelete={handleDeleteArticle}
            authorProfile={userProfiles[article.author]}
            className="article-card small-card"
          />
        ))}
      </div>

      <div className="show-more-section">
        {!loading && !error && visibleArticles < searchResults.length && (
          <button onClick={handleShowMore} className="show-more-button">
            Show More
          </button>
        )}
      </div>
    </>
  );
};

export default Home;
