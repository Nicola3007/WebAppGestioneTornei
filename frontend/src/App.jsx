import {useEffect, useState,} from 'react'
import {BrowserRouter, Routes, Route, useNavigate, Navigate} from 'react-router-dom'
//import './App.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Home from "./components/Home.jsx";
import MyTournaments from "./components/MyTournaments.jsx";
import SearchTournaments from "./components/SearchTournament.jsx";



function App() {

    const API_URL = `${import.meta.env.VITE_API_USER_URL}`
    const [currentUser, setCurrentUser]= useState(null)

    useEffect(() => {
        const user = localStorage.getItem('user')
        const token = localStorage.getItem('accessToken')

        if(user&&token){
            setCurrentUser(JSON.parse(user))
        }else{
            setCurrentUser(null)
        }
    }, [])

    const handleLogout = async () => {



        const accessToken = localStorage.getItem('accessToken');


        try {
            const response = await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                credentials: 'include',
            })

            if (response.status >= 400 || response.status < 600) {
                return (<div className='errorLogout'>Errore nel logout</div>)
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                setCurrentUser(null)
            }

        }catch(err) {
            console.error('errore nel server')
        }
    }

    return (
        <div id='root'>
        <BrowserRouter>

            <Routes>
                <Route path='/login' element={<Login setUser={setCurrentUser}/>}></Route>
                <Route  path='/register' element={<Register/>}></Route>
                <Route path='/' element={<Dashboard onLogout={handleLogout}/>}>
                    <Route index element={<Home/>}></Route>
                    <Route path="home" element={<Home />} />
                    <Route path="my-tournaments" element={<MyTournaments />} />
                    <Route path="search-tournaments" element={<SearchTournaments />} />
                </Route>
            </Routes>
        </BrowserRouter>
        </div>
    )
}

export default App;