// src/pages/Exercises.jsx - обновленная версия
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';
import './ExercisesPage.css'; // Подключаем новый CSS файл
import { getTypeTasks } from '../services/api';
import Spinner from '../components/common/Spinner';

const Exercises = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Используем API-запрос
        const response = await getTypeTasks();
        setCategories(response);
        console.log('Получены данные категорий:', response);
      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
        setError('Не удалось загрузить категории упражнений. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };
    
    fetchData();
  }, []);

  // Отображение индикатора загрузки при первичной загрузке
  if (isInitialLoad) {
    return (
      <div className="page page-exercises" style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
        <Spinner size="large" text="Загрузка категорий..." />
      </div>
    );
  }

  return (
    <div className="page page-exercises">
      <div className="exercises-header">
        <h1 className="exercises-title">Упражнения</h1>
        <p className="exercises-description">
          Выберите категорию упражнений по системному анализу, чтобы начать обучение и 
          развить профессиональные навыки в области работы с данными и API.
        </p>
        
        {isLoading && <div className="loading-indicator"></div>}
      </div>
      
      {/* Показываем сообщение об ошибке, если она есть */}
      {error && <div className="error-message">{error}</div>}
      
      <div className="exercises-list">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Link 
              to={`/exercises/${category.type}`} 
              key={category.type} 
              className="exercise-card-link"
            >
              <div className="exercise-card">
                <h3>{category.title}</h3>
                <p>{category.description || 'Практические упражнения для развития навыков системного анализа и работы с интеграциями.'}</p>
                <div className="exercise-card-footer">
                  <span className="exercise-count">{category.exercises || 'Набор'} упражнений</span>
                  <span className="exercise-arrow">→</span>
                </div>
              </div>
            </Link>
          ))
        ) : !isLoading && (
          <div className="no-exercises">
            <div className="no-exercises-icon">📚</div>
            <p className="no-exercises-message">Нет доступных категорий упражнений.</p>
            <button className="primary-button" onClick={() => window.location.reload()}>
              Обновить страницу
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercises;