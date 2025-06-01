import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
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
        setMessage('Регистрация...');

        try {
            // Формируем URL с query-параметрами
            const url = new URL('http://192.168.195.23:8080/api/users/register');
            url.searchParams.append('password', formData.password);

            const response = await fetch(url, {
                method: 'POST', // Или GET, в зависимости от требований сервера
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    login: formData.login
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
                // Перенаправляем на страницу входа с сообщением
                navigate('/login', {
                    state: {
                        registrationSuccess: true,
                        login: formData.login
                    }
                });
            } else {
                const errorMsg = data.message || data.error || data.reason || response.statusText;
                setMessage(`Ошибка регистрации: ${errorMsg}`);
            }
        } catch (err) {
            console.error('Полная ошибка:', err);
            setMessage(`Сетевая ошибка: ${err.message}`);
        }
    };

    const handleBack = () => {
        navigate('/login');
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.vboxContainer}>
                <h2 className={styles.title}>Регистрация</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        id="name"
                        className={styles.inputField}
                        type="text"
                        placeholder="Имя"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        id="login"
                        className={styles.inputField}
                        type="text"
                        placeholder="Логин"
                        value={formData.login}
                        onChange={handleChange}
                        required
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
                            Зарегистрироваться
                        </button>

                        <button
                            type="button"
                            className={`${styles.btn} ${styles.btnSecondary}`}
                            onClick={handleBack}
                        >
                            Назад
                        </button>
                    </div>
                </form>

                {message && <div className={styles.message}>{message}</div>}
            </div>
        </div>
    );
};

export default Register;