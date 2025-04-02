// src/pages/ExercisesMenu.js
import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Pages.css';

// Фиктивные данные для упражнений (в реальном приложении их можно загружать с сервера)
const exercisesData = {
  'Rest': [
    {
      id: 'rest-1',
      title: 'Введение в REST API',
      description: 'Основные принципы работы с REST API интеграциями.',
      difficulty: 'Легкий',
      time: '15 мин.',
      type: 'rest-api'
    },
  ],
};

const ExercisesMenu = () => {
  debugger
  const { categoryId } = useParams();
  const navigate = useNavigate(); // Добавляем хук для программной навигации
  
  // Получение списка упражнений для выбранной категории
  const exercises = exercisesData[categoryId] || [];
  
  // Получение названия категории
  const getCategoryTitle = () => {
    
    switch(categoryId) {
      case 'Rest':
        return 'REST интеграции';
      case 'Sql':
        return 'SQL запросы';
      case 'Requirements':
        return 'Анализ требований';
      default:
        return 'Упражнения';
    }
  };

  // Функция для обработки клика по кнопке "Начать упражнение"
  const handleStartExercise = (exercise) => {
    // В зависимости от типа упражнения перенаправляем на разные страницы
    if (exercise.type === 'rest-api') {
      // Для REST API перенаправляем на RestApiSimulator с параметрами
      navigate(`/api-simulator/${exercise.id}`, { 
        state: { 
          exerciseId: exercise.id,
          exerciseTitle: exercise.title
        } 
      });
    } else {
      // Для других типов упражнений используем обычный роутинг
      navigate(`/exercises/${categoryId}/${exercise.id}`);
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
              {/* Заменяем Link на button с обработчиком события */}
              <button 
                className="start-exercise-button"
                onClick={() => handleStartExercise(exercise)}
              >
                Начать упражнение
              </button>
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