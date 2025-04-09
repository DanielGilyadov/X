// src/components/RestApiSimulator/RestApiSimulator.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  Panel, 
  PanelGroup
} from "react-resizable-panels";
import { 
  LightBulbIcon, 
  CheckIcon, 
  ArrowPathIcon, 
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
import './RestApiSimulator.css';
import './EnhancedPanels.css'; // Подключаем новые стили для панелей
import Spinner from '../common/Spinner';
import TaskDescription from './TaskDescription';
import SolutionPanel from './SolutionPanel';
import DataTableViewer from './DataTableViewer'; 
import SchemaViewer from './SchemaViewer';
import EnhancedResizeHandle from './EnhancedPanelResizer';
import { getEtalonsUsers } from '../../services/api';

const RestApiSimulator = () => {
  const { exerciseId, categoryId } = useParams();
  const location = useLocation();
  const [exerciseData, setExerciseData] = useState(null);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [etalonsData, setEtalonsData] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('database');
  
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
    if (completed && !showSuccessMessage) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
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
      
      {showSuccessMessage && (
        <div className="success-notification">
          <CheckIcon className="success-icon" />
          <span>Отлично! Вы успешно выполнили задание!</span>
          <button onClick={() => setShowSuccessMessage(false)} className="close-notification">×</button>
        </div>
      )}
      
      <div className="rest-api-simulator panels-container">
        <PanelGroup direction="horizontal" className="panel-animation">
          {/* Левая колонка с заданием */}
          <Panel 
            defaultSize={25} 
            minSize={15}
            className="panel task-panel"
          >
            <div className="panel-content task-column">
              <TaskDescription 
                task={exerciseData.task} 
                isCompleted={taskCompleted} 
              />
              
            </div>
          </Panel>
          
          <EnhancedResizeHandle />
          
          {/* Центральная колонка с решением */}
          <Panel 
            defaultSize={45} 
            minSize={30}
            className="panel solution-panel"
          >
            <div className="panel-content solution-column">
              <SolutionPanel 
                onTaskComplete={handleTaskCompletion}
                onSendRequest={handleSendRequest}
              />
            </div>
          </Panel>
          
          <EnhancedResizeHandle />

          {/* Правая колонка со схемой БД */}
          <Panel 
            defaultSize={30} 
            minSize={15}
            className="panel data-panel"
          >
            <div className="panel-content data-column">
              {etalonsData && (
                <div className="database-view">
                  <div className="database-tabs">
                    <button 
                      className={`database-tab ${activeTab === 'database' ? 'active' : ''}`}
                      onClick={() => setActiveTab('database')}
                    >
                      Схема
                    </button>
                    <button 
                      className={`database-tab ${activeTab === 'data' ? 'active' : ''}`}
                      onClick={() => setActiveTab('data')}
                    >
                      Данные
                    </button>
                  </div>
                  
                  <div className="database-view-content">
                    {activeTab === 'database' && (
                      <SchemaViewer tables={etalonsData} />
                    )}
                    
                    {activeTab === 'data' && (
                      <DataTableViewer tables={etalonsData} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
      
      {taskCompleted && (
        <div className="next-exercise">
          <button className="next-exercise-button">
            <span>Следующее упражнение</span>
            <ChevronRightIcon className="next-icon" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RestApiSimulator;