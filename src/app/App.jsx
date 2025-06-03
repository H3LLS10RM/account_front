import React, { useEffect} from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css'

import Home from "../pages/Home/Home.jsx";
import Register from "../pages/Register/Register.jsx";
import Login from "../pages/Login/Login.jsx";
import AddTransaction from "../pages/AddTransaction/AddTransaction.jsx"
import AddCategory from "../pages/AddCategory/AddCategory.jsx";
import Categories from "../pages/Categories/Categories.jsx";
import PeriodDialog from "../pages/PeriodDialog/PeriodDialog.jsx";

import '@fortawesome/fontawesome-free/css/all.min.css';
import { initializeAuth } from '../shared/auth';




const ProtectedRoute = ({ children }) => {
    if (!localStorage.getItem('authToken')) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    useEffect(() => {
        initializeAuth();
    }, []);
    return (


        <BrowserRouter>
            <Routes>
                <Route path={'/home'} element={<Home/>}/>
                <Route path={'/register'} element={<Register/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/addtransaction'} element={<AddTransaction/>}/>
                <Route path={'/categories'} element={<Categories/>}/>
            </Routes>

        </BrowserRouter>
    )
}

export default App
