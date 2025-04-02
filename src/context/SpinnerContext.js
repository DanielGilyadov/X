// src/context/SpinnerContext.js
import React, { createContext, useContext, useState } from 'react';
import Spinner from '../components/common/Spinner';

// Создаем контекст для управления спиннером
const SpinnerContext = createContext();

/**
 * Провайдер контекста спиннера
 * Упрощенная версия, которая избегает двойных спиннеров
 */
export const SpinnerProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Загрузка...');

  // Показать глобальный спиннер
  const showSpinner = (text = 'Загрузка...') => {
    setMessage(text);
    setLoading(true);
  };

  // Скрыть глобальный спиннер
  const hideSpinner = () => {
    setLoading(false);
  };

  // Выполнить асинхронную функцию с отображением спиннера
  const withSpinner = async (asyncFn, text = 'Загрузка...') => {
    showSpinner(text);
    try {
      return await asyncFn();
    } finally {
      hideSpinner();
    }
  };

  return (
    <SpinnerContext.Provider
      value={{
        showSpinner,
        hideSpinner,
        withSpinner,
        isLoading: loading
      }}
    >
      {children}
      {loading && <Spinner overlay size="large" text={message} />}
    </SpinnerContext.Provider>
  );
};

// Хук для использования контекста спиннера
export const useSpinner = () => {
  const context = useContext(SpinnerContext);
  if (!context) {
    throw new Error('useSpinner должен использоваться внутри SpinnerProvider');
  }
  return context;
};

export default SpinnerContext;