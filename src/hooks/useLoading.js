// src/hooks/useLoading.js
import { useState, useCallback } from 'react';

/**
 * Хук для управления состоянием загрузки
 * @returns {Array} [isLoading, startLoading, stopLoading, withLoading]
 */
const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  
  // Установить состояние загрузки в true
  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);
  
  // Установить состояние загрузки в false
  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);
  
  /**
   * Обертка для асинхронных функций с автоматическим управлением состоянием загрузки
   * @param {Function} asyncFunction - Асинхронная функция для выполнения
   * @returns {Function} - Функция-обертка, которая также возвращает результат исходной функции
   */
  const withLoading = useCallback(
    async (asyncFunction) => {
      setIsLoading(true);
      try {
        const result = await asyncFunction();
        return result;
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  
  return [isLoading, startLoading, stopLoading, withLoading];
};

export default useLoading;