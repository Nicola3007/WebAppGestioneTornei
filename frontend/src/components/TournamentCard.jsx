import "./../styles/tournamentCard.css";
import Login from "../pages/Login.jsx";

function TournamentCard({
    name,
    location,
    isPrivate,
    type,
    quotaIscrizione,
    startDate,
    endDate,
    maxTeams,
    prize,
    status,
    onSubscribe,
    onViewDetails
}) {

    const formattedDate = new Date(startDate).toLocaleDateString("it-IT");
    const isOpen = status === "In attesa";

    return (
        <div className="tournament-card">
            <div className="tournament-header">
            <h2>{name}</h2>
                <span> className={`badge ${isOpen ? "badge-open" : "badge-closed"}`}
                    {isOpen ? "Aperto" : "Completo"}
                </span>
            </div>
            <p> className="Location">📍 {location}</p>

            <div className="details">
                <p>👥 {maxTeams} squadre</p>
            </div>
            <p>className="date">📅 {startDate} - {endDate}</p>

            <div className="prize">
                <p>🏆 €{prize}</p>
                <p>Quota: €{quotaIscrizione}</p>
            </div>

            <div className="footer">
                <span className={'privacy ${isPrivate ? "privato" : "pubblico"}'}>
                    {isPrivate ? "Privato" : "Pubblico"}
                </span>
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