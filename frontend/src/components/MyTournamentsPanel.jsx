import React, { useEffect, useState } from "react";
import TournamentCard from "./TournamentCard.jsx";
import '../styles/tournamentsPanel.css'

function MyTournamentsPanel() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_TOURNAMENTS_URL;

    useEffect(() => {

        const fetchTournaments = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user._id) {
                }

                const response = await fetch(`${API_URL}/search?createdBy=${user._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                setTournaments(data);
            } catch (error) {
                console.log("Errore nella fetch: ", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

         fetchTournaments();
    }, []);

    if (loading) return <p>Caricamento tornei</p>;
    if (error) return <p>Errore: {error}</p>;

    return (
        <div className="pagina-tornei">
            <h1>I miei tornei</h1>
            <div className="griglia-tornei">
                {tournaments.map((t) => (
                    <TournamentCard
                        key={t._id}
                        {...t}
                        onViewDetails={() => {}}
                        showButton={false}
                    />
                ))}
            </div>
        </div>
    );
}

export default MyTournamentsPanel;
