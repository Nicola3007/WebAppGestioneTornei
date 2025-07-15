import "./../styles/tournamentCard.css";
import {useNavigate} from 'react-router-dom';
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
    const navigate = useNavigate();
    //per iscrizione
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
    const API_USER_URL = import.meta.env.VITE_API_USER_URL
    let accessToken = localStorage.getItem("accessToken")
    const user = JSON.parse(localStorage.getItem("user"))

    //per la home mostra il nome della squadra
    const handleShowTeamName = () => {
        const myTeam = teams.find((team) => team.captain._id === user._id)
        return myTeam.name;
    }

//per iscrizione
    const handleSubscribe = async (e) => {
        e.preventDefault()

        try {

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

            if (res.status === 401) {

                const responseAccessToken = await fetch(`${API_USER_URL}/refresh`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include"
                });

                const dataNewToken = await responseAccessToken.json();

                if (responseAccessToken.status === 401) {
                    console.log('refresh token scaduto, rifare il login');
                    navigate('/login');
                    return;
                }

                accessToken = dataNewToken.accessToken;
                localStorage.setItem("accessToken", accessToken);

                return handleSubscribe(e);

            }
            if (res.status >= 400 && res.status < 500) {
                errorSubscribeMsg = JSON.stringify(data.message);
                setErrorSubscribe({
                    errorMessage: errorSubscribeMsg,
                    active: true,
                });
            }

            if (res.status === 200) {
                setNameBar({active: false, content: ''});
            }

        }catch (err) {
           console.log(err)
        }
    }

    const handleFirstSubscribeClick = ()=>{
        setNameBar({...nameBar, active: true})
         setFirstButtonSubscribe(false)
    }

    const handleBackButtonClick = () => {
        setNameBar({...nameBar, active: false})
        setFirstButtonSubscribe(true)
        setErrorSubscribe({
            errorMessage: '',
            active: false,
        })


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
                {!showButtonUpdate && !showButtonSubscribe && <p>Squadra: {handleShowTeamName()}</p> }
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
                        <label className='label-name' >Inserire nome della squara</label>
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