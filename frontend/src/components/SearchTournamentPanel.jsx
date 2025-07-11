import {useState, useEffect} from 'react'
import TournamentCard from "./TournamentCard.jsx";
import '../styles/tournamentsPanel.css'

function SearchTournamentsPanel({data, error}){

    return (
        <div className='griglia-tornei'>
            {error===''? data.map((t) => (<TournamentCard key={t._id} {...t} showButtonSubscribe={true}  showButtonUpdate={false}  />)): <div className='error-container'><p className='error'>nessun torneo trovato</p></div> }
        </div>
    )
}

export default SearchTournamentsPanel;