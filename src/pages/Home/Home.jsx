import React, { useState, useEffect, useRef } from 'react';
import styles from './Home.module.css';
import { Chart } from 'chart.js/auto';

const Home = () => {
    const chartRef = useRef(null);
    const [activeChart, setActiveChart] = useState('expenses');

    // Упрощённые данные для диаграммы
    const financeData = {
        expenses: {
            labels: ['Продукты', 'Транспорт'],
            data: [6350, 1780],
            colors: ['#e74c3c', '#9b59b6'],
            title: 'Распределение расходов'
        },
        income: {
            labels: ['Зарплата', 'Фриланс'],
            data: [25000, 8500],
            colors: ['#3498db', '#2ecc71'],
            title: 'Распределение доходов'
        }
    };

    // Упрощённые данные для таблицы
    const transactions = [
        { id: 1, amount: '+ 25 000 ₽', category: 'Зарплата', date: '10.05.2023', type: 'income' },
        { id: 2, amount: '- 4 250 ₽', category: 'Продукты', date: '15.05.2023', type: 'expense' }
    ];

    // Инициализация диаграммы без анимаций и hover-эффектов
    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');

        // Уничтожаем предыдущий экземпляр диаграммы
        if (chartRef.current.chartInstance) {
            chartRef.current.chartInstance.destroy();
        }

        // Создаем новую диаграмму без анимаций и взаимодействия
        const newChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: financeData[activeChart].labels,
                datasets: [{
                    data: financeData[activeChart].data,
                    backgroundColor: financeData[activeChart].colors,
                    borderWidth: 1,
                    borderColor: '#fff'
                }]
            },
            options: {
                // Отключаем все анимации
                animation: false,
                // Отключаем все события (hover и т.д.)
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
                    // Отключаем тултипы при наведении
                    tooltip: {
                        enabled: false
                    }
                }
            }
        });

        // Сохраняем ссылку на экземпляр диаграммы
        chartRef.current.chartInstance = newChart;

        // Очистка при размонтировании компонента
        return () => {
            if (chartRef.current?.chartInstance) {
                chartRef.current.chartInstance.destroy();
            }
        };
    }, [activeChart]);

    // Обновление диаграммы
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

                <div className={styles.chartTitle}>{financeData[activeChart].title}</div>
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

                <div className={styles.controls}>
                    <div className={styles.btnGroup}>
                        <button className={styles.btn} onClick={() => updateChart('income')}>
                            <i className="fas fa-arrow-up"></i>
                        </button>
                        <button className={`${styles.btn} ${styles.activeBtn}`} onClick={() => updateChart('expenses')}>
                            <i className="fas fa-arrow-down"></i>
                        </button>
                        <button className={styles.btn}>
                            <i className="fas fa-history"></i>
                        </button>
                        <button className={styles.btn}>
                            <i className="fas fa-calendar"></i>
                        </button>
                    </div>
                </div>

                <div className={styles.filterSection}>
                    <div className={styles.periodLabel}>Май 2023</div>
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
                        {transactions.map(transaction => (
                            <tr key={transaction.id}>
                                <td className={transaction.type === 'income' ? styles.transactionAmount : `${styles.transactionAmount} ${styles.expense}`}>
                                    {transaction.amount}
                                </td>
                                <td>
                    <span className={styles.transactionCategory}>
                      {transaction.category}
                    </span>
                                </td>
                                <td className={styles.transactionDate}>{transaction.date}</td>
                            </tr>
                        ))}
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