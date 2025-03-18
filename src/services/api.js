// src/services/api.js
import axios from "axios";

const API_REG_USERS = "/api/register",
      API_GET_EMAIL = "/api/check-email";


export const getEmail = async () => {
    try {
        const response = await axios.get(API_GET_EMAIL);
        console.log(response.data);
        return response.data; // Возвращаем полученные данные
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return null; // Возвращаем null в случае ошибки
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

