// src/pages/ExercisesMenu.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Pages.css';
import './ExercisesMenu.css';
import { getTablesTasks } from '../services/api';
import Spinner from '../components/common/Spinner';

// --- Вспомогательные функции ---
const categoryTitles = {
  rests: 'REST интеграции',
  messageBrockers: 'SQL запросы',
  demands: 'Анализ требований'
};

const getCategoryTitle = (categoryId) => categoryTitles[categoryId] || 'Упражнения';

const difficultyMap = {
  1: 'easy',
  2: 'medium',
  3: 'hard'
};

const getDifficultyText = (level) => difficultyMap[level] || 'Средний';

// --- Компонент индикатора сложности ---
const DifficultyIndicator = ({ level }) => (
  <div className={`difficulty-indicator difficulty-${level}`}>
    {[1, 2, 3].map((dot) => (
      <div key={dot} className={`difficulty-dot dot-${dot}`}></div>
    ))}
    <span className="difficulty-text">{getDifficultyText(level)}</span>
  </div>
);

// --- Основной компонент ---
const ExercisesMenu = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryTitle = getCategoryTitle(categoryId);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await getTablesTasks(categoryId);
        console.log(response)

        const formatted = Array.isArray(response)
          ? response.map(({ id, taskName, taskDescription, taskDifficulty }) => ({
            id,
            title: taskName,
            description: taskDescription,
            difficulty: taskDifficulty,
            type: categoryId
          }))
          : [];

        setExercises(formatted);
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

  const handleStartExercise = ({ id, title, difficulty, type }) => {
    const difficultyString = difficultyMap[difficulty];

    let path;
    if (type === 'rests') {
      path = `/exercises/${categoryId}/apisimulator/${id}?difficulty=${difficultyString}`
    } else if (type === 'messageBrockers') {
      path = `/exercises/${categoryId}/messageBrockersSim`
    }

    navigate(path, { state: { exerciseId: id, exerciseTitle: title, difficulty } });
  };

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
        <span>{categoryTitle}</span>
      </div>

      <div className="exercises-menu-header">
        <h1 className="exercises-menu-title">{categoryTitle}</h1>
        <p className="exercises-menu-description">
          Выберите упражнение из категории {categoryTitle.toLowerCase()}, чтобы начать обучение и применить знания на практике.
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
