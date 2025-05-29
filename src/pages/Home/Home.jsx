import React from 'react';
import Categories from "../Categories/Categories.jsx";
import styles from "./Home.module.css"
const Home = () => {
    return (
        <div>
            <Categories/>
            <p className={styles.home}> спать </p>
        </div>
    );
};

export default Home;