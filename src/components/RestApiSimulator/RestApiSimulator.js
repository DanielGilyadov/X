// src/components/RestApiSimulator/RestApiSimulator.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import './RestApiSimulator.css';
import Spinner from '../common/Spinner';
import TaskDescription from './TaskDescription';
import SolutionPanel from './SolutionPanel';
import { getEtalonsUsers } from '../../services/api';

const RestApiSimulator = () => {
  const { exerciseId, categoryId } = useParams();
  const location = useLocation();
  const [exerciseData, setExerciseData] = useState(null);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Загрузка данных упражнения 
  useEffect(() => {
    const loadExerciseData = async () => {
      setLoading(true);

        const etalonsTable = await getEtalonsUsers();
        console.log(etalonsTable);
      
      try {
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
        <div className="api-controls">
          <div className="simulator-layout">
            {/* Компонент задания */}
            <TaskDescription 
              task={exerciseData.task} 
              isCompleted={taskCompleted} 
            />
            
            {/* Компонент решения */}
            <SolutionPanel 
              onTaskComplete={handleTaskCompletion}
              onSendRequest={handleSendRequest}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestApiSimulator;