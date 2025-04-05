// src/components/RestApiSimulator/TaskDescription.js
import React from 'react';
import PropTypes from 'prop-types';
import './RestApiSimulator.css';

const TaskDescription = ({ task, isCompleted }) => {
  return (
    <div className="task-column">
      <div className="exercise-task">
        <h2>Задание</h2>
        <div className="task-description">
          <ol>
            <li>{task}</li>
          </ol>
        </div>
        
        {isCompleted && (
          <div className="task-completed">
            <div className="task-completed-icon">✓</div>
            <div className="task-completed-message">
              Задание выполнено успешно!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

TaskDescription.propTypes = {
  task: PropTypes.string.isRequired,
  isCompleted: PropTypes.bool
};

TaskDescription.defaultProps = {
  isCompleted: false
};

export default TaskDescription;