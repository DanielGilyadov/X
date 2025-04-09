// src/components/RestApiSimulator/EnhancedPanelResizer.js
import React from 'react';
import { PanelResizeHandle } from "react-resizable-panels";

// Улучшенный компонент-разделитель для панелей
const EnhancedResizeHandle = ({ className, ...props }) => (
  <PanelResizeHandle className={`panel-resize-handle ${className || ''}`} {...props}>
    <div className="handle-dots">
      <span className="handle-dot"></span>
      <span className="handle-dot"></span>
      <span className="handle-dot"></span>
    </div>
  </PanelResizeHandle>
);

export default EnhancedResizeHandle;