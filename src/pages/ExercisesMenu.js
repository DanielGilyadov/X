// src/pages/ExercisesMenu.js
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Pages.css';
import { getTablesTasks } from '../services/api';
import Spinner from '../components/common/Spinner';

const ExercisesMenu = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Получение названия категории
  const getCategoryTitle = () => {
    switch(categoryId) {
      case 'rests':
        return 'REST интеграции';
      case "messageBrockers":
        return 'SQL запросы';
      case "demands":
        return 'Анализ требований';
      default:
        return 'Упражнения';
    }
  };

  // Словарь для определения сложности
  const getDifficultyText = (level) => {
    const difficultyMap = {
      1: 'Легкий',
      2: 'Средний',
      3: 'Сложный'
    };
    return difficultyMap[level] || 'Средний';
  };

  // Загрузка упражнений для выбранной категории при монтировании компонента
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        // Вызываем API для получения списка упражнений для категории
        const response = await getTablesTasks(categoryId);
        console.log(response)
        
        // Преобразуем данные в нужный формат в соответствии с фактической структурой API
        const formattedExercises = Array.isArray(response) ? response.map(item => ({
          id: item.id,
          title: item.taskName,
          description: item.taskDescription,
          difficulty: getDifficultyText(item.taskDifficulty),
          type: 'rest-api' // Предполагаем тип по умолчанию для всех упражнений
        })) : [];
        
        setExercises(formattedExercises);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке упражнений:', err);
        setError('Не удалось загрузить упражнения. Пожалуйста, попробуйте позже.');
        setExercises([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExercises();
  }, [categoryId]);

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

  // Отображаем спиннер во время загрузки
  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
        <Spinner size="large" text="Загрузка упражнений..." />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="breadcrumbs">
        <Link to="/exercises">Упражнения</Link> / {getCategoryTitle()}
      </div>
      
      <h1>{getCategoryTitle()}</h1>
      <p>Выберите упражнение, чтобы начать обучение.</p>
      
      {error && <div className="error-message">{error}</div>}
      
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