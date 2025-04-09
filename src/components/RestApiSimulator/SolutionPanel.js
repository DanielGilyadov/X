// src/components/RestApiSimulator/SolutionPanel.js
import React, { useState } from 'react';
import { 
  ArrowRightIcon, 
  ArrowPathIcon, 
  DocumentTextIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Spinner from '../common/Spinner';
import './SolutionPanel.css';

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
  const [history, setHistory] = useState([]);
  
  // Обработчик отправки запроса
  const handleSendRequest = async () => {
    setLoading(true);
    setShowResponse(true);
    
    try {
      // Имитация задержки запроса
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
      const formattedResponse = JSON.stringify(responseData, null, 2);
      setResponseBody(formattedResponse);
      
      // Добавляем запрос в историю
      const newHistoryItem = {
        id: Date.now(),
        method,
        url,
        requestBody: requestBody || null,
        responseStatus: status,
        responseBody: formattedResponse,
        isSuccess: status.startsWith('2')
      };
      
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 4)]);
      
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

  // Функция получения цвета метода
  const getMethodColor = (methodType) => {
    switch(methodType) {
      case 'GET': return 'method-get';
      case 'POST': return 'method-post';
      case 'PUT': return 'method-put';
      case 'DELETE': return 'method-delete';
      case 'PATCH': return 'method-patch';
      default: return '';
    }
  }
  
  // Загрузка запроса из истории
  const loadFromHistory = (item) => {
    setMethod(item.method);
    setUrl(item.url);
    setRequestBody(item.requestBody || '');
    setResponseStatus(item.responseStatus);
    setResponseBody(item.responseBody);
    setShowResponse(true);
  };

  return (
    <div className="solution-wrapper">

    
      <div className="method-selector">
        <div className="method-dropdown">
          <select 
            value={method} 
            onChange={(e) => setMethod(e.target.value)}
            aria-label="HTTP метод"
            className={getMethodColor(method)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>
        
        <div className="url-input-container">
          <input 
            type="text" 
            className="url-input"
            placeholder="/api/users/1" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="URL запроса"
          />
        </div>
        
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
          ) : (
            <>
              <span>Отправить</span>
              <ArrowRightIcon className="send-icon" />
            </>
          )}
        </button>
      </div>
      
      {method !== 'GET' && (
        <div className="request-body">
          <div className="request-body-header">
            <label htmlFor="request-body">Тело запроса</label>
          </div>
          <textarea 
            id="request-body"
            placeholder={
              '{\n  "name": "Имя",\n  "email": "email@example.com"\n}'
            } 
            rows="4"
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
            <h3 className="response-title">
              <DocumentTextIcon className="response-icon" />
              Ответ сервера
            </h3>
            {responseStatus && (
              <div className={`response-code ${
                responseStatus.startsWith('2') ? 'success' : 'error'
              }`}>
                <div className="response-code-status">
                  {responseStatus.startsWith('2') ? (
                    <CheckCircleIcon className="status-icon" />
                  ) : (
                    <ExclamationCircleIcon className="status-icon" />
                  )}
                  <span>{responseStatus}</span>
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
                <pre className="response-json">
                  <div dangerouslySetInnerHTML={{ __html: formatJsonSyntax(responseBody) }} />
                </pre>
              ) : (
                <div className="no-response">Нет данных</div>
              )}
            </div>
          )}
        </div>
      )}
      
      {history.length > 0 && (
        <div className="request-history">
          <div className="history-header">
            <h3 className="history-title">
              <ArrowPathIcon className="history-icon" />
              История запросов
            </h3>
          </div>
          <div className="history-list">
            {history.map(item => (
              <div 
                key={item.id} 
                className={`history-item ${item.isSuccess ? 'success' : 'error'}`}
                onClick={() => loadFromHistory(item)}
              >
                <div className={`history-method ${getMethodColor(item.method)}`}>
                  {item.method}
                </div>
                <div className="history-url">{item.url}</div>
                <div className="history-status">{item.responseStatus}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionPanel;