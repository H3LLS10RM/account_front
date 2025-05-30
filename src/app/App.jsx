import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css'
import Home from "../pages/Home/Home.jsx";
import Register from "../pages/Register/Register.jsx";
import Login from "../pages/Login/Login.jsx";
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
    return (

        <BrowserRouter>
            <Routes>
                <Route path={'/home'} element={<Home/>}/>
                <Route path={'/register'} element={<Register/>}/>
                <Route path={'/login'} element={<Login/>}/>
            </Routes>

        </BrowserRouter>
    )
}

export default App
