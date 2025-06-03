import React, { useEffect, useState } from "react";
import styles from "./Categories.module.css";
import AddCategory from '../AddCategory/AddCategory';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const token = localStorage.getItem('authToken');

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Ошибка при загрузке категорий');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Ошибка получения категорий:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (newName) => {
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newName })
            });

            if (!response.ok) throw new Error("Ошибка добавления категории");
            await fetchCategories(); // Обновляем список
            setShowAddCategory(false);
        } catch (error) {
            console.error("Ошибка при добавлении категории:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>Категории</div>
            <div className={styles.list}>
                {categories.map((cat, idx) => (
                    <div key={idx} className={styles.listItem}>
                        {cat.name}
                    </div>
                ))}
            </div>

            <div className={styles.buttonRow}>
                <button onClick={() => setShowAddCategory(prev => !prev)}>
                    {showAddCategory ? 'Закрыть' : 'Добавить'}
                </button>
                <button className={styles.button} onClick={() => window.history.back()}>
                    Выход
                </button>
            </div>

            {showAddCategory && (
                <div style={{ marginTop: '1rem' }}>
                    <AddCategory onSave={handleAddCategory} onCancel={() => setShowAddCategory(false)} />
                </div>
            )}
        </div>
    );
};

export default Categories;
