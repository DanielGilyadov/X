// src/pages/ExercisesMenu.js
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './Pages.css';

// Фиктивные данные для упражнений (в реальном приложении их можно загружать с сервера)
const exercisesData = {
  'Rest': [
    {
      id: 'rest-1',
      title: 'Введение в REST API',
      description: 'Основные принципы работы с REST API интеграциями.',
      difficulty: 'Легкий',
      time: '15 мин.'
    },
    {
      id: 'rest-2',
      title: 'Работа с методами HTTP',
      description: 'Изучение HTTP методов GET, POST, PUT, DELETE в REST API.',
      difficulty: 'Средний',
      time: '25 мин.'
    }
  ]
};

const ExercisesMenu = () => {
  const { categoryId } = useParams();
  
  // Получение списка упражнений для выбранной категории
  const exercises = exercisesData[categoryId] || [];
  
  // Получение названия категории
  const getCategoryTitle = () => {
    switch(categoryId) {
      case 'Rest':
        return 'REST интеграции';
      default:
        return 'Упражнения';
    }
  };

  return (
    <div className="page">
      <div className="breadcrumbs">
        <Link to="/exercises">Упражнения</Link> / {getCategoryTitle()}
      </div>
      
      <h1>{getCategoryTitle()}</h1>
      <p>Выберите упражнение, чтобы начать обучение.</p>
      
      <div className="exercises-container grid-layout">
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <div key={exercise.id} className="exercise-item">
              <div className="exercise-header">
                <h3>{exercise.title}</h3>
                <div className="exercise-meta">
                  <span className="difficulty">{exercise.difficulty}</span>
                  <span className="time">{exercise.time}</span>
                </div>
              </div>
              <p>{exercise.description}</p>
              <Link to={`/exercises/${categoryId}/${exercise.id}`} className="start-exercise-button">
                Начать упражнение
              </Link>
            </div>
          ))
        ) : (
          <div className="error-message">
            Упражнения для данной категории не найдены.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesMenu;