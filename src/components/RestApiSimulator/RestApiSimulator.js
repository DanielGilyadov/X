// src/components/RestApiSimulator/RestApiSimulator.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import './RestApiSimulator.css';
import Spinner from '../common/Spinner';

// Вспомогательная функция для подсветки синтаксиса JSON
const formatJsonSyntax = (jsonString) => {
  if (!jsonString) return '';
  
  try {
    // Заменяем ключи, строки, числа и т.д. spans с классами для стилизации
    return jsonString
      .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="json-string">"$1"</span>')
      .replace(/: ([0-9]+)/g, ': <span class="json-number">$1</span>')
      .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
      .replace(/: (null)/g, ': <span class="json-null">$1</span>');
  } catch (e) {
    return jsonString;
  }
};


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
  const [showResponse, setShowResponse] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);
  
  // Загрузка данных упражнения при монтировании компонента
  useEffect(() => {
    const loadExerciseData = async () => {
      setLoading(true);
      
      try {
        // Если данные были переданы через навигацию
        if (location.state?.exerciseId) {
          setExerciseData({
            id: location.state.exerciseId,
            title: location.state.exerciseTitle,
            task: 'Выполните GET запрос для получения данных пользователя с ID 1. Используйте URL /api/users/1'
          });
        } else {
          // Здесь можно добавить логику загрузки данных упражнения по ID
          console.log('Загрузка данных упражнения для ID:', exerciseId);
          
          // Имитируем задержку загрузки для демонстрации спиннера
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Пример загрузки фиктивных данных
          setExerciseData({
            id: exerciseId,
            title: `Упражнение по REST API ${exerciseId}`,
            task: 'Выполните GET запрос для получения данных пользователя с ID 1. Используйте URL /api/users/1'
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

  // Функция для проверки выполнения задания
  const checkTaskCompletion = (method, url, response) => {
    // Примеры условий для проверки выполнения задания
    if (method === 'GET' && url === '/api/users/1' && response.status === 200) {
      setTaskCompleted(true);
      return true;
    }
    return false;
  };

  // Обработчик отправки запроса
  const handleSendRequest = async () => {
    // Показываем локальный спиннер только для области ответа
    setLoading(true);
    setShowResponse(true);
    
    try {
      // Имитация задержки запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Определяем тип ответа в зависимости от запроса
      let responseData = {};
      let status = '200 OK';
      
      if (url === '/api/users') {
        responseData = {
          data: [
            { id: 1, name: "Иван Петров", email: "ivan@example.com" },
            { id: 2, name: "Мария Сидорова", email: "maria@example.com" }
          ],
          message: "Пользователи успешно получены"
        };
      } else if (url === '/api/users/1') {
        responseData = {
          data: { 
            id: 1, 
            name: "Иван Петров", 
            email: "ivan@example.com", 
            role: "admin",
            created_at: "2023-01-15T10:30:00Z"
          },
          message: "Данные пользователя получены"
        };
      } else if (method === 'POST' && url === '/api/users') {
        try {
          const requestData = JSON.parse(requestBody);
          responseData = {
            data: { 
              id: 3, 
              ...requestData,
              created_at: new Date().toISOString()
            },
            message: "Пользователь успешно создан"
          };
          status = '201 Created';
        } catch (e) {
          responseData = {
            error: "Неверный формат JSON в теле запроса",
            details: e.message
          };
          status = '400 Bad Request';
        }
      } else if (url === '') {
        responseData = {
          error: "URL запроса не указан",
          details: "Пожалуйста, укажите URL для выполнения запроса"
        };
        status = '400 Bad Request';
      } else {
        responseData = {
          data: {},
          message: `${method} запрос к ${url} выполнен`
        };
      }
      
      // Добавляем служебную информацию
      responseData = {
        ...responseData,
        meta: {
          method: method,
          url: url,
          timestamp: new Date().toISOString()
        }
      };
      
      // Устанавливаем статус ответа
      setResponseStatus(status);
      
      // Устанавливаем тело ответа
      setResponseBody(JSON.stringify(responseData, null, 2));
      
      // Проверяем выполнение задания
      checkTaskCompletion(method, url, {
        status: status.startsWith('2'), // Проверяем успешность запроса
        data: responseData
      });
      
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
        <Link to="/exercises">Упражнения</Link> {' > '}
        <Link to={`/exercises/${categoryId || 'Rest'}`}>
          {categoryId ? (categoryId === 'rests' ? 'REST интеграции' : categoryId) : 'REST интеграции'}
        </Link> {' > '}
        task{exerciseId}
      </div>
      
      <h1>{exerciseData.title}</h1>
      
      <div className="rest-api-simulator">
        <div className="api-controls">
          
          <div className="simulator-layout">
            {/* Колонка с заданием */}
            <div className="task-column">
              <div className="exercise-task">
                <h2>Задание</h2>
                <div className="task-description">
                  <ol>
                    <li>{exerciseData.task}</li>
                  </ol>
                </div>
                
                {taskCompleted && (
                  <div className="task-completed">
                    <div className="task-completed-icon">✓</div>
                    <div className="task-completed-message">
                      Задание выполнено успешно! Вы можете перейти к следующему упражнению.
                    </div>
                  </div>
                )}
                
                
              </div>
            </div>
            
            {/* Колонка с решением */}
            <div className="solution-column">
              <div className="api-interface">
                <h3>Решение</h3>
                <div className="method-selector">
                  <select 
                    value={method} 
                    onChange={(e) => setMethod(e.target.value)}
                    aria-label="HTTP метод"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                  
                  <input 
                    type="text" 
                    placeholder="URL запроса, например: /api/users/1" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    aria-label="URL запроса"
                  />
                  
                  <button 
                    className="send-request-button" 
                    onClick={handleSendRequest}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="small" text="" />
                        <span>Отправка...</span>
                      </>
                    ) : "Отправить запрос"}
                  </button>
                </div>>
                
                <div className="request-body">
                  <h3>Тело запроса</h3>
                  <textarea 
                    placeholder={method === 'GET' ? 
                      "GET запросы не имеют тела" : 
                      'Введите JSON данные...\n{\n  "name": "Имя",\n  "email": "email@example.com"\n}'} 
                    rows="6"
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    disabled={method === 'GET'}
                    aria-label="Тело запроса"
                  ></textarea>
                </div>
                
                {showResponse && (
                  <div className="response-area">
                    <div className="response-area-header">
                      <h3>Ответ сервера</h3>
                      {responseStatus && (
                        <div className={`response-code ${
                          responseStatus.startsWith('2') ? 'success' : 'error'
                        }`}>
                          <div className="response-code-status">
                            {responseStatus}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {loading ? (
                      <div className="response-loading">
                        <Spinner size="medium" text="Получение ответа..." />
                      </div>
                    ) : (
                      <div className="response-body">
                        {responseBody ? (
                          <div dangerouslySetInnerHTML={{ __html: formatJsonSyntax(responseBody) }} />
                        ) : (
                          <div className="no-response">Нет данных</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestApiSimulator;