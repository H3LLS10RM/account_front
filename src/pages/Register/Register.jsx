
import React, { useState } from 'react';
import styles from './Register.module.css';
const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        login: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Обработка запроса...');

        try {
            // Отправка POST-запроса с CORS заголовками
            const response = await fetch('https://your-api-domain.com/register', {
                method: 'POST',
                mode: 'cors', // Явное указание режима CORS
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' // Разрешение для всех доменов
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(`Регистрация успешна! Добро пожаловать, ${data.username}`);
                // Перенаправление на другую страницу
                window.location.href = '/';
            } else {
                const error = await response.json();
                setMessage(`Ошибка: ${error.message || response.statusText}`);
            }
        } catch (err) {
            setMessage('Сетевая ошибка: ' + err.message);
        }
    };

    const handleBack = () => {
        // GET запрос для страницы входа
        window.location.href = '/login';
    };



    return (
        <div className="register-container">

            <div className={styles.vboxContainer}>
                <h2>Введите данные, чтобы зарегистрироваться</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        id="usernameField"
                        className={styles.inputField}
                        type="text"
                        placeholder="Имя"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <input
                        id="loginField"
                        className={styles.inputField}
                        type="text"
                        placeholder="Логин"
                        value={formData.login}
                        onChange={handleChange}
                        required
                    />

                    <input
                        id="passwordField"
                        className={styles.inputField}
                        type="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div className={styles.buttonsContainer}>
                        <button type="submit" className={styles.btnPrimary}>
                            Зарегистрироваться
                        </button>

                        <button
                            type="button"
                            className={styles.btnSecondary}
                            onClick={handleBack}
                        >
                            Назад
                        </button>
                    </div>
                </form>

                <div className={styles.message}>{message}</div>
            </div>
        </div>
    );
};

export default Register;