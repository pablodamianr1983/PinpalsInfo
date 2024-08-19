import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ArticleDetail from './pages/ArticleDetail';
import ProfilePage from './pages/ProfilePage';
import EditArticle from './pages/EditArticle';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';
import CreateArticle from './pages/CreateArticle';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import VideoBackground from './components/VideoBackground';
import ProtectedRoute from './components/ProtectedRoute';
import { HelmetProvider } from 'react-helmet-async';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import AboutUs from './pages/AboutUs';

library.add(fas);

const App = () => {
  const location = useLocation();

  const hideNavbarAndFooter = location.pathname === '/login';

  return (
    <AuthProvider>
      <ThemeProvider>
        <HelmetProvider> {/* Envuelve la aplicación en HelmetProvider */}
          <React.StrictMode>
            {!hideNavbarAndFooter && <VideoBackground />}
            {!hideNavbarAndFooter && <Navbar />}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/articles/:id" element={<ArticleDetail />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/edit-article/:id" element={<EditArticle />} />
                <Route path="/create-article" element={<CreateArticle />} /> /*arregle rutas protegidas*/
              </Route>
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {!hideNavbarAndFooter && <Footer />}
          </React.StrictMode>
        </HelmetProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
