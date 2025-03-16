// src/pages/Exercises.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

const exerciseCategories = [
  {
    id: 'basic-concepts',
    title: 'Базовые концепции',
    description: 'Познакомьтесь с основными принципами системного анализа.',
    exercises: 3
  },
  {
    id: 'fudge',
    title: 'Rest интеграции',
    description: 'Апишка',
    exercises: 5
  }
];

const Exercises = () => {
  return (
    <div className="page">
      <h1>Упражнения</h1>
      <p>Выберите категорию упражнений по системному анализу, чтобы начать обучение.</p>
      
      <div className="exercises-list">
        {exerciseCategories.map((category) => (
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
        ))}
      </div>
    </div>
  );
};

export default Exercises;