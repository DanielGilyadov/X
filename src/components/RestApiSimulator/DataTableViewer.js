// src/components/RestApiSimulator/DataTableViewer.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  TableCellsIcon, 
  InformationCircleIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import './DataTableViewer.css';

const ROWS_PER_PAGE = 10;

const DataTableViewer = ({ tables }) => {
  const [expandedTables, setExpandedTables] = useState({});
  const [tableData, setTableData] = useState(null);
  const [fullscreenTable, setFullscreenTable] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({});
  const [filteredData, setFilteredData] = useState({});
  
  useEffect(() => {
    // Если таблицы переданы, инициализируем первую таблицу как раскрытую
    if (tables) {
      if (Array.isArray(tables)) {
        setExpandedTables({ 'default': true });
        setTableData({ 'default': tables });
        // Инициализация пагинации
        setPagination({ 'default': { currentPage: 1 } });
      } else {
        const firstTableKey = Object.keys(tables)[0];
        if (firstTableKey) {
          setExpandedTables({ [firstTableKey]: true });
          setTableData(tables);
          
          // Инициализация пагинации для всех таблиц
          const initialPagination = {};
          Object.keys(tables).forEach(tableName => {
            initialPagination[tableName] = { currentPage: 1 };
          });
          setPagination(initialPagination);
        }
      }
    }
  }, [tables]);
  
  // Эффект для обработки поиска и фильтрации данных
  useEffect(() => {
    if (!tableData) return;
    
    const newFilteredData = {};
    
    // Обработка для каждой таблицы
    Object.entries(tableData).forEach(([tableName, data]) => {
      if (!Array.isArray(data) || data.length === 0) {
        newFilteredData[tableName] = [];
        return;
      }
      
      // Фильтрация данных по поисковому запросу
      let filtered = data;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = data.filter(row => {
          return Object.values(row).some(value => {
            if (value === null || value === undefined) return false;
            return String(value).toLowerCase().includes(query);
          });
        });
      }
      
      // Получаем текущую страницу для таблицы
      const currentPage = pagination[tableName]?.currentPage || 1;
      
      // Вычисляем общее количество страниц
      const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
      
      // Обновляем информацию о пагинации для этой таблицы
      setPagination(prev => ({
        ...prev,
        [tableName]: { 
          ...prev[tableName], 
          totalPages, 
          totalRows: filtered.length,
          filteredData: filtered 
        }
      }));
      
      // Если мы в полноэкранном режиме, показываем все данные
      if (fullscreenTable === tableName) {
        newFilteredData[tableName] = filtered;
      } else {
        // В противном случае применяем пагинацию
        const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
        newFilteredData[tableName] = filtered.slice(startIndex, startIndex + ROWS_PER_PAGE);
      }
    });
    
    setFilteredData(newFilteredData);
  }, [tableData, searchQuery, pagination, fullscreenTable]);
  
  const toggleTableVisibility = (tableName) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };
  
  const toggleFullscreen = (tableName) => {
    if (fullscreenTable === tableName) {
      setFullscreenTable(null);
    } else {
      setFullscreenTable(tableName);
      // Когда входим в полноэкранный режим, всегда раскрываем таблицу
      setExpandedTables(prev => ({
        ...prev,
        [tableName]: true
      }));
    }
  };
  
  // Функция для форматирования значения ячейки
  const formatCellValue = (value) => {
    if (value === null || value === undefined) return <span className="null-value">NULL</span>;
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
  };
  
  // Переход на следующую/предыдущую страницу
  const changePage = (tableName, page) => {
    setPagination(prev => ({
      ...prev,
      [tableName]: { ...prev[tableName], currentPage: page }
    }));
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
    const currentPage = pagination[tableName]?.currentPage || 1;
    const totalPages = pagination[tableName]?.totalPages || 1;
    const totalRows = pagination[tableName]?.totalRows || data.length;
    
    // Определяем, находится ли таблица в полноэкранном режиме
    const isFullscreen = fullscreenTable === tableName;
    
    // Используем уже отфильтрованные данные из состояния
    const displayData = filteredData[tableName] || [];

    return (
      <div 
        className={`data-table-wrapper ${isFullscreen ? 'fullscreen' : ''}`} 
        key={tableName}
      >
        <div className="data-table-header" onClick={() => toggleTableVisibility(tableName)}>
          <div className="table-info">
            <TableCellsIcon className="table-icon" />
            <h3 className="table-name">{tableName}</h3>
            <span className="table-count">{data.length} строк</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              className="fullscreen-button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen(tableName);
              }}
              title={isFullscreen ? "Выйти из полноэкранного режима" : "Развернуть на весь экран"}
            >
              {isFullscreen ? 
                <ArrowsPointingInIcon className="fullscreen-icon" /> : 
                <ArrowsPointingOutIcon className="fullscreen-icon" />
              }
            </button>
            {expandedTables[tableName] ? (
              <ChevronUpIcon className="toggle-icon open" />
            ) : (
              <ChevronDownIcon className="toggle-icon" />
            )}
          </div>
        </div>
        
        {expandedTables[tableName] && (
          <>
            <div className="table-controls">
              <div className="table-search">
                <MagnifyingGlassIcon className="search-icon" />
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {!isFullscreen && (
                <div className="table-pagination">
                  <button 
                    className="pagination-button"
                    disabled={currentPage <= 1}
                    onClick={() => changePage(tableName, currentPage - 1)}
                  >
                    <ChevronLeftIcon width={16} height={16} />
                  </button>
                  <span className="pagination-info">
                    {currentPage} из {totalPages} (всего {totalRows})
                  </span>
                  <button 
                    className="pagination-button"
                    disabled={currentPage >= totalPages}
                    onClick={() => changePage(tableName, currentPage + 1)}
                  >
                    <ChevronRightIcon width={16} height={16} />
                  </button>
                </div>
              )}
            </div>
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
                  {displayData.map((row, rowIndex) => (
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
          </>
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