// src/pages/Register.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

const Register = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Регистрация</h1>
        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Имя</label>
            <input type="text" id="name" placeholder="Введите ваше имя" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Введите ваш email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input type="password" id="password" placeholder="Создайте пароль" />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Подтвердите пароль</label>
            <input type="password" id="confirm-password" placeholder="Подтвердите пароль" />
          </div>
          <button type="submit" className="primary-button full-width">Зарегистрироваться</button>
        </form>
        <div className="auth-footer">
          <p>Уже есть аккаунт? <Link to="/login">Войдите</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;