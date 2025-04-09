// src/components/RestApiSimulator/DataTableViewer.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDownIcon, ChevronUpIcon, TableCellsIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import './DataTableViewer.css';

const DataTableViewer = ({ tables }) => {
  const [expandedTables, setExpandedTables] = useState({});
  const [tableData, setTableData] = useState(null);
  
  useEffect(() => {
    // Если таблицы переданы, инициализируем первую таблицу как раскрытую
    if (tables) {
      if (Array.isArray(tables)) {
        setExpandedTables({ 'default': true });
        setTableData({ 'default': tables });
      } else {
        const firstTableKey = Object.keys(tables)[0];
        if (firstTableKey) {
          setExpandedTables({ [firstTableKey]: true });
          setTableData(tables);
        }
      }
    }
  }, [tables]);
  
  const toggleTableVisibility = (tableName) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };
  
  // Функция для форматирования значения ячейки
  const formatCellValue = (value) => {
    if (value === null || value === undefined) return <span className="null-value">NULL</span>;
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
  };

  const renderTable = (tableName, data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <div className="empty-table-message">
          <InformationCircleIcon className="empty-icon" />
          <p>Нет данных для отображения</p>
        </div>
      );
    }

    const columns = Object.keys(data[0]);

    return (
      <div className="data-table-wrapper" key={tableName}>
        <div className="data-table-header" onClick={() => toggleTableVisibility(tableName)}>
          <div className="table-info">
            <TableCellsIcon className="table-icon" />
            <h3 className="table-name">{tableName}</h3>
            <span className="table-count">{data.length} строк</span>
          </div>
          {expandedTables[tableName] ? (
            <ChevronUpIcon className="toggle-icon" />
          ) : (
            <ChevronDownIcon className="toggle-icon" />
          )}
        </div>
        
        {expandedTables[tableName] && (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map(column => (
                    <th key={column}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'even-row' : 'odd-row'}>
                    {columns.map(column => (
                      <td key={`${rowIndex}-${column}`} className={typeof row[column] === 'number' ? 'number-cell' : ''}>
                        {formatCellValue(row[column])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  if (!tableData) {
    return (
      <div className="data-tables-message">
        <InformationCircleIcon className="empty-icon" />
        <p>Нет доступных данных</p>
      </div>
    );
  }

  return (
    <div className="data-tables-container">
      {Array.isArray(tableData) ? (
        renderTable('default', tableData)
      ) : (
        Object.entries(tableData).map(([tableName, tableContent]) => 
          renderTable(tableName, tableContent)
        )
      )}
    </div>
  );
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