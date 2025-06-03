import React, { useState, useEffect, useRef } from 'react';
import styles from './Home.module.css';
import { Chart } from 'chart.js/auto';

import { useNavigate } from 'react-router-dom';
import PeriodDialog from '../PeriodDialog/PeriodDialog';

const Home = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [activeChart, setActiveChart] = useState('expenses');
    const [transactions, setTransactions] = useState([]);
    const [showPeriodDialog, setShowPeriodDialog] = useState(false);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const [financeData, setFinanceData] = useState({
        expenses: { labels: [], data: [], colors: [], title: 'Распределение расходов' },
        income: { labels: [], data: [], colors: [], title: 'Распределение доходов' }
    });

    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const generateColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = (i * 360) / count;
            colors.push(`hsl(${hue}, 70%, 60%)`);
        }
        return colors;
    };

    useEffect(() => {
        if (!token) return;

        const loadData = async () => {
            try {
                const expensesResponse = await fetch('/api/expenses/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const expenses = await expensesResponse.json();

                const incomeResponse = await fetch('/api/receipts/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const income = await incomeResponse.json();

                const groupByCategory = (items) => {
                    const result = {};
                    items.forEach(item => {
                        const name = item.categoryName || 'Без категории';
                        result[name] = (result[name] || 0) + item.amount;
                    });
                    return {
                        labels: Object.keys(result),
                        data: Object.values(result)
                    };
                };

                const groupedExpenses = groupByCategory(expenses);
                const groupedIncome = groupByCategory(income);

                setFinanceData({
                    expenses: {
                        title: 'Распределение расходов',
                        labels: groupedExpenses.labels,
                        data: groupedExpenses.data,
                        colors: generateColors(groupedExpenses.labels.length)
                    },
                    income: {
                        title: 'Распределение доходов',
                        labels: groupedIncome.labels,
                        data: groupedIncome.data,
                        colors: generateColors(groupedIncome.labels.length)
                    }
                });

                setTransactions([
                    ...expenses.map(e => ({
                        id: `expense-${e.id}`,
                        amount: -e.amount,
                        category: e.categoryName,
                        date: e.expenseDate,
                        descr: e.descr,
                        rawId: e.id,
                        type: 'expense'
                    })),
                    ...income.map(r => ({
                        id: `receipt-${r.id}`,
                        amount: r.amount,
                        category: r.categoryName,
                        date: r.receiptDate,
                        descr: r.descr,
                        rawId: r.id,
                        type: 'income'
                    }))
                ]);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        loadData();
    }, [token]);

    const filteredData = filteredTransactions;

    useEffect(() => {
        if (!chartRef.current || activeChart === 'history') return;

        const ctx = chartRef.current.getContext("2d");
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const { labels, data, colors } = financeData[activeChart];

        chartInstanceRef.current = new Chart(ctx, {
            type: "pie",
            data: {
                labels,
                datasets: [{
                    label: "Сумма по категориям",
                    data,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.raw}`
                        }
                    }
                }
            }
        });
    }, [financeData, activeChart]);

    useEffect(() => {
        if (activeChart !== 'history' || !chartRef.current) return;

        const ctx = chartRef.current.getContext("2d");

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const categoryTotals = {};

        filteredData.forEach(tx => {
            const category = tx.category || 'Без категории';
            const amount = tx.amount;
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            categoryTotals[category] += amount;
        });

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
        const colors = generateColors(labels.length);

        chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Доход - Расход по категориям',
                    data,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.raw}`
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, [filteredData, activeChart]);

    useEffect(() => {
        let sorted = [...transactions];

        if (sortConfig.key) {
            sorted.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                return sortConfig.direction === 'asc'
                    ? (aValue > bValue ? 1 : -1)
                    : (aValue < bValue ? 1 : -1);
            });
        }

        const filtered = activeChart === 'history'
            ? sorted
            : sorted.filter(t =>
                (activeChart === 'expenses' && t.type === 'expense') ||
                (activeChart === 'income' && t.type === 'income')
            );

        setFilteredTransactions(filtered);
    }, [transactions, sortConfig, activeChart]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleDelete = async () => {
        if (!selectedTransaction) return;
        const { type, rawId } = selectedTransaction;

        try {
            await fetch(`/api/${type === 'expense' ? 'expenses' : 'receipts'}/${rawId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            setTransactions(prev => prev.filter(t => t.id !== selectedTransaction.id));
            setSelectedTransaction(null);
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainContainer}>
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        <h1>Финансовый менеджер</h1>
                        <div className={styles.authButtons}>
                            {!token ? (
                                <>
                                    <button onClick={() => navigate('/login')} className={styles.authButton}>Логин</button>
                                    <button onClick={() => navigate('/register')} className={styles.authButton}>Регистрация</button>
                                </>
                            ) : (
                                <button onClick={handleLogout} className={styles.authButton}>Выход</button>
                            )}
                        </div>
                    </div>
                    <div className={styles.subtitle}>Управление доходами и расходами</div>
                </div>

                <div className={styles.chartTitle}>
                    {activeChart === 'expenses' && financeData.expenses.title}
                    {activeChart === 'income' && financeData.income.title}
                    {activeChart === 'history' && 'Общая история: Распределение по категориям'}
                </div>

                <div className={styles.chartContainer}>
                    <canvas ref={chartRef} height="300" />
                </div>

                <div className={styles.controls}>
                    <div className={styles.btnGroup}>
                        <button className={styles.btn} onClick={() => setActiveChart('income')}><i className="fas fa-arrow-up" /></button>
                        <button className={styles.btn} onClick={() => setActiveChart('expenses')}><i className="fas fa-arrow-down" /></button>
                        <button className={styles.btn} onClick={() => setActiveChart('history')}><i className="fas fa-history" /></button>
                        <button className={styles.btn} onClick={() => setShowPeriodDialog(!showPeriodDialog)}><i className="fas fa-calendar" /></button>
                        <button className={styles.btn} onClick={() => navigate("/addtransaction")}><i className="fas fa-plus" /></button>
                        <button className={styles.btn} onClick={() => navigate("/categories")}><i className="fas fa-folder" /></button>
                    </div>
                </div>

                {showPeriodDialog && (
                    <PeriodDialog
                        transactions={transactions}
                        onClose={() => setShowPeriodDialog(false)}
                        onFilter={(filtered) => setFilteredTransactions(filtered)}
                    />
                )}

                <div className={styles.contentRow}>
                    <div className={styles.tableContainer}>
                        <table>
                            <thead>
                            <tr>
                                <th onClick={() => handleSort('amount')}>Сумма</th>
                                <th onClick={() => handleSort('category')}>Категория</th>
                                <th onClick={() => handleSort('date')}>Дата</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTransactions.map(t => (
                                <tr key={t.id} onClick={() => setSelectedTransaction(t)}
                                    className={styles.clickableRow}>
                                    <td className={t.amount < 0 ? styles.expense : styles.transactionAmount}>
                                        {t.amount}
                                    </td>
                                    <td>{t.category}</td>
                                    <td className={styles.transactionDate}>{t.date}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {selectedTransaction && (
                        <div className={styles.sidebar}>
                            <h3>Описание</h3>
                            <p><strong>Категория:</strong> {selectedTransaction.category}</p>
                            <p><strong>Сумма:</strong> {selectedTransaction.amount}</p>
                            <p><strong>Дата:</strong> {selectedTransaction.date}</p>
                            <p><strong>Описание:</strong> {selectedTransaction.descr || 'Нет описания'}</p>
                            <div className={styles.sidebarButtons}>
                                <button onClick={handleDelete} className={styles.deleteButton}>Удалить</button>
                                <button onClick={() => setSelectedTransaction(null)} className={styles.closeButton}>Закрыть</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
