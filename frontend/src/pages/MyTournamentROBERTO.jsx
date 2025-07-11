import React, { useEffect, useState } from 'react';
import TournamentCard from "./../components/TournamentCard.jsx";
import { useNavigate } from "react-router-dom";

function MyTournamentROBERTO() {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyTournaments = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const response = await fetch(`${API_URL}/api/tournaments/myTournament`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || "Errore durante il fetch");
                }

                const myTournaments = await response.json();
                setTournaments(myTournaments);
            } catch (error) {
                console.error("Errore nella fetch:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyTournaments();
    }, []);

    if (loading) return <p>Caricamento tornei iscritti...</p>;
    if (error) return <p>Errore: {error.message}</p>;

    return (
        <div className="my-tournament">
            <h1>Tornei a cui sei iscritto:</h1>

            {tournaments.length === 0 ? (
                <p>Non sei iscritto a nessun torneo.</p>
            ) : (
                <div className="griglia-torneo">
                    {tournaments.map((t) => (
                        <TournamentCard
                            key={t._id}
                            {...t}
                            showButtonSubscribe={false}
                            showButtonUpdate={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyTournamentROBERTO;
