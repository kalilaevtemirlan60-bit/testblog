import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

function Header({ logoText = "NEONBLOG", showNav = true }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => {
      try { setUser(JSON.parse(localStorage.getItem('user'))); } catch { setUser(null); }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="main-header">
      <div className="container">
        <Link to="/" className="logo">{logoText}</Link>

        {showNav && (
          <nav className="main-nav">
            <NavLink to="/add">Новый пост</NavLink>

            {user ? (
              <>
                <NavLink to="/profile">Привет, {user.username}</NavLink>
                <a href="#" onClick={handleLogout}>Выйти</a>
              </>
            ) : (
              <NavLink to="/login" className="btn-auth">Войти</NavLink>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;