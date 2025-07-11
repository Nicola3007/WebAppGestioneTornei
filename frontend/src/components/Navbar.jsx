import { Link} from 'react-router-dom';
import './navbar.css'

function Navbar() {

    return (
        <div className="navbar">
            <Link to='/home' className='home'>Home</Link>
            <Link to='/my-tournaments' className='my-tournaments'>I miei tornei</Link>
            <Link to='/search-tournaments' className='search-tournament'>Cerca torneo</Link>
        </div>
    )
}

export default Navbar;