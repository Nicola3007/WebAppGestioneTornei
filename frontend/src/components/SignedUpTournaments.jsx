import React, { useEffect, useState } from 'react';
import TournamentCard from "./../components/TournamentCard.jsx";
import { useNavigate } from "react-router-dom";
import '../styles/tournamentsPanel.css'

function SignedUpTournaments() {
    const API_URL = import.meta.env.VITE_API_TOURNAMENTS_URL;
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyTournaments = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const response = await fetch(`${API_URL}/signedUpTournaments`, {
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
        <>
            {tournaments.length === 0 ? (
                <p>Non sei iscritto a nessun torneo.</p>
            ) : (
                <div className="griglia-tornei">
                    <h1 className='subscribe-title'>Tornei a cui sei iscritto:</h1>
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
        </>
    );
}

export default SignedUpTournaments;