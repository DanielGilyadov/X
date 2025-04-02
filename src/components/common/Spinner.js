// src/components/common/Spinner.js
import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 'medium', overlay = false, text = 'Загрузка...' }) => {
  // Определяем размер спиннера
  const spinnerSizeClass = `spinner-${size}`;
  
  // Если overlay=true, спиннер будет на полупрозрачном фоне поверх контента
  if (overlay) {
    return (
      <div className="spinner-overlay">
        <div className={`spinner ${spinnerSizeClass}`}>
          <div className="spinner-circle"></div>
          {text && <div className="spinner-text">{text}</div>}
        </div>
      </div>
    );
  }
  
  // Стандартный вид спиннера без оверлея
  return (
    <div className={`spinner ${spinnerSizeClass}`}>
      <div className="spinner-circle"></div>
      {text && <div className="spinner-text">{text}</div>}
    </div>
  );
};

export default Spinner;