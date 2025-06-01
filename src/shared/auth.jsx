
import axios from 'axios';

export const initializeAuth = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        setAuthHeader(token);
    }
};
export const setAuthHeader = (token) => {
    if (token) {
        // Сохраняем токен в localStorage
        localStorage.setItem('authToken', token);

        // Устанавливаем токен в заголовки по умолчанию для fetch
        if (typeof fetch === 'function') {
            const originalFetch = fetch;
            window.fetch = (url, options = {}) => {
                options.headers = {
                    ...(options.headers || {}),
                    'Authorization': `Bearer ${token}`
                };
                return originalFetch(url, options);
            };
        }

        // Для Axios (если используете)
        if (typeof axios !== 'undefined') {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }
};

// Проверка аутентификации
export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
};

// Выход из системы
export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Сбрасываем заголовки авторизации
    if (typeof fetch === 'function') {
        window.fetch = undefined; // Восстановите оригинальный fetch при необходимости
    }

    if (typeof axios !== 'undefined') {
        delete axios.defaults.headers.common['Authorization'];
    }

    window.location.href = '/login';
};