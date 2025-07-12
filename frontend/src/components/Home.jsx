import {useState} from "react";
import CreateTournament from "./CreateTournament.jsx";
import '../styles/home.css'
import SignedUpTournaments from "./SignedUpTournaments.jsx";
import {useNavigate} from "react-router-dom";

function Home(){

    const [showForm, setShowForm] = useState(false);

    const navigate = useNavigate();

    return (
        <div>
            <h1>BENVENUTO IN Tpro!</h1>
            <p>Organizza o iscriviti a un torneo</p>
            <div className="button-group">
            <button className='create-button' onClick={()=>setShowForm(true)}>CREA UN TORNEO</button>
            <button className='create-button' onClick={()=>navigate('/search-tournaments')}>ISCRIVITI A UN TORNEO</button>
            </div>
                {showForm &&
            <div className='form-content' >
                <CreateTournament handleBackClick={()=>setShowForm(false)}/>
            </div>
            }
            <SignedUpTournaments/>
        </div>
    )
}

export default Home;