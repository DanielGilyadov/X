// src/components/RestApiSimulator/SolutionPanel.js
import React, { useState } from 'react';
import './RestApiSimulator.css';
import Spinner from '../common/Spinner';

// Функция подсветки синтаксиса JSON
const formatJsonSyntax = (jsonString) => {
  if (!jsonString) return '';
  
  try {
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

const SolutionPanel = ({ onTaskComplete, onSendRequest }) => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [responseStatus, setResponseStatus] = useState('');
  const [responseBody, setResponseBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  
  // Обработчик отправки запроса
  const handleSendRequest = async () => {
    setLoading(true);
    setShowResponse(true);
    
    try {
      // Имитация задержки запроса
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Определение ответа в зависимости от запроса
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
            error: "Неверный формат JSON",
            details: e.message
          };
          status = '400 Bad Request';
        }
      } else if (url === '') {
        responseData = {
          error: "URL запроса не указан",
          details: "Укажите URL для выполнения запроса"
        };
        status = '400 Bad Request';
      } else {
        responseData = {
          error: "Ресурс не найден",
          details: `Маршрут ${method} ${url} не существует`
        };
        status = '404 Not Found';
      }
      
      // Устанавливаем статус ответа
      setResponseStatus(status);
      
      // Устанавливаем тело ответа
      setResponseBody(JSON.stringify(responseData, null, 2));
      
      // Проверяем выполнение задания и передаем результат
      const isCompleted = method === 'GET' && url === '/api/users/1' && status.startsWith('2');
      if (isCompleted) {
        onTaskComplete(true);
      }
      
      // Вызываем внешний обработчик, если он предоставлен
      if (onSendRequest) {
        onSendRequest({
          method,
          url,
          requestBody,
          status,
          responseBody: responseData,
          isSuccess: status.startsWith('2')
        });
      }
      
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

  return (
    <div className="solution-column">
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
          placeholder="/api/users/1" 
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
          ) : "Отправить"}
        </button>
      </div>
      
      {method !== 'GET' && (
        <div className="request-body">
          <textarea 
            placeholder={
              '{\n  "name": "Имя",\n  "email": "email@example.com"\n}'
            } 
            rows="3"
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            disabled={method === 'GET'}
            aria-label="Тело запроса"
          ></textarea>
        </div>
      )}
      
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
  );
};

export default SolutionPanel;