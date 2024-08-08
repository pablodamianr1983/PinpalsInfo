import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ArticleDetail from './pages/ArticleDetail';
import ProfilePage from './pages/ProfilePage';
import EditArticle from './pages/EditArticle'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CreateArticle from './pages/CreateArticle';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import VideoBackground from './components/VideoBackground';
import ProtectedRoute from './components/ProtectedRoute';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);


const App = () => (
  <AuthProvider>
    <VideoBackground />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/articles/:id" element={<ArticleDetail />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/edit-article/:id" element={<EditArticle />} /> {/* agregar una ruta para editar artículos */}
      <Route element={<ProtectedRoute />}>
        <Route path="/create-article" element={<CreateArticle />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </AuthProvider>
);

export default App;
