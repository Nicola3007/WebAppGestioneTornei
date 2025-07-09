import { useEffect, useState } from "react";
import { TournamentCard } from "./TournamentCard";
import Login from "../pages/Login.jsx";

function TournamentList() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await fetch("http://localhost:3001/searchTournaments");
                const data = await response.json();
                setTournaments(data);
            } catch (err) {
                console.error("Errore nella fetch dei tornei:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTournaments();
    }, []);

    const handleIscrizione = (id) => {
        console.log("Iscrizione al torneo con ID:", id);
    };

    const handleDettagli = (id) => {
        console.log("Visualizza dettagli per torneo con ID",id);
    };

    if (loading) return <p>Caricamento tornei...</p>;

    return (
        <div className="tournament-list">
            {tournaments.map((tournament) => (
                <TournamentCard
                    key={tournament._id}
                    name={tournament.name}
                    isPrivate={tournament.isPrivate}
                    location={tournament.location}
                    type={tournament.type}
                    quotaIscrizione={tournament.quotaIscrizione}
                    startDate={tournament.startDate}
                    endDate={tournament.endDate}
                    status={tournament.status}
                    onSubscribe={() => handleIscrizione(tournament._id)}
                    onViewDetails={() => handleDettagli(tournament._id)}
                />
            ))}
        </div>
    );
}

export default TournamentList;