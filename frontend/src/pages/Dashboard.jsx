
import { Outlet} from "react-router-dom";
import Header from '../components/Header.jsx';
import Navbar from '../components/Navbar.jsx';
import '../styles/dashboard.css'


function Dashboard({onLogout}){

    return(
        <div className='dashboard-layout'>
            <Header onLogout={onLogout}  className='header'  />
            <Navbar className='navbar'/>
            <main>
                <Outlet></Outlet>
            </main>
        </div>
    )
}

export default Dashboard;
