import React, { useState } from "react";
import styles from "./AddCategory.module.css";
import PropTypes from 'prop-types';

const AddCategory = ({ onSave, onCancel }) => {
    const [categoryName, setCategoryName] = useState("");

    const handleSave = () => {
        if (categoryName.trim()) {
            onSave(categoryName.trim());
            setCategoryName("");
        }
    };

    return (
        <div className={styles.container}>
            <label className={styles.label}>Введите название категории</label>
            <input
                type="text"
                className={styles.input}
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
            />
            <div className={styles.buttonRow}>
                <button className={styles.button} onClick={handleSave}>
                    Добавить
                </button>
                <button className={styles.button} onClick={onCancel}>
                    Отмена
                </button>
            </div>
        </div>
    );
};

AddCategory.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default AddCategory;
