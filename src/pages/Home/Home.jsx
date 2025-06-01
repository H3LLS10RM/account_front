import React, { useState, useEffect, useRef } from 'react';
import styles from './Home.module.css';
import { Chart } from 'chart.js/auto';

const Home = () => {
    const chartRef = useRef(null);
    const [activeChart, setActiveChart] = useState('expenses');
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/expenses/1') // ⚠️ замените "1" на актуальный userId
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка ответа сервера');
                }
                return response.json();
            })
            .then(data => {
                const formattedData = data.map(expense => ({
                    id: expense.id,
                    amount: `- ${expense.amount} ₽`,
                    category: expense.category,
                    date: expense.expenseDate,
                    type: 'expense'
                }));
                setTransactions(formattedData);
            })
            .catch(error => console.error('Ошибка загрузки расходов:', error));
    }, []);

    // Настройки диаграммы (пока примерные, можно расширить)
    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');

        if (chartRef.current.chartInstance) {
            chartRef.current.chartInstance.destroy();
        }

        const dummyData = [3000, 1500]; // ⚠️ временные данные для примера
        const dummyLabels = ['Продукты', 'Транспорт'];
        const dummyColors = ['#e74c3c', '#9b59b6'];

        const newChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: dummyLabels,
                datasets: [{
                    data: dummyData,
                    backgroundColor: dummyColors,
                    borderWidth: 1,
                    borderColor: '#fff'
                }]
            },
            options: {
                animation: false,
                events: [],
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            }
        });

        chartRef.current.chartInstance = newChart;

        return () => {
            if (chartRef.current?.chartInstance) {
                chartRef.current.chartInstance.destroy();
            }
        };
    }, [activeChart]);

    const updateChart = (type) => {
        setActiveChart(type);
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainContainer}>
                <div className={styles.header}>
                    <h1>Финансовый менеджер</h1>
                    <div className={styles.subtitle}>Управление доходами и расходами</div>
                </div>

                <div className={styles.chartTitle}>
                    {activeChart === 'expenses' ? 'Распределение расходов' : 'Распределение доходов'}
                </div>

                <div className={styles.chartContainer}>
                    <div className={styles.chartSwitcher}>
                        <button
                            className={`${styles.chartBtn} ${activeChart === 'expenses' ? styles.active : ''}`}
                            onClick={() => updateChart('expenses')}
                        >
                            Расходы
                        </button>
                        <button
                            className={`${styles.chartBtn} ${activeChart === 'income' ? styles.active : ''}`}
                            onClick={() => updateChart('income')}
                        >
                            Доходы
                        </button>
                    </div>
                    <canvas ref={chartRef} height="300"></canvas>
                </div>

                <div className={styles.filterSection}>
                    <div className={styles.periodLabel}>Май 2025</div>
                    <button className={`${styles.btn} ${styles.btnReset}`}>
                        <i className="fas fa-sync-alt"></i>
                    </button>
                </div>

                <div className={styles.tableContainer}>
                    <table>
                        <thead>
                        <tr>
                            <th>Сумма</th>
                            <th>Категория</th>
                            <th>Дата</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.length > 0 ? (
                            transactions.map(transaction => (
                                <tr key={transaction.id}>
                                    <td className={`${styles.transactionAmount} ${transaction.type === 'expense' ? styles.expense : ''}`}>
                                        {transaction.amount}
                                    </td>
                                    <td>
                                            <span className={styles.transactionCategory}>
                                                {transaction.category}
                                            </span>
                                    </td>
                                    <td className={styles.transactionDate}>{transaction.date}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className={styles.noData}>Нет данных</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className={styles.footer}>
                    Финансовый менеджер © 2025
                </div>
            </div>
        </div>
    );
};

export default Home;
