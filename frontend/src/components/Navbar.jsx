import { Link} from 'react-router-dom';
import './navbar.css'

function Navbar() {

    return (
        <div className="navbar-container">
            <Link to='/home' className='home'>Home</Link>
            <Link to='/myTournaments' className='my-tournaments'>I miei tornei</Link>
            <Link to='/searchTournament' className='search-tournament'>Cerca torneo</Link>
        </div>
    )
}

export default Navbar;