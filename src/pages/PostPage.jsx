import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link, useParams } from 'react-router-dom';

const API_URL = 'https://d19ea6e8af62ba1b.mokky.dev/posts';

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Пост не найден');
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError('Ошибка загрузки поста: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (isLoading) return <Layout logoText="ModernBlog" showNav={true}><p>Загрузка поста...</p></Layout>;
  if (error || !post) return <Layout logoText="ModernBlog" showNav={true}><p style={{color:'red'}}>{error || 'Пост не существует'}</p></Layout>;

  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;

  const isOwner = !!user && (
    (post.author && user.username && post.author === user.username) ||
    (post.authorId && user.id && String(post.authorId) === String(user.id))
  );

  return (
    <Layout logoText="ModernBlog" showNav={true}>
      <article className="post-full">
        <div className="post-meta">
          <time dateTime={post.createdAt || new Date().toISOString()}>
            {new Date(post.createdAt).toLocaleDateString('ru-RU')}
          </time>
          {post.author && <span style={{ marginLeft: 12 }}>Автор: {post.author}</span>}
        </div>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-content">
          <p>{post.content}</p>
        </div>
        <div className="post-actions">
          {isOwner ? (
            <>
              <Link to={`/edit/${post.id}`} className="btn btn-secondary">Редактировать</Link>
              <Link to={`/delete/${post.id}`} className="btn btn-danger">Удалить</Link>
            </>
          ) : (
            <p style={{ color: '#666' }}>Вы не являетесь автором этого поста.</p>
          )}
        </div>
      </article>
    </Layout>
  );
}

export default PostPage;