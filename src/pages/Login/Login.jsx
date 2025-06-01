import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { setAuthHeader } from '../../shared/auth';

const Login = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Вход в систему...');

        try {
            const response = await fetch('http://192.168.195.23:8080/api/auth/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            // Получаем сырой текст ответа для диагностики
            const responseText = await response.text();
            console.log('Сырой ответ сервера:', responseText);

            // Пытаемся распарсить JSON
            let data = {};
            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch (jsonError) {
                    console.error('Ошибка парсинга JSON:', jsonError);
                    setMessage('Ошибка: Невалидный JSON в ответе сервера');
                    return;
                }
            }

            if (response.ok) {
                // Проверяем наличие токена в ответе
                const token = data.token || data.accessToken || data.access_token;
                if (!token) {
                    throw new Error('Токен не найден в ответе сервера');
                }

                // Проверяем наличие информации о пользователе
                const user = data.user || data.userData || data;
                if (!user || !user.username) {
                    console.warn('Данные пользователя неполные:', user);
                }

                // Сохраняем токен и данные пользователя
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify(user));
                setAuthHeader(token);

                // Приветствуем пользователя (с проверкой на наличие username)
                const username = user?.username || 'пользователь';
                setMessage(`Добро пожаловать, ${username}!`);

                // Перенаправляем на защищенную страницу
                navigate('/home');
            } else {
                // Обработка ошибок сервера
                const errorMsg = data.message || data.error || response.statusText;
                setMessage(`Ошибка сервера: ${errorMsg}`);
            }
        } catch (err) {
            console.error('Полная ошибка:', err);
            setMessage(`Ошибка: ${err.message}`);
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.vboxContainer}>
                <h2 className={styles.title}>Вход в систему</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        id="username"
                        className={styles.inputField}
                        type="text"
                        placeholder="Логин"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        autoFocus
                    />

                    <input
                        id="password"
                        className={styles.inputField}
                        type="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div className={styles.buttonsContainer}>
                        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                            Войти
                        </button>

                        <button
                            type="button"
                            className={`${styles.btn} ${styles.btnSecondary}`}
                            onClick={handleRegister}
                        >
                            Регистрация
                        </button>
                    </div>
                </form>

                {message && <div className={styles.message}>{message}</div>}
            </div>
        </div>
    );
};

export default Login;