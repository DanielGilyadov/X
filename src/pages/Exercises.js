// src/pages/Exercises.jsx
import { Link } from 'react-router-dom';
import './Pages.css';
import { getTypeTasks } from '../services/api';
import React, { useEffect, useState } from 'react';

// const exerciseCategories = [
//   {
//     id: 'Rest',
//     title: 'Rest интеграции',
//     description: 'Апишка',
//     exercises: 1
//   }
// ];

const Exercises = () => {

  const [category, setCategory] = useState([]);

    useEffect(async () => {
    const response = await getTypeTasks();
    debugger
    console.log(response)
    setCategory(response)
    }, []);


  return (
    <div className="page">
      <h1>Упражнения</h1>
      <p>Выберите категорию упражнений по системному анализу, чтобы начать обучение.</p>
      
      <div className="exercises-list">
        {category.map((category) => (
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