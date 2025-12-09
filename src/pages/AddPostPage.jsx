import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://d19ea6e8af62ba1b.mokky.dev/posts';

function AddPostPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) navigate('/login');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const rawUser = localStorage.getItem('user');
    const user = rawUser ? JSON.parse(rawUser) : null;

    if (!user) {
      setMessage('Требуется вход в систему, перенаправляем...');
      setIsSubmitting(false);
      navigate('/login');
      return;
    }

    try {

      const body = {
        title,
        description,
        content,
        author: user.username || null,
      };
      if (user.id) body.authorId = user.id;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Ошибка создания поста');
      }

      const newPost = await response.json();
      setMessage('Пост успешно опубликован!');
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      setMessage('Ошибка: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout logoText="MyBlog" showNav={true}>
      <section className="glass-panel">
        <h1 className="post-title">Создать новую запись</h1>
        {message && <p style={{ color: message.startsWith('Ошибка') ? 'red' : 'green', fontWeight: 'bold' }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Заголовок</label>
            <input
              type="text" id="title" className="form-control" placeholder="Название вашей истории..."
              value={title} onChange={(e) => setTitle(e.target.value)} required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Краткое описание</label>
            <textarea
              id="description" rows="3" className="form-control" placeholder="Несколько слов о главном..."
              value={description} onChange={(e) => setDescription(e.target.value)} required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="content">Полное содержание</label>
            <textarea
              id="content" rows="10" className="form-control" placeholder="Расскажите обо всем в деталях..."
              value={content} onChange={(e) => setContent(e.target.value)} required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Публикация...' : 'Опубликовать'}
          </button>
        </form>
      </section>
    </Layout>
  );
}

export default AddPostPage;