import '../styles/header.css'
import { useNavigate} from 'react-router-dom'
import logo from '../../public/logo.png'

function Header({onLogout}) {

   const user = JSON.parse(localStorage.getItem('user'));
   const username = user.username;
   const navigate = useNavigate()

    const handleClick = async () => {
       await onLogout()
        navigate('/login')
    }
    return(
        <div className="header">
            <div className='header-left'>
                <img src={logo} alt='logo' />
            </div>
            <div className='header-right'>
            <span className='username'> {username? `Ciao ${username} !` : 'Effettua il login!'}</span>
        <button type='submit' onClick={handleClick} >Logout</button>
            </div>

        </div>
    )
}

export default Header;