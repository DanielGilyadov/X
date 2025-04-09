// src/components/RestApiSimulator/TaskDescription.js
import React, { useState } from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  AcademicCapIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import './TaskDescription.css';

const TaskDescription = ({ task, isCompleted }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`task-container ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="task-header" onClick={toggleExpanded}>
        <h3 className="task-title">
          <AcademicCapIcon className="task-icon" />
          Задание
        </h3>
        <button className="task-toggle" aria-label="Переключить отображение задания">
          {expanded ? <ChevronUpIcon className="toggle-icon" /> : <ChevronDownIcon className="toggle-icon" />}
        </button>
      </div>
      
      <div className="task-content">
        <div className="task-description">
          {task}
        </div>
        
        {isCompleted && (
          <div className="task-completed">
            <CheckCircleIcon className="task-completed-icon" />
            <span className="task-completed-message">
              Задание выполнено!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDescription;