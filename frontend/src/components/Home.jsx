import {useState} from "react";
import CreateTournament from "./CreateTournament.jsx";
import '../styles/home.css'
import SignedUpTournaments from "./SignedUpTournaments.jsx";

function Home(){

    const [showForm, setShowForm] = useState(false);

    return (
        <div>
            <button className='create-button' onClick={()=>setShowForm(true)}>CREA UN TORNEO</button>
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