import "./../styles/tournamentCard.css";
import {BrowserRouter, Routes, Route, useNavigate, Navigate} from 'react-router-dom';
import {useState} from "react";

function TournamentCard({
      _id,
      name,
      location,
      maxTeams,
      prize,
      quotaIscrizione,
      deadline,
      startDate,
      endDate,
      status,
      type,
      description,
      showButtonSubscribe,
      showButtonUpdate,
      onUpdate,
      teams

}) {
    const isOpen = status === "In attesa";
    const formattedStartDate = new Date(startDate).toLocaleDateString("it-IT");
    const formattedEndDate = new Date(endDate).toLocaleDateString("it-IT");
    const formattedDeadline = new Date(deadline).toLocaleDateString("it-IT");

    const [nameBar, setNameBar] = useState({
        active: false,
        content: ''
    });

    const [firstButtonSubscribe, setFirstButtonSubscribe] = useState(true)

    const [errorSubscribe, setErrorSubscribe] = useState({
        errorMessage:'',
        active: false,
    });

    const handleNameBarChange = (e) => {
        const value = e.target.value;
        setNameBar({...nameBar, content: value});
    }

    const API_URL = import.meta.env.VITE_API_TOURNAMENTS_URL
    const accessToken = localStorage.getItem("accessToken")
    const user = JSON.parse(localStorage.getItem("user"))
    const userId = user._id
    const handleSubscribe = async (e) => {
        e.preventDefault()

        const res = await fetch(`${API_URL}/subscribeTeam/${_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({teamName: nameBar.content})

        })
        const data = await res.json()
        let errorSubscribeMsg = '';
        if (res.status===400) {
            errorSubscribeMsg = JSON.stringify(data.message);
            setErrorSubscribe({
                errorMessage: errorSubscribeMsg,
                active: true,
            });
        }
    }
    const handleFirstSubscribeClick = ()=>{
        setNameBar({...nameBar, active: true})
         setFirstButtonSubscribe(false)
    }

    const handleBackButtonClick = () => {
        setNameBar({...nameBar, active: false})
        setFirstButtonSubscribe(true)
    }

    return(
        <div className="tournament-card">
            <div className="tournament-header">
                <h2>{name}</h2>
                <span className={`${isOpen ? "badge-open" : "badge-closed"}`}>
                    {isOpen ? "Aperto" : "Completo"}
                </span>
            </div>
            <p className="location">{location}</p>

            <div className="details">
                <p>{maxTeams} squadre</p>
            </div>
            <div className="deadline">
                <p className="deadline"> Scadenza iscrizioni: {formattedDeadline}</p>
            </div>
            <p className="date"> Data inzio: {formattedStartDate} - Data fine: {formattedEndDate}</p>


            <div className="prize">
                <p>PREMI: {prize}</p>
                <p>Quota: €{quotaIscrizione}</p>
                <p>Tipo torneo: {type}</p>
                <p>Descrizione : {description}</p>
                {!showButtonUpdate && !showButtonSubscribe && <p>Squadra: {teams[0].name }</p> }
            </div>

            <div className="footer">
                {showButtonSubscribe && firstButtonSubscribe &&
                    <button
                        onClick={handleFirstSubscribeClick}
                        className="subscribe-button"
                        disabled={!isOpen}
                    >
                        {isOpen ? "Iscriviti" : "Completo"}
                    </button> }

                { showButtonUpdate &&
                    <button
                        onClick={onUpdate}
                        className="subscribe-button"
                    >
                        Modifica
                    </button>

                }
                {
                    nameBar.active &&
                    <form className='subscribe-form' onSubmit={handleSubscribe} >
                        <label className='label-name' >Inserire nome torneo</label>
                        <input type='text' name='content' placeholder='Text' className='name-team-input' value={nameBar.content} onChange={handleNameBarChange}></input>
                        <div id= 'button-row'>
                        <button type='submit' className='subscribe-button' >Iscriviti</button>
                        <button type='button' className='subscribe-button' id='back' onClick={handleBackButtonClick} >Annulla</button>
                        </div>
                </form>
                }
                {errorSubscribe.active && <div className="error">{errorSubscribe.errorMessage}</div>}

            </div>
        </div>
    );
}

export default TournamentCard;