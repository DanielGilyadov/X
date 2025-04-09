// src/components/RestApiSimulator/DataTableViewer.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import './DataTableViewer.css';

const DataTableViewer = ({ tables }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const renderTableContent = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const columns = Object.keys(data[0]);

    return (
      <div className="data-table-container">
        <table className="min-w-full">
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map(column => (
                  <td key={`${rowIndex}-${column}`}>
                    {typeof row[column] === 'object' 
                      ? JSON.stringify(row[column]) 
                      : String(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (!tables) {
    return <div className="data-tables-wrapper">Нет данных</div>;
  }

  // Если tables - это массив, отображаем одну таблицу
  if (Array.isArray(tables)) {
    return (
      <div className="data-tables-wrapper">
        <div className="data-table-section">
          <button
            className="data-table-toggle"
            onClick={toggleVisibility}
          >
            <span className="font-medium">База данных</span>
            {isVisible ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
          {isVisible && renderTableContent(tables)}
        </div>
      </div>
    );
  }


};

DataTableViewer.propTypes = {
  tables: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ])
};

DataTableViewer.defaultProps = {
  tables: null
};

export default DataTableViewer;