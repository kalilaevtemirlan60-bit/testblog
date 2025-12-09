import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'https://d19ea6e8af62ba1b.mokky.dev/posts';

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error('Пост не найден');
        const post = await res.json();

        setTitle(post.title || '');
        setDescription(post.description || '');
        setContent(post.content || '');

        const rawUser = localStorage.getItem('user');
        const user = rawUser ? JSON.parse(rawUser) : null;
        const owner = !!user && (
          (post.author && user.username && post.author === user.username) ||
          (post.authorId && user.id && String(post.authorId) === String(user.id))
        );
        setIsOwner(owner);
        if (!owner) setError('У вас нет прав для редактирования этого поста');
      } catch (err) {
        setError(err.message || 'Ошибка загрузки поста');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOwner) {
      setError('Недостаточно прав');
      return;
    }
    setIsSaving(true);
    setError(null);

    try {
      const rawUser = localStorage.getItem('user');
      const user = rawUser ? JSON.parse(rawUser) : null;

      const body = {
        title,
        description,
        content,
      };
      if (user) {
        if (user.username) body.author = user.username;
        if (user.id) body.authorId = user.id;
      }

      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Ошибка при сохранении');

      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.message || 'Ошибка при сохранении');
      setIsSaving(false);
    }
  };

  if (loading) return <Layout logoText="ModernBlog" showNav={true}><p>Загрузка...</p></Layout>;

  return (
    <Layout logoText="ModernBlog" showNav={true}>
      <h1 className="post-title">Редактировать пост</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!isOwner ? (
        <p>Редактирование доступно только автору поста.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Заголовок</label>
            <input
              type="text" id="title" name="title" className="form-control"
              value={title} onChange={(e) => setTitle(e.target.value)} required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Краткое описание</label>
            <textarea
              id="description" name="description" rows="3" className="form-control"
              value={description} onChange={(e) => setDescription(e.target.value)} required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="content">Полное содержание</label>
            <textarea
              id="content" name="content" rows="12" className="form-control"
              value={content} onChange={(e) => setContent(e.target.value)} required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </form>
      )}
    </Layout>
  );
}

export default EditPostPage;