import React, { useState } from 'react';
import styles from './PeriodDialog.module.css';
import PropTypes from 'prop-types';

const PeriodDialog = ({ transactions, onClose, onFilter }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    const applyFilter = () => {
        const now = new Date();
        let filtered = [...transactions];

        // Период
        if (selectedPeriod === 'day') {
            filtered = filtered.filter(t => new Date(t.date).toDateString() === now.toDateString());
        } else if (selectedPeriod === 'week') {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            filtered = filtered.filter(t => {
                const d = new Date(t.date);
                return d >= startOfWeek && d <= endOfWeek;
            });
        } else if (selectedPeriod === 'month') {
            filtered = filtered.filter(t => {
                const d = new Date(t.date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });
        } else if (selectedPeriod === 'year') {
            filtered = filtered.filter(t => new Date(t.date).getFullYear() === now.getFullYear());
        } else if (selectedPeriod === 'custom') {
            const start = new Date(customStartDate);
            const end = new Date(customEndDate);
            if (!isNaN(start) && !isNaN(end)) {
                filtered = filtered.filter(t => {
                    const d = new Date(t.date);
                    return d >= start && d <= end;
                });
            }
        }

        // Тип
        if (selectedType !== 'all') {
            filtered = filtered.filter(t => t.type === selectedType);
        }

        onFilter(filtered);
        onClose();
    };

    const resetFilters = () => {
        onFilter(transactions); // передаём все транзакции без фильтрации
        onClose();
    };

    return (
        <div className={styles.dialog}>
            <h3>Выберите период</h3>
            <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                <option value="day">Сегодня</option>
                <option value="week">Текущая неделя</option>
                <option value="month">Текущий месяц</option>
                <option value="year">Текущий год</option>
                <option value="custom">Свой период</option>
            </select>

            {selectedPeriod === 'custom' && (
                <div className={styles.dateRange}>
                    <label>
                        От:
                        <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                        />
                    </label>
                    <label>
                        До:
                        <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                        />
                    </label>
                </div>
            )}

            <div className={styles.filterGroup}>
                <label htmlFor="type">Тип транзакций:</label>
                <select
                    id="type"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <option value="all">Все</option>
                    <option value="income">Доходы</option>
                    <option value="expense">Расходы</option>
                </select>
            </div>

            <div className={styles.actions}>
                <button onClick={applyFilter}>Применить</button>
                <button onClick={resetFilters}>Сбросить фильтры</button>
                <button onClick={onClose}>Отмена</button>
            </div>
        </div>
    );
};

PeriodDialog.propTypes = {
    transactions: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
};

export default PeriodDialog;
