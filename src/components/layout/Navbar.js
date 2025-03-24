// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Закрытие выпадающего меню при клике за его пределами
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Обработчик выхода пользователя
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  // Переключение выпадающего меню
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Метавижн
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="navbar-item">
            Главная
          </Link>
          <Link to="/exercises" className="navbar-item">
            Упражнения
          </Link>
        </div>
        <div className="navbar-auth">
          {isAuthenticated() ? (
            <div className="user-menu" ref={dropdownRef}>
              <button className="user-button" onClick={toggleDropdown}>
                <span className="user-email">{user.email}</span>
                <span className={`chevron-icon ${dropdownOpen ? 'open' : ''}`}>▼</span>
              </button>
              <div className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
                <div className="dropdown-item">
                  <strong>{user.name}</strong>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  Мой профиль
                </Link>
                <Link to="/subscription" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  План подписки
                </Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item danger" onClick={handleLogout}>
                  Выйти
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-button login-button">
                Войти
              </Link>
              <Link to="/register" className="navbar-button register-button">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;