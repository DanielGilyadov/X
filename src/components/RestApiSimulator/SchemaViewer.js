import React from 'react';
import PropTypes from 'prop-types';
import { KeyIcon } from '@heroicons/react/24/solid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './SchemaViewer.css';

const SchemaViewer = ({ tables }) => {
  const renderField = (fieldName, fieldType, isPrimaryKey = false) => (
    <div key={fieldName} className="schema-field">
      <div className="schema-field-name">
        {isPrimaryKey && <KeyIcon className="schema-key-icon" />}
        {fieldName}
      </div>
      <div className="schema-field-type">{fieldType}</div>
    </div>
  );

  const renderTable = (tableName, fields) => (
    <div key={tableName} className="schema-table">
      <div className="schema-table-header">
        <div className="schema-table-name">{tableName}</div>
      </div>
      <div className="schema-table-content">
        {Object.entries(fields).map(([fieldName, fieldType]) =>
          renderField(fieldName, fieldType, fieldName === 'id')
        )}
      </div>
    </div>
  );

  if (!tables || typeof tables !== 'object') {
    return null;
  }

  // Преобразуем данные таблицы в схему
  const schema = Object.entries(tables).reduce((acc, [tableName, tableData]) => {
    if (!Array.isArray(tableData) || tableData.length === 0) return acc;
    
    const firstRow = tableData[0];
    const columns = Object.keys(firstRow).reduce((cols, key) => {
      let type = typeof firstRow[key];
      if (type === 'number') {
        type = Number.isInteger(firstRow[key]) ? 'INTEGER' : 'DECIMAL';
      } else {
        type = type.toUpperCase();
      }
      cols[key] = type;
      return cols;
    }, {});

    acc[tableName] = columns;
    return acc;
  }, {});

  return (
    <div className="database-schema">
      <TransformWrapper
        initialScale={0.8}
        minScale={0.4}
        maxScale={2}
        centerOnInit={true}
        initialPositionX={0}
        initialPositionY={0}
        wheel={{ wheelEnabled: true }}
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
            maxWidth: "800px",
            margin: "0 auto"
          }}
        >
          <div className="schema-content">
            {Object.entries(schema).map(([tableName, fields]) =>
              renderTable(tableName, fields)
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

SchemaViewer.propTypes = {
  tables: PropTypes.object
};

export default SchemaViewer; 