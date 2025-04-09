// src/components/common/ResizableLayout/ResizableLayout.js
import React, { useState, useRef, useEffect } from 'react';
import './ResizableLayout.css';

const ResizableLayout = ({ 
  children, 
  initialWidths = [30, 40, 30], // начальное распределение ширины в процентах
  minWidths = [200, 300, 200],  // минимальные ширины в пикселях
  direction = 'horizontal'      // 'horizontal' или 'vertical'
}) => {
  const [sizes, setSizes] = useState(initialWidths);
  const containerRef = useRef(null);
  const draggingRef = useRef(null);
  const startPosRef = useRef(0);
  const startSizesRef = useRef([...sizes]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggingRef.current === null) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerSize = direction === 'horizontal' ? containerRect.width : containerRect.height;
      
      // Определяем смещение в пикселях
      const delta = direction === 'horizontal'
        ? e.clientX - startPosRef.current
        : e.clientY - startPosRef.current;
      
      // Индекс разделителя, который перетаскивается
      const splitterIndex = draggingRef.current;
      
      // Вычисляем новые размеры
      const newSizes = [...startSizesRef.current];
      
      // Процент, который мы перемещаем
      const percentDelta = (delta / containerSize) * 100;
      
      // Уменьшаем левую панель на percentDelta и увеличиваем правую на такое же значение
      newSizes[splitterIndex] = Math.max(0, startSizesRef.current[splitterIndex] + percentDelta);
      newSizes[splitterIndex + 1] = Math.max(0, startSizesRef.current[splitterIndex + 1] - percentDelta);
      
      // Проверяем минимальные ширины и общую сумму (должна быть равна 100%)
      const pixelSizes = newSizes.map(size => (size / 100) * containerSize);
      
      const leftTooSmall = pixelSizes[splitterIndex] < minWidths[splitterIndex];
      const rightTooSmall = pixelSizes[splitterIndex + 1] < minWidths[splitterIndex + 1];
      
      // Если минимальные размеры соблюдены, обновляем состояние
      if (!leftTooSmall && !rightTooSmall) {
        // Нормализуем все размеры, чтобы их сумма была равна 100%
        const totalSize = newSizes.reduce((acc, size) => acc + size, 0);
        const normalizedSizes = newSizes.map(size => (size / totalSize) * 100);
        
        setSizes(normalizedSizes);
      }
    };
    
    const handleMouseUp = () => {
      draggingRef.current = null;
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        const mouseEvent = {
          clientX: touch.clientX,
          clientY: touch.clientY,
          preventDefault: () => e.preventDefault()
        };
        handleMouseMove(mouseEvent);
      }
    };
    
    const handleTouchEnd = () => {
      handleMouseUp();
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    if (draggingRef.current !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [minWidths, direction, sizes]);
  
  // Обработчик начала перетаскивания
  const handleMouseDown = (index, e) => {
    e.preventDefault();
    draggingRef.current = index;
    startPosRef.current = direction === 'horizontal' ? e.clientX : e.clientY;
    startSizesRef.current = [...sizes];
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
  };
  
  // Обработчик начала перетаскивания на сенсорных устройствах
  const handleTouchStart = (index, e) => {
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      draggingRef.current = index;
      startPosRef.current = direction === 'horizontal' ? touch.clientX : touch.clientY;
      startSizesRef.current = [...sizes];
    }
  };
  
  const layoutStyle = {
    display: 'flex',
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    width: '100%',
    height: '100%',
  };

  // Создаем массив панелей и разделителей
  const elements = [];
  
  React.Children.forEach(children, (child, index) => {
    if (index > 0) {
      // Добавляем разделитель перед каждой панелью, кроме первой
      elements.push(
        <div 
          key={`splitter-${index-1}`}
          className={`splitter ${direction === 'horizontal' ? 'horizontal-splitter' : 'vertical-splitter'}`}
          onMouseDown={(e) => handleMouseDown(index-1, e)}
          onTouchStart={(e) => handleTouchStart(index-1, e)}
        >
          <div className="splitter-handle"></div>
        </div>
      );
    }
    
    // Добавляем панель с соответствующей шириной
    elements.push(
      <div 
        key={`panel-${index}`}
        className="panel"
        style={{ 
          [direction === 'horizontal' ? 'width' : 'height']: `${sizes[index]}%`,
          [direction === 'horizontal' ? 'height' : 'width']: '100%'
        }}
      >
        {child}
      </div>
    );
  });
  
  return (
    <div 
      ref={containerRef}
      className="resizable-layout"
      style={layoutStyle}
    >
      {elements}
    </div>
  );
};

export default ResizableLayout;