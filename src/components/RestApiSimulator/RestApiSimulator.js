import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useSearchParams } from 'react-router-dom';
import {
  Panel,
  PanelGroup
} from 'react-resizable-panels';
import {
  CheckIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

import './RestApiSimulator.css';
import './EnhancedPanels.css';

import Spinner from '../common/Spinner';
import TaskDescription from './TaskDescription';
import SolutionPanel from './SolutionPanel';
import DataTableViewer from './DataTableViewer';
import SchemaViewer from './SchemaViewer';
import EnhancedResizeHandle from './EnhancedPanelResizer';

import { getEtalonsUsers, getRestSimpleRandomTasks, getEtalonsBooks, getEtalonsFlights } from '../../services/api';

const RestApiSimulator = () => {
  const { exerciseId, categoryId } = useParams();
  const location = useLocation();

  const [exerciseData, setExerciseData] = useState(null);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [etalonsData, setEtalonsData] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('database');
  const [searchParams] = useSearchParams();
  const difficulty = searchParams.get('difficulty');

  // Хелпер для получения заголовка категории
  const getCategoryTitle = () => {
    if (categoryId === 'rests') return 'REST интеграции';
    return categoryId || 'REST интеграции';
  };

  // Загрузка данных
  useEffect(() => {
    const loadExercise = async () => {
      setLoading(true);
      try {
        if(difficulty === 'easy'){
          const task = await getRestSimpleRandomTasks();
          setExerciseData(task)
          console.log(task)

          if(task.table === 'users'){
            const etalonsTable = await getEtalonsUsers();

            if (etalonsTable) {
              const formattedData = Array.isArray(etalonsTable)
                ? { users: etalonsTable }
                : etalonsTable;
              setEtalonsData(formattedData);
            }

          } else if (task.table === 'books'){
            const etalonsTable = await getEtalonsBooks();

            if (etalonsTable) {
              const formattedData = Array.isArray(etalonsTable)
                ? { users: etalonsTable }
                : etalonsTable;
              setEtalonsData(formattedData);
            }

          } else {

            const etalonsTable = await getEtalonsFlights();

            if (etalonsTable) {
              const formattedData = Array.isArray(etalonsTable)
                ? { users: etalonsTable }
                : etalonsTable;
              setEtalonsData(formattedData);
            }
          }

        }
      } catch (error) {
        console.error('Ошибка при загрузке упражнения:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [exerciseId, location.state]);

  const handleTaskCompletion = (completed) => {
    setTaskCompleted(completed);
    if (completed && !showSuccessMessage) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  };

  const handleSendRequest = (requestData) => {
    console.log('Отправлен запрос:', requestData);
  };

  if (loading || !exerciseData) {
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
        <Link to={`/exercises/${categoryId}`}>{getCategoryTitle()}</Link> / {exerciseData.taskText || `task${exerciseId}`}
      </div>

      {showSuccessMessage && (
        <div className="success-notification">
          <CheckIcon className="success-icon" />
          <span>Отлично! Вы успешно выполнили задание!</span>
          <button className="close-notification" onClick={() => setShowSuccessMessage(false)}>×</button>
        </div>
      )}

      <div className="rest-api-simulator panels-container">
        <PanelGroup direction="horizontal" className="panel-animation">
          {/* Task Panel */}
          <Panel defaultSize={25} minSize={15} className="panel task-panel">
            <div className="panel-content task-column">
              <TaskDescription task={exerciseData.taskText} isCompleted={taskCompleted} />
            </div>
          </Panel>

          <EnhancedResizeHandle />

          {/* Solution Panel */}
          <Panel defaultSize={45} minSize={30} className="panel solution-panel">
            <div className="panel-content solution-column">
              <SolutionPanel onTaskComplete={handleTaskCompletion} onSendRequest={handleSendRequest} />
            </div>
          </Panel>

          <EnhancedResizeHandle />

          {/* Schema/Data Panel */}
          <Panel defaultSize={30} minSize={15} className="panel data-panel">
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
                    {activeTab === 'database' && <SchemaViewer tables={etalonsData} />}
                    {activeTab === 'data' && <DataTableViewer tables={etalonsData} />}
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
