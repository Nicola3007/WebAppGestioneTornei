import { useState} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import CreaTorneo from './pages/CreaTorneo.jsx'


function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path='/login' element={<Login/>}></Route>
                <Route  path='/register' element={<Register/>}></Route>
                <Route path='/dashboard' element={<Dashboard/>}></Route>
                <Route path='/crea-torneo' element={<CreaTorneo/>}></Route>

            </Routes>
        </BrowserRouter>

    )
}

export default App;