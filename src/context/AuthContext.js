// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функция для проверки действительности токена
  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      // Получаем payload из токена (часть между первой и второй точкой)
      const payload = token.split('.')[1];
      // Декодируем из base64
      const decodedPayload = JSON.parse(atob(payload));
      // Получаем время экспирации (в секундах)
      const exp = decodedPayload.exp;
      // Проверяем, не истек ли срок действия токена
      return Date.now() < exp * 1000;
    } catch (error) {
      console.error('Ошибка при проверке токена:', error);
      return false;
    }
  };

  // Декодирование информации из токена
  const decodeToken = (token) => {
    if (!token) return null;
    
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Ошибка при декодировании токена:', error);
      return null;
    }
  };

  // Загрузка пользователя из localStorage при инициализации
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Проверяем валидность токена перед установкой пользователя
      if (userData.token && isTokenValid(userData.token)) {
        setUser(userData);
      } else {
        // Если токен недействителен, выполняем выход
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Функция для авторизации пользователя
  const login = (userData) => {
    // Устанавливаем стандартные значения, если они не определены
    const enhancedUserData = {
      subscription: 'free',
      ...userData
    };
    
    localStorage.setItem('user', JSON.stringify(enhancedUserData));
    setUser(enhancedUserData);
  };

  // Функция для выхода из системы
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Проверка, авторизован ли пользователь
  const isAuthenticated = () => {
    return !!user && !!user.token && isTokenValid(user.token);
  };

  // Получение информации из токена
  const getTokenInfo = () => {
    if (user && user.token) {
      return decodeToken(user.token);
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated, 
        loading,
        getTokenInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста авторизации
export const useAuth = () => useContext(AuthContext);

export default AuthContext;