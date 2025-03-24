// src/pages/Subscription.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';
import './ProfileSubscription.css';
import { useAuth } from '../context/AuthContext';

const Subscription = () => {
  const { user, login } = useAuth();
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState('');

  // Загрузка текущего плана пользователя
  useEffect(() => {
    if (user) {
      setCurrentPlan(user.subscription || 'free');
    }
  }, [user]);

  // Обработчик изменения плана
  const handleChangePlan = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  // Подтверждение изменения плана
  const confirmPlanChange = () => {
    setLoading(true);
    
    // Имитация API запроса
    setTimeout(() => {
      const updatedUser = { ...user, subscription: selectedPlan };
      login(updatedUser);
      setCurrentPlan(selectedPlan);
      setShowModal(false);
      setMessage(`План успешно изменен на ${selectedPlan === 'pro' ? 'PRO' : selectedPlan === 'corporate' ? 'Корпоративный' : 'Бесплатный'}`);
      setLoading(false);
      
      // Скрыть сообщение через 3 секунды
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="page">
        <div className="error-message">
          Для просмотра подписки необходимо войти в систему.
          <div className="auth-footer" style={{ marginTop: '20px' }}>
            <Link to="/login" className="primary-button">Войти</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="breadcrumbs">
        <Link to="/profile">Мой профиль</Link> / План подписки
      </div>
      
      <h1>Управление подпиской</h1>
      
      {message && <div className="message-alert success">{message}</div>}
      
      <div className="subscription-container">
        {/* Текущий план */}
        <div className="subscription-status">
          <h3>Текущий план</h3>
          <div className="current-plan">
            <div className={`plan-badge ${currentPlan}`}>
              {currentPlan === 'free' ? 'Бесплатный' : 
               currentPlan === 'pro' ? 'PRO' : 'Корпоративный'}
            </div>
            <p>
              {currentPlan === 'free' 
                ? 'У вас активирован бесплатный план. Улучшите свой опыт, перейдя на PRO!' 
                : `Ваш план: ${currentPlan === 'pro' ? 'PRO' : 'Корпоративный'}`}
            </p>
          </div>
        </div>
        
        {/* Доступные планы */}
        <div className="subscription-plans">
          <h3>Доступные планы</h3>
          
          <div className="plans-grid">
            {/* Бесплатный план */}
            <div className={`plan-card ${currentPlan === 'free' ? 'current' : ''}`}>
              <div className="plan-header">
                <h4>Бесплатный</h4>
                <div className="plan-price">0 ₽/мес</div>
              </div>
              <div className="plan-features">
                <ul>
                  <li>Базовые упражнения</li>
                  <li>Ограниченный доступ к API</li>
                  <li>Учебные материалы</li>
                </ul>
              </div>
              <div className="plan-action">
                {currentPlan === 'free' ? 
                  <button className="primary-button" disabled>Текущий план</button> : 
                  <button className="secondary-button" onClick={() => handleChangePlan('free')}>
                    Перейти на бесплатный
                  </button>
                }
              </div>
            </div>
            
            {/* PRO план */}
            <div className={`plan-card featured ${currentPlan === 'pro' ? 'current' : ''}`}>
              {currentPlan !== 'pro' && <div className="plan-badge">Популярный</div>}
              <div className="plan-header">
                <h4>PRO</h4>
                <div className="plan-price">499 ₽/мес</div>
              </div>
              <div className="plan-features">
                <ul>
                  <li>Все упражнения</li>
                  <li>Полный доступ к API</li>
                  <li>Трекинг прогресса</li>
                  <li>Приоритетная поддержка</li>
                </ul>
              </div>
              <div className="plan-action">
                {currentPlan === 'pro' ? 
                  <button className="primary-button" disabled>Текущий план</button> : 
                  <button className="primary-button" onClick={() => handleChangePlan('pro')}>
                    Улучшить до PRO
                  </button>
                }
              </div>
            </div>
            
            {/* Корпоративный план */}
            <div className={`plan-card ${currentPlan === 'corporate' ? 'current' : ''}`}>
              <div className="plan-header">
                <h4>Корпоративный</h4>
                <div className="plan-price">От 4990 ₽/мес</div>
              </div>
              <div className="plan-features">
                <ul>
                  <li>До 10 пользователей</li>
                  <li>Командные упражнения</li>
                  <li>Аналитика для руководителей</li>
                  <li>Выделенный менеджер</li>
                </ul>
              </div>
              <div className="plan-action">
                {currentPlan === 'corporate' ? 
                  <button className="primary-button" disabled>Текущий план</button> : 
                  <button className="secondary-button" onClick={() => handleChangePlan('corporate')}>
                    Запросить демо
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
        
        <div className="subscription-info">
          <h3>Информация</h3>
          <p>Подписки автоматически продлеваются. Вы можете отменить автопродление в любое время.</p>
          {currentPlan !== 'free' && (
            <p>По вопросам о корпоративных подписках пишите на <a href="mailto:sales@metavision.ru">sales@metavision.ru</a>.</p>
          )}
        </div>
      </div>
      
      {/* Модальное окно */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !loading && setShowModal(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Изменение плана подписки</h3>
            </div>
            <div className="modal-body">
              <p>Вы уверены, что хотите изменить план на {
                selectedPlan === 'free' ? 'Бесплатный' : 
                selectedPlan === 'pro' ? 'PRO' : 'Корпоративный'
              }?</p>
              
              {selectedPlan !== 'free' && (
                <div className="payment-info">
                  <p>Стоимость: {
                    selectedPlan === 'pro' ? '499 ₽/мес' : '4990 ₽/мес'
                  }</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="secondary-button" 
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Отмена
              </button>
              <button 
                className="primary-button" 
                onClick={confirmPlanChange}
                disabled={loading}
              >
                {loading ? 'Обработка...' : 'Подтвердить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;