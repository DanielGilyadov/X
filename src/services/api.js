// src/services/api.js
import axios from "axios";

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: "/api", // Базовый URL для всех запросов
});

// Добавляем интерцептор запросов для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    // Получаем токен из localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const { token } = JSON.parse(userData);
      // Если токен есть, добавляем его в заголовок Authorization
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API пути
const API_REG_USERS = "/register",
      API_CHECK_EMAIL = `${API_REG_USERS}/check-email`,
      API_LOGIN = "/auth/login",
      API_GET_TYPE_OF_TASKS='/tasks/tables',
      API_GET__TASKS_FROM_TYPE = '/tasks/table/',
      API_GET_ETALONS_USERS = '/etalons/users/',
      API_GET_ETALONS_BOOKS ='/etalons/books/',
      API_GET_ETALONS_FLIGHTS ='/etalons/flights/';

// Функция для проверки существования email
export const checkEmailExists = async (email) => {
  try {
    const response = await api.get(`${API_CHECK_EMAIL}?email=${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при проверке email:", error);
    throw error;
  }
};

// Функция для регистрации пользователя
export const registerUser = async (email, name, password) => {
  try {
    const response = await api.post(API_REG_USERS, {
      email,
      name,
      password
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании:", error);
    throw error;
  }
};

// Функция для входа пользователя
export const loginUser = async (email, password) => {
  try {
    const response = await api.post(API_LOGIN, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при логине:", error);
    throw error;
  }
};

// Функция для получения всех типов заданий
export const getTypeTasks = async () => {
  try {
    const response = await api.get(API_GET_TYPE_OF_TASKS);
    return response.data;
  } catch (error) {
    console.error("Ошибка при проверке email:", error);
    throw error;
  }
};

export const getTablesTasks = async (categoryType) => {
  try {
    // Используем правильный путь API с параметром типа категории
    const response = await api.get(`${API_GET__TASKS_FROM_TYPE}${categoryType}`);
    return response.data;
    
  } catch (error) {
    console.error(`Ошибка при получении упражнений для типа ${categoryType}:`, error);
    throw error;
  }
};

export const getEtalonsUsers = async () => {
  try {
    // Используем правильный путь API с параметром типа категории
    const response = await api.get(`${API_GET_ETALONS_USERS}`);
    return response.data;
    
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getEtalonsBooks = async () => {
  try {
    // Используем правильный путь API с параметром типа категории
    const response = await api.get(`${API_GET_ETALONS_BOOKS}`);
    return response.data;
    
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getEtalonsFlights = async () => {
  try {
    // Используем правильный путь API с параметром типа категории
    const response = await api.get(`${API_GET_ETALONS_FLIGHTS}`);
    return response.data;
    
  } catch (error) {
    console.error(error);
    throw error;
  }
};