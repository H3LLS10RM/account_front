import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from 'src/shared/auth.jsx';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Запрос защищённых данных
        const fetchProtectedData = async () => {
            try {
                const response = await fetch('/api/protected/data');

                if (!response.ok) {
                    throw new Error('Ошибка получения данных');
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Ошибка:', error);
            }
        };

        fetchProtectedData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <h1>Личный кабинет</h1>
            {userData && (
                <div>
                    <p>Имя: {userData.username}</p>
                    <p>Email: {userData.email}</p>
                </div>
            )}
            <button onClick={handleLogout}>Выйти</button>
        </div>
    );
};

export default Dashboard;