// src/components/RestApiSimulator/RestApiSimulator.js (с react-resizable-panels)
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import './RestApiSimulator.css';
import Spinner from '../common/Spinner';
import TaskDescription from './TaskDescription';
import SolutionPanel from './SolutionPanel';
import DataTableViewer from './DataTableViewer'; 
import SchemaViewer from './SchemaViewer';
import { 
  Panel, 
  PanelGroup, 
  PanelResizeHandle 
} from "react-resizable-panels";
import { getEtalonsUsers } from '../../services/api';

// Компонент для разделителя панелей
const ResizeHandle = () => (
  <PanelResizeHandle>
    <div className="panel-resize-handle">
      <div className="handle-line"></div>
    </div>
  </PanelResizeHandle>
);

const RestApiSimulator = () => {
  const { exerciseId, categoryId } = useParams();
  const location = useLocation();
  const [exerciseData, setExerciseData] = useState(null);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [etalonsData, setEtalonsData] = useState(null); 
  
  // Загрузка данных упражнения 
  useEffect(() => {
    const loadExerciseData = async () => {
      setLoading(true);

      try {
        // Загружаем эталонные данные таблиц
        const etalonsTable = await getEtalonsUsers();
        console.log("Загружены эталонные данные:", etalonsTable);
        
        // Преобразуем данные в формат для компонента DataTableViewer
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
        <PanelGroup direction="horizontal">
          {/* Левая колонка с заданием */}
          <Panel 
            defaultSize={25} 
            minSize={15}
            className="task-panel"
          >
            <div className="task-column">
              <TaskDescription 
                task={exerciseData.task} 
                isCompleted={taskCompleted} 
              />
            </div>
          </Panel>
          
          <ResizeHandle />
          
          {/* Центральная колонка с решением */}
          <Panel 
            defaultSize={50} 
            minSize={30}
            className="solution-panel"
          >
            <div className="solution-column">
              <SolutionPanel 
                onTaskComplete={handleTaskCompletion}
                onSendRequest={handleSendRequest}
              />
            </div>
          </Panel>
          
          <ResizeHandle />

          {/* Правая колонка со схемой БД */}
          <Panel 
            defaultSize={25} 
            minSize={15}
            className="data-panel"
          >
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
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default RestApiSimulator;