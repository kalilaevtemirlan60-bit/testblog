import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Link, useNavigate, useParams } from 'react-router-dom';

const API_URL = 'https://d19ea6e8af62ba1b.mokky.dev/posts';

function DeletePostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [postTitle, setPostTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error('Пост не найден');
        const post = await res.json();
        setPostTitle(post.title || '');

        const rawUser = localStorage.getItem('user');
        const user = rawUser ? JSON.parse(rawUser) : null;
        const owner = !!user && (
          (post.author && user.username && post.author === user.username) ||
          (post.authorId && user.id && String(post.authorId) === String(user.id))
        );
        setIsOwner(owner);
        if (!owner) setError('У вас нет прав на удаление этого поста');
      } catch (err) {
        setError(err.message || 'Ошибка загрузки поста');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!isOwner) {
      setError('Недостаточно прав для удаления');
      return;
    }
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`Ошибка при удалении: ${response.status}`);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Ошибка при удалении');
      setIsDeleting(false);
    }
  };

  if (loading) return <Layout logoText="ModernBlog" showNav={false}><p>Загрузка...</p></Layout>;

  return (
    <Layout logoText="ModernBlog" showNav={false}>
      <div className="delete-confirmation">
        <h2>Подтверждение удаления</h2>
        <p>Вы уверены, что хотите навсегда удалить этот пост?</p>
        <h3 className="post-title">"{postTitle}"</h3>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!isOwner ? (
          <div>
            <p>Удаление доступно только автору поста.</p>
            <Link to="/" className="btn btn-secondary">Назад</Link>
          </div>
        ) : (
          <form className="post-actions" onSubmit={handleDelete}>
            <Link to="/" className="btn btn-secondary" disabled={isDeleting}>Отмена</Link>
            <button type="submit" className="btn btn-danger" disabled={isDeleting}>
              {isDeleting ? 'Удаление...' : 'Да, удалить пост'}
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
}

export default DeletePostPage;