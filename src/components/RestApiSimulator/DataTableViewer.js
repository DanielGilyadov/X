// src/components/RestApiSimulator/DataTableViewer.js
import React from 'react';
import PropTypes from 'prop-types';
import './DataTableViewer.css'; // Мы создадим этот файл отдельно

const DataTableViewer = ({ tables }) => {
  // Проверяем, есть ли данные для отображения
  if (!tables || Object.keys(tables).length === 0) {
    return (
      <div className="data-tables-container">
        <div className="data-table-empty">
          <div className="data-table-empty-icon">📊</div>
          <p>Данные будут отображены здесь</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-tables-container">
      <h3 className="data-tables-title">Доступные таблицы</h3>
      
      {Object.entries(tables).map(([tableName, tableData], tableIndex) => (
        <div className="data-table-box" key={tableIndex}>
          <div className="data-table-header">
            <h4 className="data-table-name">{tableName}</h4>
          </div>
          <div className="data-table-content">
            {Array.isArray(tableData) && tableData.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    {Object.keys(tableData[0]).map((column, colIndex) => (
                      <th key={colIndex}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <td key={cellIndex}>
                          {cell === null ? 'NULL' : 
                           typeof cell === 'object' ? JSON.stringify(cell) : 
                           String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="data-table-empty">Таблица пуста или неверный формат данных</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

DataTableViewer.propTypes = {
  tables: PropTypes.object
};

DataTableViewer.defaultProps = {
  tables: {}
};

export default DataTableViewer;