import {useState, useEffect} from "react";
import {Navigate, Link, Route, Routes, Outlet} from "react-router-dom";
import Header from '../components/Header.jsx';
import Navbar from '../components/Navbar.jsx';
import '../styles/dashboard.css'
import SearchTournaments from "../components/SearchTournament.jsx";
import MyTournaments from "../components/MyTournaments.jsx";
import Home from "../components/Home.jsx";

function Dashboard({onLogout}){

    return(
        <div className='dashboard-layout'>
            <Header onLogout={onLogout}  className='header'  />
            <Navbar className='navbar'/>
            <main>
                <Outlet></Outlet>
            </main>
        </div>
    )
}

export default Dashboard;
