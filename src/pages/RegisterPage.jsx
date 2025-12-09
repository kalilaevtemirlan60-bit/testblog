import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/api';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Ошибка регистрации');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout logoText="NEONBLOG" showNav={false}>
      <div className="auth-page glass-panel">
        <h2>Регистрация</h2>
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
          <label>
            Подтвердите пароль
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </label>
          <div className="form-actions">
            <Link to="/login">Войти</Link>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default RegisterPage;