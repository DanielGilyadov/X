// src/components/RestApiSimulator/TaskDescription.js
import React, { useState } from 'react';
import './RestApiSimulator.css';

const TaskDescription = ({ task, isCompleted }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="task-container">
      <div className="task-header" onClick={toggleExpanded}>
        <h3 className="task-title">Задание</h3>
        <button className="task-toggle">
          {expanded ? '−' : '+'}
        </button>
      </div>
      
      {expanded && (
        <div className="task-content">
          <div className="task-description">
            {task}
          </div>
          
          {isCompleted && (
            <div className="task-completed">
              <div className="task-completed-icon">✓</div>
              <span className="task-completed-message">
                Задание выполнено!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskDescription;