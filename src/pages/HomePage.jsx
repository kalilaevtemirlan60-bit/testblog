import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const API_URL = 'https://d19ea6e8af62ba1b.mokky.dev/posts';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const [query, setQuery] = useState('');
  const [mineOnly, setMineOnly] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Не удалось загрузить посты');
        }
        const data = await response.json();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError('Ошибка загрузки данных: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);


  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;

  const filteredPosts = posts.filter(post => {

    if (mineOnly) {
      if (!user) return false;
      const isAuthorByName = post.author && user.username && post.author === user.username;
      const isAuthorById = post.authorId && user.id && String(post.authorId) === String(user.id);
      if (!isAuthorByName && !isAuthorById) return false;
    }

    if (!query) return true;
    const q = query.toLowerCase();
    const inTitle = (post.title || '').toLowerCase().includes(q);
    const inDesc = (post.description || '').toLowerCase().includes(q);
    const inContent = (post.content || '').toLowerCase().includes(q);
    return inTitle || inDesc || inContent;
  });

  if (isLoading) {
    return <Layout logoText="NEONBLOG" showNav={true}><p>Загрузка постов...</p></Layout>;
  }

  if (error) {
    return <Layout logoText="NEONBLOG" showNav={true}><p style={{color: 'red'}}>{error}</p></Layout>;
  }

  return (
    <Layout logoText="NEONBLOG" showNav={true}>
      <section className="search-panel glass-panel" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="search"
            placeholder="Поиск по заголовку, описанию или содержанию..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '8px 10px' }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="checkbox"
              checked={mineOnly}
              onChange={(e) => setMineOnly(e.target.checked)}
            />
            Только мои
          </label>
          <button onClick={() => { setQuery(''); setMineOnly(false); }} className="btn">Сброс</button>
        </div>
        {mineOnly && !user && (
          <p style={{ color: '#b00', marginTop: 8 }}>
            Для просмотра только ваших постов выполните вход.
          </p>
        )}
        <p style={{ marginTop: 8, color: '#666' }}>
          Показано: {filteredPosts.length} из {posts.length}
        </p>
      </section>

      {filteredPosts.length === 0 ? (
        <section className="glass-panel">
          <p>Постов не найдено.</p>
        </section>
      ) : (
        filteredPosts.map(post => (
          <section key={post.id} className="post-card glass-panel">
            <Link to={`/post/${post.id}`}>
              <div className="post-meta">
                <time dateTime={post.createdAt || new Date().toISOString()}>
                  {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                </time>
                {post.author && <span style={{ marginLeft: 12 }}>Автор: {post.author}</span>}
              </div>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-description">{post.description}</p>
            </Link>
          </section>
        ))
      )}
    </Layout>
  );
}

export default HomePage;