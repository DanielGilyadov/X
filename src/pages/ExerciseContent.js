import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import exerciseContents from '../data/exerciseContents.js';
import './Pages.css';

const ExerciseContent = () => {
  const { categoryId, exerciseId } = useParams();
  const [exercise, setExercise] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [openApiSpec, setOpenApiSpec] = useState(null);
  const [endpoint, setEndpoint] = useState('/tasks');
  const [params, setParams] = useState('?status=done');

  useEffect(() => {
    if (categoryId && exerciseId && 
        exerciseContents[categoryId] && 
        exerciseContents[categoryId][exerciseId]) {
      setExercise(exerciseContents[categoryId][exerciseId]);
    }
  }, [categoryId, exerciseId]);

  if (!exercise) {
    return (
      <div className="page">
        <h1>Упражнение не найдено</h1>
        <p>Запрошенное упражнение не существует.</p>
        <Link to="/exercises" className="back-button">
          Вернуться к списку упражнений
        </Link>
      </div>
    );
  }

  // Генерация OpenAPI спецификации
  const generateOpenApi = () => {
    const spec = {
      openapi: "3.0.0",
      info: {
        title: "Project Management API",
        version: "1.0.0",
      },
      paths: {
        [endpoint]: {
          get: {
            summary: "Получить список задач",
            parameters: [
              {
                name: "status",
                in: "query",
                description: "Фильтр по статусу задачи",
                required: false,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Список задач",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "integer" },
                          name: { type: "string" },
                          status: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    setOpenApiSpec(JSON.stringify(spec, null, 2));
  };

  return (
    <div className="page exercise-content-page">
      <div className="breadcrumbs">
        <Link to="/exercises">Упражнения</Link> / 
        <Link to={`/exercises/${categoryId}`}>{exerciseContents[categoryId][1].title.split(' ')[0]}</Link> / 
        {exercise.title}
      </div>
      
      <h1>{exercise.title}</h1>
      
      <div className="exercise-content"
        dangerouslySetInnerHTML={{ __html: exercise.content }}
      />
      
      {/* Поля для API */}
      {categoryId === "fudge" && (
        <div className="api-design-section">
          <h4>Проектирование GET-метода</h4>
          <label>Endpoint:</label>
          <input type="text" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} />
          
          <label>Параметры запроса:</label>
          <input type="text" value={params} onChange={(e) => setParams(e.target.value)} />

          <button className="primary-button" onClick={generateOpenApi}>
            Сгенерировать OpenAPI
          </button>
        </div>
      )}

      {/* Вывод OpenAPI JSON */}
      {openApiSpec && (
        <div className="openapi-output">
          <h4>Сгенерированная спецификация OpenAPI:</h4>
          <pre>{openApiSpec}</pre>
        </div>
      )}

      <div className="exercise-navigation">
        <Link to={`/exercises/${categoryId}`} className="back-button">
          Вернуться к списку упражнений
        </Link>
        
        <button className="primary-button save-progress">
          Сохранить прогресс
        </button>
      </div>
    </div>
  );
};

export default ExerciseContent;
