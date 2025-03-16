// src/pages/Login.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

const Login = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Вход в систему</h1>
        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Введите ваш email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input type="password" id="password" placeholder="Введите пароль" />
          </div>
          <button type="submit" className="primary-button full-width">Войти</button>
        </form>
        <div className="auth-footer">
          <p>Еще нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;