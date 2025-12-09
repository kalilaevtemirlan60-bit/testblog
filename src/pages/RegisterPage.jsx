import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/api';
import { createToken } from '../utils/auth';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Заполните все поля');
      return;
    }
    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await registerUser({ username, password });
      const user = created || { username };

      const token = await createToken(user, 60 * 60); // 1 час
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Ошибка регистрации');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout logoText="NEONBLOG" showNav={false}>
      <div className="auth-page">
        <div className="auth-card glass-panel">
          <h2 className="auth-title">Создать аккаунт</h2>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label">
              <span>Логин</span>
              <input
                className="auth-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Например: ivan"
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
                  placeholder="Придумайте пароль"
                  autoComplete="new-password"
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

            <label className="auth-label">
              <span>Подтвердите пароль</span>
              <input
                className="auth-input"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Повторите пароль"
                autoComplete="new-password"
                required
              />
            </label>

            <div className="form-actions">
              <Link to="/login" className="link-secondary">Уже есть аккаунт?</Link>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default RegisterPage;