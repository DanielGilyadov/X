// src/services/api.js
import axios from "axios";

const API_REG_USERS = "api/register",
      API_CHECK_EMAIL = `${API_REG_USERS}/check-email`,
      API_LOGIN  = "/auth/login";


// Функция для проверки существования email в базе данных
export const checkEmailExists = async (email) => {
    try {
        // Используем объект params для передачи email
        const response = await axios.get(`${API_CHECK_EMAIL}?email=${encodeURIComponent(email)}`);
        console.log("Результат проверки email:", response.data);
        
        return response.data;
    } catch (error) {
        console.error("Ошибка при проверке email:", error);
        
        if (error.response) {
            console.error("Ответ сервера:", error.response.data);
            console.error("Статус:", error.response.status);
        }
        throw error; // Пробрасываем ошибку дальше для обработки в компоненте
    }
};

export const registerUser = async (email, name, password) => {
    try {
        const response = await axios.post(API_REG_USERS, {
            email,
            name,
            password
        });
        return response.data; // Возвращаем данные после добавления
    } catch (error) {
        console.error("Ошибка при создании:", error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(API_LOGIN, {
            email,
            password
        });
        return response.data; // Возвращаем данные после добавления
    } catch (error) {
        console.error("Ошибка при логин:", error);
        throw error;
    }
};

