import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/api';
import { createToken } from '../utils/auth';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      if (!user) throw new Error('Неверный логин или пароль');

      const token = await createToken(user, 60 * 60); // 1 час
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Ошибка входа');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout logoText="NEONBLOG" showNav={false}>
      <div className="auth-page">
        <div className="auth-card glass-panel">
          <h2 className="auth-title">Вход в аккаунт</h2>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label">
              <span>Логин</span>
              <input
                className="auth-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите логин"
                autoComplete="username"
                required
              />
            </label>

            <label className="auth-label">
              <span>Пароль</span>
              <div style={{ position: 'relative' }}>
                <input
                  className="auth-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword ? 'Скрыть' : 'Показать'}
                </button>
              </div>
            </label>

            <div className="form-actions">
              <Link to="/register" className="link-secondary">Регистрация</Link>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Вход...' : 'Войти'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default LoginPage;