// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Pages.css';
import { registerUser, checkEmailExists } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Обработчик изменения полей формы
  const handleChange = async (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка на совпадение паролей
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    // Проверка на заполнение всех полей
    if (!formData.name || !formData.email || !formData.password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const check = await checkEmailExists(formData.email);
      console.log('Результат проверки email:', check);

      if(!check.exists){
        // Отправка данных на сервер
        const response = await registerUser(
          formData.email,
          formData.name,
          formData.password
        );

        console.log('Ответ сервера при регистрации:', response);

        // Если после регистрации получен токен, выполняем автологин
        if (response.token) {
          login({
            email: formData.email,
            name: formData.name,
            token: response.token
          });
          navigate('/'); // Перенаправляем на главную страницу
        } else {
          // Если требуется дополнительный вход, перенаправляем на страницу входа
          navigate('/login');
        }
      } else {
        setError(check.message);
      }
      
    } catch (err) {
      // Обработка ошибок
      console.error('Ошибка при регистрации:', err);
      setError(err.response?.data?.message || 'Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Регистрация</h1>
        {error && <div className="error-message">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Имя</label>
            <input 
              type="text" 
              id="name" 
              placeholder="Введите ваше имя" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Введите ваш email" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Создайте пароль" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input 
              type="password" 
              id="confirmPassword" 
              placeholder="Подтвердите пароль" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button 
            type="submit" 
            className="primary-button full-width"
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Уже есть аккаунт? <Link to="/login">Войдите</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;