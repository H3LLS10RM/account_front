import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
    const [formData, setFormData] = useState({
        login: '', // Изменено с username на login
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: formData.login, // Используем login вместо username
                    password: formData.password
                })
            });

            const responseText = await response.text();
            console.log('Сырой ответ сервера:', responseText);

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

            console.log('Структура ответа:', {
                status: response.status,
                ok: response.ok,
                data: data
            });

            if (response.ok) {
                const token = data.token || data.accessToken || data.access_token;
                const user = data.user || data.userData || {};

                if (!token) {
                    throw new Error('Токен не найден в ответе сервера');
                }

                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('jwt', token);

                const username = user.username || user.login || 'пользователь';
                setMessage(`Добро пожаловать, ${username}!`);
                navigate('/home');
            } else {
                const errorMsg = data.message || data.error || data.reason || response.statusText;
                setMessage(`Ошибка: ${errorMsg}`);
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
                    {/* Изменено id="username" на id="login" */}
                    <input
                        id="login"
                        className={styles.inputField}
                        type="text"
                        placeholder="Логин"
                        value={formData.login}
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