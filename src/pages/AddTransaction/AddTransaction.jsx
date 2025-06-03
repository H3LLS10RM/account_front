import React, { useEffect, useState } from "react";
import styles from "./AddTransaction.module.css";
import { getToken } from "../../shared/auth";
import { useNavigate } from "react-router-dom";

const AddTransaction = () => {
    const [type, setType] = useState("Доход");
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    const token = getToken();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                setCategories(data);
                if (data.length > 0) setSelectedCategoryId(data[0].id);
            } catch (err) {
                console.error("Ошибка при загрузке категорий:", err);
            }
        };

        if (token) fetchCategories();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!token) {
                throw new Error("Отсутствует токен авторизации");
            }

            const selectedCategory = categories.find(cat => cat.id === parseInt(selectedCategoryId));

            const dateField = type === "Доход" ? "receiptDate" : "expenseDate";

            const payload = {
                id: 0,
                descr: description,
                amount: parseInt(amount),
                [dateField]: date,
                categoryId: parseInt(selectedCategoryId),
                categoryName: selectedCategory?.name || "",
            };

            const endpoint = type === "Доход" ? "/api/receipts" : "/api/expenses";

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка при сохранении транзакции: ${errorText}`);
            }

            const contentType = response.headers.get("Content-Type");

            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
                console.log("Транзакция успешно сохранена (JSON):", data);
            } else {
                data = await response.text();
                console.log("Транзакция успешно сохранена (текст):", data);
            }

            setDescription("");
            setAmount("");
            setDate("");
            setSelectedCategoryId("");
            alert("Транзакция успешно добавлена!");
        } catch (error) {
            console.error("Ошибка при POST:", error);
            alert("Ошибка при сохранении транзакции");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option>Доход</option>
                    <option>Расход</option>
                </select>

                <select
                    id="categoryChoice"
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <input
                type="text"
                id="amountField"
                placeholder="Сумма"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className={styles.inputField}
            />
            <input
                type="date"
                id="datePicker"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className={styles.inputField}
            />
            <input
                type="text"
                placeholder="Описание"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className={styles.inputField}
            />
            <div className={styles.buttonRow}>
                <button id="saveButton" onClick={handleSubmit}>
                    Сохранить
                </button>
                <button id="cancelButton" onClick={() => navigate("/home")}>
                    Отмена
                </button>
            </div>
        </div>
    );
};

export default AddTransaction;
