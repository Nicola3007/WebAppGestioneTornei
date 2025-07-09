import './header.css'
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
        <nav>
            <span className='username'> {username? `Ciao ${username} !` : 'Effettua il login!'}</span>
        <button type='submit' onClick={handleClick} >Logout</button>


        </nav>
    )
}

export default Header;