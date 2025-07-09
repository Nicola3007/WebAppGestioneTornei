import {useState, useEffect} from "react";
import {Navigate, Link, Route, Routes} from "react-router-dom";
import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar.jsx";
import SearchTournaments from "../components/SearchTournament.jsx";
import MyTournaments from "../components/MyTournaments.jsx";
import Home from "../components/Home.jsx";

function Dashboard({onLogout}){

    return(
        <>

            <main>
                <Header onLogout={onLogout}    />
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/my-tournaments" element={<MyTournaments />} />
                    <Route path="/search-tournaments" element={<SearchTournaments />} />
                </Routes>
            </main>
        </>
    )
}

export default Dashboard;
