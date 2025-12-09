import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/api';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Введите логин и пароль');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await loginUser({ username, password });
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Ошибка входа');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout logoText="NEONBLOG" showNav={false}>
      <div className="auth-page glass-panel">
        <h2>Вход</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Логин
            <input value={username} onChange={e => setUsername(e.target.value)} />
          </label>
          <label>
            Пароль
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </label>
          <div className="form-actions">
            <Link to="/register">Регистрация</Link>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default LoginPage;