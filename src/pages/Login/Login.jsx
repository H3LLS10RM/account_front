// Login.jsx
import React, { useState } from 'react';
import styles from './Login.module.css'; // Используем те же стили

const Login = () => {
    const [formData, setFormData] = useState({
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
        setMessage('Вход в систему...');

        try {
            // Отправка POST-запроса для авторизации
            const response = await fetch('https://your-api-domain.com/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(`Добро пожаловать, ${data.username}!`);

                // Сохраняем токен в localStorage
                localStorage.setItem('authToken', data.token);

                // Перенаправление после успешного входа
                window.location.href = '/dashboard';
            } else {
                const error = await response.json();
                setMessage(`Ошибка: ${error.message || 'Неверные учетные данные'}`);
            }
        } catch (err) {
            setMessage('Сетевая ошибка: ' + err.message);
        }
    };

    const handleRegister = () => {
        window.location.href = '/register';
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.vboxContainer}>
                <h2 className={styles.title}>Вход в систему</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
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