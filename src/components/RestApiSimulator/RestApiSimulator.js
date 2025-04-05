// src/components/RestApiSimulator/RestApiSimulator.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import './RestApiSimulator.css';
import Spinner from '../common/Spinner';

const RestApiSimulator = () => {
  // Получаем параметры из URL, включая categoryId
  const { exerciseId, categoryId } = useParams();
  const location = useLocation();
  const [exerciseData, setExerciseData] = useState(null);
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [responseStatus, setResponseStatus] = useState('');
  const [responseBody, setResponseBody] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Загрузка данных упражнения при монтировании компонента
  useEffect(() => {
    const loadExerciseData = async () => {
      setLoading(true);
      
      try {
        // Если данные были переданы через навигацию
        if (location.state?.exerciseId) {
          setExerciseData({
            id: location.state.exerciseId,
            title: location.state.exerciseTitle
          });
        } else {
          // Здесь можно добавить логику загрузки данных упражнения по ID
          console.log('Загрузка данных упражнения для ID:', exerciseId);
          
          // Имитируем задержку загрузки для демонстрации спиннера
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Пример загрузки фиктивных данных
          setExerciseData({
            id: exerciseId,
            title: `Упражнение по REST API ${exerciseId}`
          });
        }
      } catch (error) {
        console.error('Ошибка при загрузке упражнения:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadExerciseData();
  }, [exerciseId, location.state]);

  // Обработчик отправки запроса
  const handleSendRequest = async () => {
    // Показываем локальный спиннер только для области ответа
    setLoading(true);
    
    try {
      // Имитация задержки запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Простая имитация ответа для демонстрации
      setResponseStatus('200 OK');
      setResponseBody(JSON.stringify({
        message: "Ответ получен успешно",
        method: method,
        url: url,
        requestData: requestBody ? JSON.parse(requestBody) : null,
        timestamp: new Date().toISOString()
      }, null, 2));
    } catch (error) {
      setResponseStatus('400 Bad Request');
      setResponseBody(JSON.stringify({
        error: "Ошибка в запросе",
        details: error.message
      }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (!exerciseData) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Spinner size="large" text="Загрузка упражнения..." />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="breadcrumbs">
        <Link to="/exercises">Упражнения</Link> 
        <Link to={`/exercises/${categoryId || 'Rest'}`}>
          {categoryId ? (categoryId === 'rests' ? 'REST интеграции' : categoryId) : 'REST интеграции'}
        </Link> / 
        task{exerciseId}
      </div>
      
      <h1>{exerciseData.title}</h1>
      
      <div className="rest-api-simulator">
        <div className="api-controls">
          <h2>REST API Симулятор</h2>
          <p>Используйте этот симулятор для выполнения REST API упражнений.</p>
          
          <div className="api-interface">
            <div className="method-selector">
              <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input 
                type="text" 
                placeholder="URL запроса" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button 
                className="primary-button" 
                onClick={handleSendRequest}
                disabled={loading}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Spinner size="small" text="" />
                    <span style={{ marginLeft: '5px' }}>Отправка...</span>
                  </div>
                ) : "Отправить"}
              </button>
            </div>
            
            <div className="request-body">
              <h3>Тело запроса</h3>
              <textarea 
                placeholder="Введите JSON..." 
                rows="5"
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                disabled={method === 'GET'}
              ></textarea>
            </div>

          </div>
        </div>
        
        <div className="exercise-task">
          <h2>Задание</h2>
          <div className="task-description">
            <ol>
              <li>Выполнить GET запрос для получения данных пользователя</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestApiSimulator;