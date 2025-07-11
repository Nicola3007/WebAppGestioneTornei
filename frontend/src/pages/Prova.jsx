import React, { useEffect, useState } from "react";
import TournamentCard from "../components/TournamentCard.jsx";
import { useNavigate } from "react-router-dom";
import CreateTournament from "../pages/CreateTournament.jsx";
import TournamentUpdate from "../pages/TournamentUpdate.jsx";

function Prova() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user._id) {
                    throw new Error("Utente non autenticato");
                }

                const response = await fetch(`${API_URL}/api/tournaments/search?createdBy=${user._id}`, {
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
            <h1>Tornei disponibili</h1>
            <button onClick={() => navigate("/crea-torneo")}>Crea un nuovo torneo</button>
            <div className="griglia-tornei">
                {tournaments.map((t) => (
                    <TournamentCard
                        key={t._id}
                        {...t}
                        showButtonSubscribe={false}
                        showButtonUpdate={true}
                        onUpdate={() => navigate("/modifica-torneo", {
                        state: {
                            params: {
                                tournament: t
                        }
                        }})}

                    />

                    ))}
            </div>
        </div>
    );
}

export default Prova;
