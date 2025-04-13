import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useSearchParams } from 'react-router-dom';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { ChevronRightIcon, ForwardIcon } from '@heroicons/react/24/outline';

import './RestApiSimulator.css';
import './EnhancedPanels.css';

import Spinner from '../common/Spinner';
import TaskDescription from './TaskDescription';
import SolutionPanel from './SolutionPanel';
import DataTableViewer from './DataTableViewer';
import SchemaViewer from './SchemaViewer';
import EnhancedResizeHandle from './EnhancedPanelResizer';

import { 
  getEtalonsUsers, 
  getRestSimpleRandomTasks, 
  getEtalonsBooks, 
  getEtalonsFlights 
} from '../../services/api';

/**
 * RestApiSimulator компонент - симулятор REST API для выполнения упражнений
 */
const RestApiSimulator = () => {
  // Параметры маршрута и состояния
  const { exerciseId, categoryId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const difficulty = searchParams.get('difficulty');

  // Состояния компонента
  const [exerciseData, setExerciseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [etalonsData, setEtalonsData] = useState(null);
  const [activeTab, setActiveTab] = useState('database');

  /**
   * Возвращает заголовок категории на основе ID категории
   * @returns {string} Заголовок категории
   */
  const getCategoryTitle = () => {
    const categoryTitles = {
      'rests': 'REST интеграции'
    };
    return categoryTitles[categoryId] || categoryId || 'REST интеграции';
  };

  /**
   * Получает соответствующие эталонные данные в зависимости от типа таблицы
   * @param {string} tableType - Тип таблицы ('users', 'books', 'flights')
   * @returns {Promise<Object>} Эталонные данные
   */
  const fetchEtalonsData = async (tableType) => {
    let etalonsTable;
    
    switch(tableType) {
      case 'users':
        etalonsTable = await getEtalonsUsers();
        break;
      case 'books':
        etalonsTable = await getEtalonsBooks();
        break;
      case 'flights':
        etalonsTable = await getEtalonsFlights();
        break;
      default:
        etalonsTable = null;
    }
    
    if (etalonsTable) {
      // Форматируем данные в зависимости от структуры ответа API
      return Array.isArray(etalonsTable) 
        ? { [tableType]: etalonsTable } 
        : etalonsTable;
    }
    
    return null;
  };

  // Загрузка данных упражнения и эталонных данных
  useEffect(() => {
    const loadExercise = async () => {
      setLoading(true);
      
      try {
        if (difficulty === 'easy') {
          // Загружаем задание
          const task = await getRestSimpleRandomTasks();
          setExerciseData(task);
          console.log(task)
          // Загружаем эталонные данные в зависимости от типа таблицы
          if (task.table) {
            const etalonsData = await fetchEtalonsData(task.table);
            setEtalonsData(etalonsData);
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке упражнения:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [exerciseId, location.state, difficulty]);

  /**
   * Обработчик отправки запроса
   * @param {Object} requestData - Данные запроса
   */
  const handleSendRequest = (requestData) => {
    console.log('Отправлен запрос:', requestData);
    // Здесь может быть дополнительная логика обработки запроса
  };

  // Обработчики для кнопок футера
  const handleNextExercise = () => {
    console.log('Переход к следующему упражнению');
    // Здесь может быть логика перехода к следующему упражнению
  };

  const handleSkipExercise = () => {
    console.log('Пропуск упражнения');
    // Здесь может быть логика пропуска упражнения
  };

  // Показываем спиннер во время загрузки
  if (loading || !exerciseData) {
    return (
      <div className="fullscreen-page">
        <div className="loading-container">
          <Spinner size="large" text="Загрузка упражнения..." />
        </div>
      </div>
    );
  }

  return (
    <div className="fullscreen-page">
      {/* Навигационные хлебные крошки */}
      <div className="breadcrumbs">
        <Link to="/exercises">Упражнения</Link>
        <Link to={`/exercises/${categoryId}`}>{getCategoryTitle()}</Link> / {exerciseData.taskText || `task${exerciseId}`}
      </div>

      <div className="simulator-panels">
        <PanelGroup direction="horizontal" className="panel-animation">
          {/* Панель с описанием задания */}
          <Panel defaultSize={25} minSize={15} className="panel task-panel">
            <div className="panel-content task-column">
              <TaskDescription 
                task={exerciseData.taskText} 
              />
            </div>
          </Panel>

          <EnhancedResizeHandle />
          {/* Панель решения */}
          <Panel defaultSize={45} minSize={30} className="panel solution-panel">
            <div className="panel-content solution-column">
              <SolutionPanel 
                onSendRequest={handleSendRequest} 
              />
            </div>
          </Panel>
          <EnhancedResizeHandle />

          {/* Панель данных/схемы */}
          <Panel defaultSize={30} minSize={15} className="panel data-panel">
            <div className="panel-content data-column">
              {etalonsData && (
                <div className="database-view">
                  {/* Вкладки для переключения между схемой и данными */}
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

                  {/* Содержимое вкладок */}
                  <div className="database-view-content">
                    {activeTab === 'database' && <SchemaViewer tables={etalonsData} />}
                    {activeTab === 'data' && <DataTableViewer tables={etalonsData} />}
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
        
      {/* Футер с кнопками навигации */}
      <div className="simulator-footer">
        <div className="footer-container">
          <button className="skip-button" onClick={handleSkipExercise}>
            <span>Пропустить</span>
            <ForwardIcon className="skip-icon" />
          </button>
          <button className="next-exercise-button" onClick={handleNextExercise}>
            <span>Следующее упражнение</span>
            <ChevronRightIcon className="next-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestApiSimulator;