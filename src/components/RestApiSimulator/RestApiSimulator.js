// src/components/RestApiSimulator/RestApiSimulator.js (обновленный)
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import './RestApiSimulator.css';
import Spinner from '../common/Spinner';
import TaskDescription from './TaskDescription';
import SolutionPanel from './SolutionPanel';
import DataTableViewer from './DataTableViewer'; // Импортируем новый компонент
import { getEtalonsUsers } from '../../services/api';
import SchemaViewer from './SchemaViewer';

const RestApiSimulator = () => {
  const { exerciseId, categoryId } = useParams();
  const location = useLocation();
  const [exerciseData, setExerciseData] = useState(null);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [etalonsData, setEtalonsData] = useState(null); // Добавляем состояние для данных таблиц
  
  // Загрузка данных упражнения 
  useEffect(() => {
    const loadExerciseData = async () => {
      setLoading(true);

      try {
        // Загружаем эталонные данные таблиц
        const etalonsTable = await getEtalonsUsers();
        console.log("Загружены эталонные данные:", etalonsTable);
        
        // Преобразуем данные в формат для компонента DataTableViewer
        // Предполагаем, что ответ API уже имеет нужную структуру - объект с именами таблиц и массивами данных
        if (etalonsTable) {
          // Если в ответе уже объект с именованными таблицами, используем его как есть
          if (typeof etalonsTable === 'object' && !Array.isArray(etalonsTable)) {
            setEtalonsData(etalonsTable);
          } 
          // Если в ответе массив, создаем объект с одной таблицей "users"
          else if (Array.isArray(etalonsTable)) {
            setEtalonsData({ 'users': etalonsTable });
          }
        }
        
        // Если данные были переданы через навигацию
        if (location.state?.exerciseId) {
          setExerciseData({
            id: location.state.exerciseId,
            title: location.state.exerciseTitle,
            task: 'Выполните GET запрос для получения данных пользователя с ID 1. Используйте URL /api/users/1'
          });
        } else {
          // Логика загрузки данных по ID
          console.log('Загрузка данных упражнения для ID:', exerciseId);
          
          // Имитация задержки
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Пример загрузки данных
          setExerciseData({
            id: exerciseId,
            title: `Упражнение ${exerciseId}: REST API`,
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

  // Обработчик успешного выполнения задания
  const handleTaskCompletion = (completed) => {
    setTaskCompleted(completed);
  };

  // Обработчик отправки запроса (для логирования или других действий)
  const handleSendRequest = (requestData) => {
    console.log('Отправлен запрос:', requestData);
  };

  if (!exerciseData) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Spinner size="large" text="Загрузка упражнения..." />
      </div>
    );
  }

  return (
    <div className="page full-width-page">
      <div className="breadcrumbs">
        <Link to="/exercises">Упражнения</Link> 
        <Link to={`/exercises/${categoryId || 'Rest'}`}>
          {categoryId ? (categoryId === 'rests' ? 'REST интеграции' : categoryId) : 'REST интеграции'}
        </Link> {' / '}
        {exerciseData.title || `task${exerciseId}`}
      </div>
      
      <h1>{exerciseData.title}</h1>
      
      <div className="rest-api-simulator">
        <div className="simulator-layout">
          {/* Левая колонка с заданием */}
          <div className="task-column">
            <TaskDescription 
              task={exerciseData.task} 
              isCompleted={taskCompleted} 
            />
          </div>
          
          {/* Центральная колонка с решением */}
          <div className="solution-column">
            <SolutionPanel 
              onTaskComplete={handleTaskCompletion}
              onSendRequest={handleSendRequest}
            />
          </div>

          {/* Правая колонка со схемой БД */}
          <div className="data-column">
            {etalonsData && (
              <div className="database-view">
                <div className="database-view-header">
                  <h3>База данных</h3>
                </div>
                <div className="database-view-content">
                  {/* Схема БД */}
                  <div className="database-view-schema">
                    <SchemaViewer tables={etalonsData} />
                  </div>
                  {/* Таблица с данными */}
                  <div className="database-view-data">
                    <DataTableViewer tables={etalonsData} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestApiSimulator;