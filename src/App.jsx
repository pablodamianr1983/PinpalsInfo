import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import AboutUs from './pages/AboutUs';  // Importa el componente AboutUs

library.add(fas);

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <React.StrictMode>
        <VideoBackground />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-article/:id" element={<EditArticle />} /> {/* Ruta para editar artículos */}
          <Route path="/about-us" element={<AboutUs />} /> {/* Ruta para Quienes Somos */}
          <Route element={<ProtectedRoute />}>
            <Route path="/create-article" element={<CreateArticle />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </React.StrictMode>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
