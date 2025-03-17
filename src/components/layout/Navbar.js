// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
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
          <Link to="/login" className="navbar-button login-button">
            Войти
          </Link>
          <Link to="/register" className="navbar-button register-button">
            Регистрация
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;