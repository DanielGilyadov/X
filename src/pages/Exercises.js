// src/pages/Exercises.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';
import { getTypeTasks } from '../services/api';
import Spinner from '../components/common/Spinner';

const Exercises = () => {
  const [category, setCategory] = useState([]);
  const [error, setError] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLocalLoading(true);
        // Используем просто API-запрос без глобального спиннера
        const response = await getTypeTasks();
        setCategory(response);
        console.log('Получены данные категорий:', response);
      } catch (err) {
        // console.error('Ошибка при загрузке категорий:', err);
        setError('Не удалось загрузить категории упражнений. Пожалуйста, попробуйте позже.');
      } finally {
        setLocalLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Если данные еще загружаются, показываем локальный спиннер для этого компонента
  if (localLoading && category.length === 0) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
        <Spinner size="large" text="Загрузка категорий..." />
      </div>
    );
  }

  // Если произошла ошибка, показываем сообщение об ошибке
  if (error) {
    return (
      <div className="page">
        <h1>Упражнения</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Упражнения</h1>
      <p>Выберите категорию упражнений по системному анализу, чтобы начать обучение.</p>
      
      <div className="exercises-list">
        {category.length > 0 ? (
          category.map((category) => (
            <Link 
              to={`/exercises/${category.id}`} 
              key={category.id} 
              className="exercise-card-link"
            >
              <div className="exercise-card">
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <div className="exercise-card-footer">
                  <span className="exercise-count">{category.exercises} упражнений</span>
                  <span className="exercise-arrow">→</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>Нет доступных категорий упражнений.</p>
        )}
      </div>
    </div>
  );
};

export default Exercises;