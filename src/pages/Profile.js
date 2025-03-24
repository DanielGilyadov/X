// src/pages/Profile.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';
import './ProfileSubscription.css';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="page">
        <div className="error-message">
          Для просмотра профиля необходимо войти в систему.
          <div className="auth-footer" style={{ marginTop: '20px' }}>
            <Link to="/login" className="primary-button">Войти</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Мой профиль</h1>
      
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          </div>
          
          <div className="profile-section">
            <h3>Информация о пользователе</h3>
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Имя:</span>
                <span className="detail-value">{user.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Дата регистрации:</span>
                <span className="detail-value">01.01.2023</span>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <Link to="/subscription" className="primary-button">
              Управление подпиской
            </Link>
            <button className="secondary-button">
              Изменить профиль
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;