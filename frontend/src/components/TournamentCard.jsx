import "./../styles/tournamentCard.css";
import {BrowserRouter, Routes, Route, useNavigate, Navigate} from 'react-router-dom';

function TournamentCard({
      name,
      location,
      isPrivate,
      maxTeams,
      prize,
      quotaIscrizione,
      startDate,
      endDate,
      status,
      onSubscribe,
      onUpdate,
}) {
    const isOpen = status === "In attesa";
    const formattedStartDate = new Date(startDate).toLocaleDateString("it-IT");
    const formattedEndDate = new Date(endDate).toLocaleDateString("it-IT");
    const navigate = useNavigate();

    return(
        <div className="tournament-card">
            <div className="tournament-header">
                <h2>{name}</h2>
                <span className={`badge ${isOpen ? "badge-open" : "badge-closed"}`}>
                    {isOpen ? "Aperto" : "Completo"}
                </span>
            </div>
            <p className="location">{location}</p>

            <div className="details">
                <p>{maxTeams} squadre</p>
            </div>
            <p className="date">{formattedStartDate} - {formattedEndDate}</p>

            <div className="prize">
                <p>€{prize}</p>
                <p>Quota: €{quotaIscrizione}</p>
            </div>

            <div className="footer">
                <span className={`privacy ${isPrivate ? "privato" : "pubblico"}`}>
                    {isPrivate ? "Privato" : "Pubblico"}
                </span>
                <button onClick={onUpdate} className="update-button">
                </button>
                <button
                    onClick={onSubscribe}
                    className="subscribe-button"
                    disabled={!isOpen}
                >
                    {isOpen ? "Iscriviti" : "Completo"}
                </button>
            </div>
        </div>
    );
}

export default TournamentCard;