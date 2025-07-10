import {useState, useEffect} from "react";
import '../styles/tournamentsPanel.css'
import TournamentCard from "./TournamentCard.jsx";
import SearchTournamentForm from "./SearchTournamentForm.jsx";
import SearchTournamentPanel from "./SearchTournamentPanel.jsx";


function SearchTournaments(){

    const [tournaments, setTournaments]= useState([]);
    const [errorMsg, setErrorMsg] = useState('');


    const returnTournaments = (tournaments, error) => {
        setTournaments(tournaments);
        setErrorMsg(error);
    }

    return (
        <div>
            <SearchTournamentForm onSubmit={returnTournaments}/>
            <SearchTournamentPanel data={tournaments} error={errorMsg} />

        </div>
    )
}

export default SearchTournaments;