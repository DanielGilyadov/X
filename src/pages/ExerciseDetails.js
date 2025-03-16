import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import exercisesData from '../data/exercisesData';
import './Pages.css';

const ExerciseDetails = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [layout, setLayout] = useState('list'); // 'list' или 'grid'

  useEffect(() => {
    if (categoryId && exercisesData[categoryId]) {
      setCategory(exercisesData[categoryId]);
    }
  }, [categoryId]);

  if (!category) {
    return (
      <div className="page">
        <h1>Категория не найдена</h1>
        <p>Запрошенная категория упражнений не существует.</p>
        <Link to="/exercises" className="back-button">
          Вернуться к списку упражнений
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="breadcrumbs">
        <Link to="/exercises">Упражнения</Link> / {category.title}
      </div>
      
      <h1>{category.title}</h1>
      <p>{category.description}</p>
      
      <div className="view-controls">
        <div className="toggle-view">
          <button 
            className={`view-button ${layout === 'list' ? 'active' : ''}`}
            onClick={() => setLayout('list')}
          >
            Список
          </button>
          <button 
            className={`view-button ${layout === 'grid' ? 'active' : ''}`}
            onClick={() => setLayout('grid')}
          >
            Плитка
          </button>
        </div>
      </div>
      
      <div className={`exercises-container ${layout === 'grid' ? 'grid-layout' : 'list-layout'}`}>
        {category.exercises.map((exercise) => (
          <div key={exercise.id} className="exercise-item">
            <div className="exercise-header">
              <h3>{exercise.title}</h3>
              <div className="exercise-meta">
                <span className="difficulty">{exercise.difficulty}</span>
                <span className="time">{exercise.estimatedTime}</span>
              </div>
            </div>
            <p>{exercise.description}</p>
            <Link to={`/exercise/${categoryId}/${exercise.id}`} className="start-exercise-button">
              Начать упражнение
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseDetails;
