// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Pages.css';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка на заполнение всех полей
    if (!formData.email || !formData.password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      setLocalLoading(true);
      setError('');

      // Отправка данных на сервер без глобального спиннера
      const response = await loginUser(formData.email, formData.password);

      console.log('Ответ сервера:', response);

      // Проверяем, что получили токен
      if (!response.token) {
        throw new Error('Токен авторизации не получен');
      }

      // Сохраняем данные в контексте аутентификации
      login({
        email: formData.email,
        name: response.name || 'Пользователь',
        token: response.token // Сохраняем полученный токен
      });

      // После успешного входа перенаправляем на домашнюю страницу
      navigate('/');
      
    } catch (err) {
      // Обработка ошибок
      console.error('Ошибка при входе:', err);
      setError(err.response?.data?.message || 'Произошла ошибка при входе');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Вход в систему</h1>
        {error && <div className="error-message">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="Введите ваш email" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input 
              type="password" 
              id="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль" 
            />
          </div>
          <button 
            type="submit" 
            className="primary-button full-width"
            disabled={localLoading}
          >
            {localLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner size="small" text="" />
                <span style={{ marginLeft: '10px' }}>Вход...</span>
              </div>
            ) : 'Войти'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Еще нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;