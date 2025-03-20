// src/services/api.js
import axios from "axios";

const API_REG_USERS = "api/register",
      API_CHECK_EMAIL = "api/register/check-email";


// Функция для проверки существования email в базе данных
export const checkEmailExists = async (email) => {
    try {
        console.log("Проверка email:", email);
        
        // Используем объект params для передачи email
        const response = await axios.get(`${API_CHECK_EMAIL}?email=${encodeURIComponent(email)}`);
        
        console.log("Ответ сервера:", response);
        console.log("Результат проверки email:", response.data);
        
        return response.data;
    } catch (error) {
        console.error("Ошибка при проверке email:", error);
        console.error("Детали запроса:", error.config);
        
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

