// src/services/api.js
import axios from "axios";

const API_REG_USERS = "api/register",
      API_CHECK_EMAIL = "api/register/check-email";


// Функция для проверки существования email в базе данных
export const checkEmailExists = async (email) => {
    try {
        console.log("Проверка email:", email);
        // Используем GET запрос с параметром email
        const response = await axios.get(API_CHECK_EMAIL);
        console.log("Результат проверки email:", response.data);
        return response.data;
    } catch (error) {
        console.error("Ошибка при проверке email:", error);
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

