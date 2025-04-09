// src/pages/ExercisesMenu.jsx - обновленная версия
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Pages.css';
import './ExercisesMenu.css'; // Подключаем новый CSS файл
import { getTablesTasks, getEtalonsUsers } from '../services/api';
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

  // Компонент индикатора сложности с цветными кружочками
  const DifficultyIndicator = ({ level }) => {
    return (
      <div className={`difficulty-indicator difficulty-${level}`}>
        <div className="difficulty-dot dot-1"></div>
        <div className="difficulty-dot dot-2"></div>
        <div className="difficulty-dot dot-3"></div>
        <span className="difficulty-text">{getDifficultyText(level)}</span>
      </div>
    );
  };

  // Загрузка упражнений для выбранной категории при монтировании компонента
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        // Вызываем API для получения списка упражнений для категории
        const response = await getTablesTasks(categoryId);
        console.log(response);
        
        // Преобразуем данные в нужный формат в соответствии с фактической структурой API
        const formattedExercises = Array.isArray(response) ? response.map(item => ({
          id: item.id,
          title: item.taskName,
          description: item.taskDescription,
          difficulty: item.taskDifficulty || 2,
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
      // Для REST API перенаправляем на RestApiSimulator с новым путем
      navigate(`/exercises/${categoryId}/apisimulator/${exercise.id}`, { 
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
      <div className="page page-exercises-menu" style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
        <Spinner size="large" text="Загрузка упражнений..." />
      </div>
    );
  }

  return (
    <div className="page page-exercises-menu">
      <div className="breadcrumbs">
        <Link to="/exercises">Упражнения</Link>
        <span>{getCategoryTitle()}</span>
      </div>
      
      <div className="exercises-menu-header">
        <h1 className="exercises-menu-title">{getCategoryTitle()}</h1>
        <p className="exercises-menu-description">
          Выберите упражнение из категории {getCategoryTitle().toLowerCase()}, чтобы начать обучение и применить знания на практике.
        </p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="exercises-container grid-layout">
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <div key={exercise.id} className="exercise-item">
              <div className="exercise-header">
                <h3>{exercise.title}</h3>
                <DifficultyIndicator level={exercise.difficulty} />
              </div>
              <p>{exercise.description || 'В этом упражнении вы сможете применить знания на практике и развить навыки решения задач.'}</p>
              <button 
                className="start-exercise-button"
                onClick={() => handleStartExercise(exercise)}
              >
                Начать упражнение
              </button>
            </div>
          ))
        ) : (
          <div className="no-exercises">
            <div className="no-exercises-icon">📋</div>
            <div className="no-exercises-message">
              Упражнения для данной категории не найдены.
            </div>
            <button className="primary-button" onClick={() => navigate('/exercises')}>
              Вернуться к категориям
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesMenu;