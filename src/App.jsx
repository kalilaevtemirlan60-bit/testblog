import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import AddPostPage from './pages/AddPostPage';
import EditPostPage from './pages/EditPostPage';
import DeletePostPage from './pages/DeletePostPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/add" element={<AddPostPage />} />

      <Route path="/post/:id" element={<PostPage />} />

      <Route path="/edit/:id" element={<EditPostPage />} />

      <Route path="/delete/:id" element={<DeletePostPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;