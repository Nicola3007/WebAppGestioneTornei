import {useState, useEffect} from "react";
import {Navigate, Link} from "react-router-dom";
import Header from "../components/Header.jsx";


function Dashboard({onLogout}){

    return(
        <>
            <Header onLogout={onLogout}></Header>
        </>
    )
}

export default Dashboard;
