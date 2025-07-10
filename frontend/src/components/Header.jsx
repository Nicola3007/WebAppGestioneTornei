import '../styles/header.css'
import {Navigate, useNavigate} from 'react-router-dom'

function Header({onLogout}) {

   const user = JSON.parse(localStorage.getItem('user'));
   const username = user.username;
   const navigate = useNavigate()

    const handleClick = async () => {
       await onLogout()
        await navigate('/login')
    }
    return(
        <div className="header">
            <div className='header-right'>
            <span className='username'> {username? `Ciao ${username} !` : 'Effettua il login!'}</span>
        <button type='submit' onClick={handleClick} >Logout</button>
            </div>

        </div>
    )
}

export default Header;