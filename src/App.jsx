import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ArticleDetail from './pages/ArticleDetail';
import ProfilePage from './pages/ProfilePage';
import EditArticle from './pages/EditArticle'; 
import Navbar from './components/Navbar';
import CreateArticle from './pages/CreateArticle';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import VideoBackground from './components/VideoBackground';
import ProtectedRoute from './components/ProtectedRoute';

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
  </AuthProvider>
);

export default App;
