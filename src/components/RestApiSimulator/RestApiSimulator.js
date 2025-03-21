// src/pages/RestApiSimulator.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import './RestApiSimulator.css';

const RestApiSimulator = () => {
  const { exerciseId } = useParams();
  const location = useLocation();
  const [exerciseData, setExerciseData] = useState(null);
  
  // Извлекаем данные из location.state или загружаем их
  useEffect(() => {
    // Если данные были переданы через навигацию
    if (location.state?.exerciseId) {
      setExerciseData({
        id: location.state.exerciseId,
        title: location.state.exerciseTitle
      });
    } else {
      // Здесь можно добавить логику загрузки данных упражнения по ID
      // Например, из API или из локального хранилища
      console.log('Загрузка данных упражнения для ID:', exerciseId);
      
      // Пример загрузки фиктивных данных
      setExerciseData({
        id: exerciseId,
        title: `Упражнение по REST API ${exerciseId}`
      });
    }
  }, [exerciseId, location.state]);

  if (!exerciseData) {
    return <div className="page">Загрузка упражнения...</div>;
  }

  return (
    <div className="page">
      <div className="breadcrumbs">
        <Link to="/exercises">Упражнения</Link> / 
        <Link to="/exercises/Rest">REST интеграции</Link> / 
        {exerciseData.title}
      </div>
      
      <h1>{exerciseData.title}</h1>
      
      <div className="rest-api-simulator">
        <div className="api-controls">
          <h2>REST API Симулятор</h2>
          <p>Используйте этот симулятор для выполнения REST API упражнений.</p>
          
          {/* Здесь будет интерфейс API симулятора */}
          <div className="api-interface">
            <div className="method-selector">
              <select>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input type="text" placeholder="URL запроса" />
              <button className="primary-button">Отправить</button>
            </div>
            
            <div className="request-body">
              <h3>Тело запроса</h3>
              <textarea placeholder="Введите JSON..." rows="5"></textarea>
            </div>
            
            <div className="response-area">
              <h3>Ответ сервера</h3>
              <div className="response-code">Код ответа: <span>200 OK</span></div>
              <pre className="response-body">{"{\n  \"message\": \"Используйте этот симулятор для тестирования API запросов\"\n}"}</pre>
            </div>
          </div>
        </div>
        
        <div className="exercise-task">
          <h2>Задание</h2>
          <div className="task-description">
            <p>Для этого упражнения вам необходимо использовать API симулятор для выполнения следующих задач:</p>
            <ol>
              <li>Выполнить GET запрос для получения данных пользователя</li>
              <li>Создать нового пользователя с помощью POST запроса</li>
              <li>Обновить информацию о пользователе используя PUT запрос</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestApiSimulator;