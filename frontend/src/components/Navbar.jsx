import { Link} from 'react-router-dom';
import '../styles/navbar.css'

function Navbar() {

    return (
        <div className="navbar">
            <Link to='/dashboard/home' className='home'>Home</Link>
            <Link to='/dashboard/my-tournaments' className='my-tournaments'>I miei tornei</Link>
            <Link to='/dashboard/search-tournaments' className='search-tournament'>Cerca torneo</Link>
        </div>
    )
}

export default Navbar;